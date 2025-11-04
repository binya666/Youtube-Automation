import os
import json
import time
from datetime import datetime
from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeout
import pandas as pd

class VideoScraper:
    def __init__(self, urls_file='video_urls.xlsx'):
        self.urls_file = urls_file
        self.scraped_urls = []
        
    def load_existing_urls(self):
        if os.path.exists(self.urls_file):
            try:
                df = pd.read_excel(self.urls_file)
                if 'url' in df.columns:
                    return set(df['url'].dropna().tolist())
                return set()
            except Exception as e:
                print(f"Warning: Could not read existing URLs from {self.urls_file}: {e}")
                return set()
        return set()
    
    def save_urls(self, urls):
        existing_urls = self.load_existing_urls()
        new_urls = set(urls) - existing_urls
        
        # Load existing data if file exists
        if os.path.exists(self.urls_file):
            try:
                existing_df = pd.read_excel(self.urls_file)
                if 'url' in existing_df.columns and 'status' in existing_df.columns:
                    # Keep existing URLs with their current status
                    existing_data = existing_df.copy()
                else:
                    # Recreate if columns are missing
                    existing_data = pd.DataFrame(columns=['url', 'scraped_date', 'status'])
            except Exception as e:
                print(f"Warning: Could not read existing data: {e}")
                existing_data = pd.DataFrame(columns=['url', 'scraped_date', 'status'])
        else:
            existing_data = pd.DataFrame(columns=['url', 'scraped_date', 'status'])
        
        # Add new URLs with 'pending' status
        current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        new_data = pd.DataFrame({
            'url': list(new_urls),
            'scraped_date': [current_time] * len(new_urls),
            'status': ['pending'] * len(new_urls)
        })
        
        # Combine existing and new data
        combined_df = pd.concat([existing_data, new_data], ignore_index=True)
        
        # Remove duplicates based on URL, keeping the first occurrence
        combined_df = combined_df.drop_duplicates(subset=['url'], keep='first')
        
        # Save to Excel
        combined_df.to_excel(self.urls_file, index=False, engine='openpyxl')
        
        print(f"✓ Saved {len(new_urls)} new URLs to {self.urls_file}")
        print(f"  Total unique URLs: {len(combined_df)}")
        print(f"  Pending downloads: {len(combined_df[combined_df['status'] == 'pending'])}")
    
    def extract_video_url_from_post(self, page):
        try:
            # Wait for video elements to load
            page.wait_for_selector('video, [data-video-url], a[href*="meta.ai"]', timeout=10000)
            
            # Method 1: Try to find direct video elements
            video_elements = page.query_selector_all('video')
            for video in video_elements:
                video_src = video.get_attribute('src')
                if video_src and video_src.startswith('http'):
                    return video_src
            
            # Method 2: Try to find video URLs in data attributes
            video_containers = page.query_selector_all('[data-video-url]')
            for container in video_containers:
                video_url = container.get_attribute('data-video-url')
                if video_url and video_url.startswith('http'):
                    return video_url
            
            # Method 3: Try to find links with video parameters
            video_links = page.query_selector_all('a[href*="meta.ai"]')
            for link in video_links:
                href = link.get_attribute('href')
                if href and ('video' in href or 'vibes' in href):
                    return href
            
            # Method 4: Get current page URL as fallback
            current_url = page.url
            if current_url and 'meta.ai' in current_url:
                return current_url
            
            return None
            
        except Exception as e:
            print(f"  Warning: Could not extract video URL: {e}")
            return None
    
    def extract_all_video_urls_from_page(self, page):
        urls = []
        try:
            # Wait for content to load
            page.wait_for_timeout(3000)
            
            # Method 1: Find direct video elements
            video_elements = page.query_selector_all('video')
            
            for i, video in enumerate(video_elements):
                src = video.get_attribute('src')
                if src and src.startswith('http') and not src.startswith('blob:'):
                    urls.append(src)
            
            # Method 2: Find video URLs in data attributes
            video_containers = page.query_selector_all('[data-video-url], [data-src]')
            
            for container in video_containers:
                video_url = container.get_attribute('data-video-url') or container.get_attribute('data-src')
                if video_url and video_url.startswith('http') and not video_url.startswith('blob:'):
                    urls.append(video_url)
            
            # Method 3: Look for video URLs in page source
            content = page.content()
            import re
            video_patterns = [
                r'https://[^"\']*\.(?:mp4|mov|avi|mkv|webm)[^"\'\s]*',
                r'"(https://[^"]*\.(?:mp4|mov|avi|mkv|webm)[^"]*)"',
                r"'(https://[^']*\.(?:mp4|mov|avi|mkv|webm)[^']*)'"
            ]
            
            for pattern in video_patterns:
                matches = re.findall(pattern, content)
                for match in matches:
                    if match not in urls and 'meta.ai' in match and not match.startswith('blob:'):
                        urls.append(match)
            
            # Remove duplicates
            urls = list(set(urls))
            
            return urls
            
        except Exception as e:
            print(f"  Error extracting video URLs: {e}")
            return []
    
    def scrape_meta_ai_videos(self, start_url, num_videos=10, headless=False):
        print(f"\n{'='*60}")
        print(f"Starting Meta AI Vibes Video Scraper")
        print(f"{'='*60}")
        print(f"Target: {num_videos} videos")
        print(f"Start URL: {start_url}\n")
        
        scraped_urls = []
        existing_urls = self.load_existing_urls()
        
        with sync_playwright() as p:
            # Launch browser
            browser = p.chromium.launch(headless=headless)
            context = browser.new_context(
                viewport={'width': 1280, 'height': 720},
                user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            )
            page = context.new_page()
            
            try:
                # Navigate to vibes page
                print(f"Loading vibes page...")
                page.goto(start_url, wait_until='domcontentloaded', timeout=30000)
                time.sleep(5)  # Wait for dynamic content
                
                videos_found = 0
                scroll_attempts = 0
                max_scroll_attempts = 20  # Reduced since we want exactly 20 videos
                
                while videos_found < num_videos and scroll_attempts < max_scroll_attempts:
                    print(f"\nScroll attempt {scroll_attempts + 1}/{max_scroll_attempts}")
                    
                    # Extract all post URLs currently visible on page
                    current_urls = self.extract_all_video_urls_from_page(page)
                    
                    for url in current_urls:
                        if url not in existing_urls and url not in scraped_urls:
                            scraped_urls.append(url)
                            videos_found += 1
                            
                            # Stop immediately when we reach the target
                            if videos_found >= num_videos:
                                break
                    
                    if videos_found >= num_videos:
                        break
                    
                    # Scroll down to load more posts
                    print(f"  Scrolling to load more posts...")
                    
                    # Try different scroll methods
                    try:
                        # Scroll by larger amount to load more content
                        page.evaluate('window.scrollBy(0, 1200)')
                        time.sleep(4)  # Longer wait for content to load
                        
                        # Try clicking "Load more" or similar buttons if they exist
                        load_more_buttons = page.query_selector_all('button:has-text("Load"), button:has-text("More"), [aria-label*="Load"]')
                        for button in load_more_buttons:
                            try:
                                button.click()
                                time.sleep(3)
                            except:
                                pass
                                
                    except Exception as e:
                        print(f"  Warning: Scroll error: {e}")
                    
                    scroll_attempts += 1
                
                print(f"\n{'='*60}")
                print(f"Scraping Complete!")
                print(f"  Videos found: {videos_found}/{num_videos}")
                print(f"{'='*60}\n")
                
            except PlaywrightTimeout:
                print("\n✗ Error: Page load timeout. Check your internet connection.")
            except Exception as e:
                print(f"\n✗ Error during scraping: {e}")
            finally:
                browser.close()
        
        # Save URLs
        if scraped_urls:
            self.save_urls(scraped_urls)
        
        return scraped_urls
    
    def get_pending_urls(self):
        if not os.path.exists(self.urls_file):
            return []
        
        try:
            df = pd.read_excel(self.urls_file)
            if 'url' in df.columns:
                # Filter for URLs that haven't been downloaded (status != 'downloaded')
                pending_df = df[df['status'] != 'downloaded']
                return pending_df['url'].dropna().tolist()
            return []
        except Exception as e:
            print(f"Warning: Could not read pending URLs: {e}")
            return []


def main():
    scraper = VideoScraper()
    
    # Example URL - replace with your actual Meta AI post URL
    start_url = "https://www.meta.ai/@muhammad31487/post/sV8iTZ27MWW/"
    
    # Scrape 10 videos
    urls = scraper.scrape_meta_ai_videos(
        start_url=start_url,
        num_videos=10,
        headless=False  # Set True to hide browser window
    )
    
    print(f"\nScraped {len(urls)} video URLs!")
    for i, url in enumerate(urls, 1):
        print(f"{i}. {url}")


if __name__ == '__main__':
    main()