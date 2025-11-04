import os
import json
import subprocess
import re
import hashlib
from datetime import datetime

class VideoProcessor:
    def __init__(self, output_folder='videos', urls_file='video_urls.json'):
        self.output_folder = output_folder
        self.urls_file = urls_file
        self.downloaded_log = 'downloaded_log.json'
        
        # Create output folder
        os.makedirs(self.output_folder, exist_ok=True)
    
    def load_downloaded_log(self):
        if os.path.exists(self.downloaded_log):
            try:
                with open(self.downloaded_log, 'r') as f:
                    data = json.load(f)
                    return data.get('downloads', {})
            except:
                return {}
        return {}
    
    def save_downloaded_log(self, url, filename, success=True):
        log_data = self.load_downloaded_log()
        
        log_data[url] = {
            'filename': filename,
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'success': success,
            'output_folder': self.output_folder
        }
        
        data = {
            'downloads': log_data,
            'last_download': {
                'url': url,
                'filename': filename,
                'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                'success': success
            },
            'total_downloads': len([k for k, v in log_data.items() if v['success']])
        }
        
        with open(self.downloaded_log, 'w') as f:
            json.dump(data, f, indent=2)
    
    def sanitize_filename(self, filename):
        # Remove or replace invalid characters
        filename = re.sub(r'[<>:"/\\|?*]', '', filename)
        # Remove extra spaces
        filename = re.sub(r'\s+', ' ', filename).strip()
        # Limit length
        if len(filename) > 200:
            filename = filename[:200]
        return filename
    
    def calculate_file_hash(self, filepath):
        hash_sha256 = hashlib.sha256()
        try:
            with open(filepath, "rb") as f:
                for chunk in iter(lambda: f.read(4096), b""):
                    hash_sha256.update(chunk)
            return hash_sha256.hexdigest()
        except Exception as e:
            print(f"  Warning: Could not calculate hash for {filepath}: {e}")
            return None
    
    def check_duplicate_content(self, filepath):
        if not os.path.exists(filepath):
            return False, None
            
        new_hash = self.calculate_file_hash(filepath)
        if not new_hash:
            return False, None
            
        # Check all existing video files
        for filename in os.listdir(self.output_folder):
            if filename.endswith(('.mp4', '.mov', '.avi', '.mkv', '.webm')):
                existing_path = os.path.join(self.output_folder, filename)
                if existing_path != filepath:  # Don't compare with itself
                    existing_hash = self.calculate_file_hash(existing_path)
                    if existing_hash and existing_hash == new_hash:
                        print(f"  ⚠ Duplicate content detected! File {filename} has same content.")
                        return True, filename
        return False, None
    
    def check_ytdlp_installed(self):
        try:
            result = subprocess.run(
                ['yt-dlp', '--version'],
                capture_output=True,
                text=True,
                check=False
            )
            return result.returncode == 0
        except FileNotFoundError:
            return False
    
    def download_video(self, url, custom_filename=None):
        
        # Check if yt-dlp is installed
        if not self.check_ytdlp_installed():
            print(f"\n✗ Error: yt-dlp is not installed!")
            print(f"  Install it with: pip install yt-dlp")
            return False, None
        
        # Check if URL was already downloaded
        downloaded_log = self.load_downloaded_log()
        if url in downloaded_log:
            existing_entry = downloaded_log[url]
            if existing_entry.get('success', False):
                print(f"\n⚠ URL already downloaded: {existing_entry.get('filename', 'unknown')}")
                print(f"  Timestamp: {existing_entry.get('timestamp', 'unknown')}")
                print(f"  Skipping duplicate URL...")
                return False, None
        
        try:
            print(f"\n{'='*60}")
            print(f"Downloading video...")
            print(f"URL: {url[:70]}{'...' if len(url) > 70 else ''}")
            print(f"{'='*60}\n")
            
            # Generate timestamp for unique filenames
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            
            # Configure output template
            if custom_filename:
                # Use custom filename
                clean_name = self.sanitize_filename(custom_filename)
                output_template = os.path.join(
                    self.output_folder,
                    f'{clean_name}.%(ext)s'
                )
            else:
                # Auto-generate filename with timestamp
                output_template = os.path.join(
                    self.output_folder,
                    f'video_{timestamp}_%(title)s.%(ext)s'
                )
            
            # yt-dlp command optimized for Meta AI and general video downloads
            command = [
                'yt-dlp',
                url,
                '-o', output_template,
                
                # Format options
                '--format', 'best',  # Download best quality
                '--merge-output-format', 'mp4',  # Convert to mp4
                
                # Download options
                '--no-playlist',  # Don't download playlists
                '--no-warnings',  # Reduce noise
                
                # Progress display
                '--newline',  # Better progress output
                
                # Network options
                '--socket-timeout', '30',
                '--retries', '3',
                
                # Headers to avoid blocks
                '--add-header', 'User-Agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                '--add-header', 'Accept:text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                '--add-header', 'Accept-Language:en-US,en;q=0.9',
                
                # Cookies (helpful for some sites)
                '--no-check-certificates',
                
                # Metadata
                '--embed-metadata',  # Embed metadata in video
            ]
            
            # Get list of files before download
            files_before = set(os.listdir(self.output_folder))
            
            # Execute download
            print("Starting download with yt-dlp...")
            result = subprocess.run(
                command,
                capture_output=True,
                text=True,
                check=False
            )
            
            # Get list of files after download
            files_after = set(os.listdir(self.output_folder))
            new_files = files_after - files_before
            
            if result.returncode == 0 and new_files:
                # Download successful
                downloaded_file = list(new_files)[0]
                file_path = os.path.join(self.output_folder, downloaded_file)
                file_size = os.path.getsize(file_path) / (1024 * 1024)  # Size in MB
                
                # Check for duplicate content
                is_duplicate, existing_file = self.check_duplicate_content(file_path)
                if is_duplicate:
                    print(f"\n⚠ Duplicate video detected! Removing {downloaded_file}")
                    print(f"  Identical content already exists as: {existing_file}")
                    try:
                        os.remove(file_path)
                        print(f"  ✓ Deleted duplicate file")
                    except Exception as e:
                        print(f"  Warning: Could not delete duplicate file: {e}")
                    
                    # Don't log as successful download
                    print(f"  Skipping duplicate content for URL: {url[:60]}...")
                    return False, None
                
                print(f"\n✓ Download successful!")
                print(f"  Saved as: {downloaded_file}")
                print(f"  File size: {file_size:.2f} MB")
                print(f"  Location: {self.output_folder}/")
                
                # Log the download
                self.save_downloaded_log(url, downloaded_file, success=True)
                
                return True, downloaded_file
            else:
                # Download failed
                print(f"\n✗ Download failed!")
                
                # Show error details
                if result.stderr:
                    error_lines = result.stderr.strip().split('\n')
                    # Show last few error lines
                    print(f"  Error details:")
                    for line in error_lines[-3:]:
                        if line.strip():
                            print(f"    {line.strip()}")
                
                # Common error messages
                if 'Unsupported URL' in result.stderr:
                    print(f"\n  💡 Tip: This URL might not be supported by yt-dlp")
                    print(f"     Try copying the direct video URL instead of the page URL")
                elif '403' in result.stderr or 'Forbidden' in result.stderr:
                    print(f"\n  💡 Tip: Access forbidden. The video might be private or region-locked")
                elif '404' in result.stderr or 'Not Found' in result.stderr:
                    print(f"\n  💡 Tip: Video not found. Check if the URL is correct")
                
                # Log the failed download
                self.save_downloaded_log(url, None, success=False)
                
                return False, None
        
        except FileNotFoundError:
            print(f"\n✗ Error: yt-dlp not found!")
            print(f"  Install it with: pip install yt-dlp")
            return False, None
        except Exception as e:
            print(f"\n✗ Unexpected error: {e}")
            self.save_downloaded_log(url, None, success=False)
            return False, None
    
    def download_from_url_list(self, urls=None):
        if urls is None:
            # Load URLs from Excel file (created by scraper)
            if not os.path.exists(self.urls_file):
                print(f"✗ Error: {self.urls_file} not found!")
                print(f"  Run the scraper first to generate URLs")
                return {'success': 0, 'failed': 0, 'skipped': 0}
            
            try:
                import pandas as pd
                # Read Excel file with proper encoding
                df = pd.read_excel(self.urls_file, engine='openpyxl')
                
                # Filter for URLs with 'pending' status
                if 'status' in df.columns and 'url' in df.columns:
                    pending_df = df[df['status'] == 'pending']
                    urls = pending_df['url'].dropna().tolist()
                elif 'url' in df.columns:
                    # If no status column, use all URLs
                    urls = df['url'].dropna().tolist()
                else:
                    print(f"✗ Error: No 'url' column found in {self.urls_file}")
                    return {'success': 0, 'failed': 0, 'skipped': 0}
                    
            except UnicodeDecodeError:
                # Try with different encoding if default fails
                try:
                    import pandas as pd
                    df = pd.read_excel(self.urls_file, engine='openpyxl')
                    if 'status' in df.columns and 'url' in df.columns:
                        pending_df = df[df['status'] == 'pending']
                        urls = pending_df['url'].dropna().tolist()
                    elif 'url' in df.columns:
                        urls = df['url'].dropna().tolist()
                    else:
                        print(f"✗ Error: No 'url' column found in {self.urls_file}")
                        return {'success': 0, 'failed': 0, 'skipped': 0}
                except Exception as e:
                    print(f"✗ Error reading Excel file with UTF-8: {e}")
                    return {'success': 0, 'failed': 0, 'skipped': 0}
            except Exception as e:
                print(f"✗ Error reading {self.urls_file}: {e}")
                return {'success': 0, 'failed': 0, 'skipped': 0}
        
        if not urls:
            print("⚠ No URLs to download!")
            return {'success': 0, 'failed': 0, 'skipped': 0}
        
        print(f"\n{'#'*60}")
        print(f"# Batch Download Started")
        print(f"# Total URLs: {len(urls)}")
        print(f"# Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"{'#'*60}\n")
        
        # Load download history
        downloaded_log = self.load_downloaded_log()
        stats = {
            'success': 0,
            'failed': 0,
            'skipped': 0,
            'downloaded_files': []
        }
        
        for i, url in enumerate(urls, 1):
            print(f"\n{'─'*60}")
            print(f"[{i}/{len(urls)}] Processing URL...")
            print(f"{'─'*60}")
            
            # Skip if already downloaded successfully
            if url in downloaded_log and downloaded_log[url].get('success'):
                filename = downloaded_log[url].get('filename', 'unknown')
                print(f"⊘ Already downloaded: {filename}")
                print(f"  Skipping...")
                stats['skipped'] += 1
                continue
            
            # Download video
            success, filename = self.download_video(url)
            
            if success:
                stats['success'] += 1
                stats['downloaded_files'].append(filename)
            else:
                stats['failed'] += 1
            
            # Small delay between downloads
            if i < len(urls):
                import time
                time.sleep(1)
        
        # Print summary
        print(f"\n{'='*60}")
        print(f"Download Summary:")
        print(f"{'='*60}")
        print(f"  ✓ Successful: {stats['success']}")
        print(f"  ✗ Failed: {stats['failed']}")
        print(f"  ⊘ Skipped: {stats['skipped']}")
        print(f"  Total processed: {len(urls)}")
        print(f"{'='*60}\n")
        
        if stats['downloaded_files']:
            print(f"Downloaded files:")
            for file in stats['downloaded_files']:
                print(f"  • {file}")
            print()
        
        return stats
    
    def download_single_url(self, url, filename=None):
        success, downloaded_file = self.download_video(url, filename)
        return success
    
    def get_downloaded_count(self):
        log = self.load_downloaded_log()
        return len([v for v in log.values() if v.get('success')])
    
    def get_pending_urls(self):
        if not os.path.exists(self.urls_file):
            return []
        
        try:
            with open(self.urls_file, 'r') as f:
                data = json.load(f)
                all_urls = data.get('scraped_urls', [])
            
            downloaded_log = self.load_downloaded_log()
            pending = [
                url for url in all_urls
                if url not in downloaded_log or not downloaded_log[url].get('success')
            ]
            return pending
        except:
            return []
    
    def clear_failed_downloads(self):
        log = self.load_downloaded_log()
        cleaned = {k: v for k, v in log.items() if v.get('success')}
        
        data = {
            'downloads': cleaned,
            'total_downloads': len(cleaned),
            'last_updated': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }
        
        with open(self.downloaded_log, 'w') as f:
            json.dump(data, f, indent=2)
        
        removed = len(log) - len(cleaned)
        print(f"✓ Removed {removed} failed download entries from log")


def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='Video Downloader for Meta AI Videos')
    parser.add_argument('--url', type=str, help='Single URL to download')
    parser.add_argument('--batch', action='store_true', help='Download all URLs from video_urls.xlsx')
    parser.add_argument('--output', type=str, default='videos', help='Output folder')
    parser.add_argument('--filename', type=str, help='Custom filename for single download')
    parser.add_argument('--stats', action='store_true', help='Show download statistics')
    parser.add_argument('--pending', action='store_true', help='Show pending URLs')
    parser.add_argument('--clear-failed', action='store_true', help='Clear failed downloads from log')
    
    args = parser.parse_args()
    
    downloader = VideoProcessor(output_folder=args.output)
    
    if args.stats:
        # Show statistics
        count = downloader.get_downloaded_count()
        pending = len(downloader.get_pending_urls())
        print(f"\n📊 Download Statistics:")
        print(f"  Successfully downloaded: {count}")
        print(f"  Pending downloads: {pending}\n")
    
    elif args.pending:
        # Show pending URLs
        pending = downloader.get_pending_urls()
        print(f"\n📋 Pending URLs ({len(pending)}):")
        for i, url in enumerate(pending, 1):
            print(f"  {i}. {url[:70]}{'...' if len(url) > 70 else ''}")
        print()
    
    elif args.clear_failed:
        # Clear failed downloads
        downloader.clear_failed_downloads()
    
    elif args.url:
        # Download single URL
        print("Downloading single video...")
        downloader.download_single_url(args.url, args.filename)
    
    elif args.batch:
        # Batch download from file
        print("Batch downloading from video_urls.xlsx...")
        stats = downloader.download_from_url_list()
    
    else:
        # Default: batch download
        print("Downloading videos from video_urls.xlsx...")
        print("(Use --help to see all options)\n")
        stats = downloader.download_from_url_list()


if __name__ == '__main__':
    main()