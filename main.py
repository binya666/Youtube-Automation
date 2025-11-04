#!/usr/bin/env python3

import sys
import time
import argparse
from datetime import datetime

# Import our modules
from video_scraper import VideoScraper
from video_processor import VideoProcessor
from youtube_manager import YouTubeManager
import config

class VideoAutomationSystem:

    def __init__(self):
        self.scraper = VideoScraper(urls_file=config.URLS_FILE)
        self.downloader = VideoProcessor(
            output_folder=config.VIDEOS_FOLDER,
            urls_file=config.URLS_FILE
        )
        self.uploader = YouTubeManager(
            credentials_file=config.CREDENTIALS_FILE,
            videos_folder=config.VIDEOS_FOLDER
        )

        # Update uploader settings from config
        self.uploader.uploaded_folder = config.UPLOADED_FOLDER
        self.uploader.token_file = config.TOKEN_FILE

    def run_full_workflow(self):
        print(f"\n{'🚀'*10}")
        print("VIDEO AUTOMATION SYSTEM - FULL WORKFLOW")
        print(f"{'🚀'*10}")
        print(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")

        try:
            # Step 1: Scrape videos from Meta AI
            print(f"{'='*60}")
            print("STEP 1: SCRAPING META AI VIDEOS")
            print(f"{'='*60}")
            scraped_urls = self.scraper.scrape_meta_ai_videos(
                start_url=config.META_AI_START_URL,
                num_videos=config.NUM_VIDEOS_TO_SCRAPE,
                headless=config.SCRAPER_HEADLESS
            )

            if not scraped_urls:
                print("⚠ No new videos scraped. Checking for existing URLs...")
                pending_urls = self.scraper.get_pending_urls()
                if not pending_urls:
                    print("✗ No URLs available for download. Exiting.")
                    return False
                else:
                    print(f"✓ Found {len(pending_urls)} existing URLs to process.")

            # Step 2: Download videos
            print(f"\n{'='*60}")
            print("STEP 2: DOWNLOADING VIDEOS")
            print(f"{'='*60}")
            download_stats = self.downloader.download_from_url_list()

            if download_stats['success'] == 0:
                print("✗ No videos downloaded successfully. Exiting.")
                return False

            # Step 3: Authenticate with YouTube
            print(f"\n{'='*60}")
            print("STEP 3: AUTHENTICATING WITH YOUTUBE")
            print(f"{'='*60}")
            self.uploader.authenticate()

            # Step 4: Start scheduled uploads
            print(f"\n{'='*60}")
            print("STEP 4: STARTING SCHEDULED UPLOADS")
            print(f"{'='*60}")
            self.start_scheduled_uploads()

            print(f"\n{'✅'*10}")
            print("WORKFLOW COMPLETED SUCCESSFULLY!")
            print(f"{'✅'*10}")
            return True

        except KeyboardInterrupt:
            print(f"\n\n{'⏹️'*5} Workflow interrupted by user")
            return False
        except Exception as e:
            print(f"\n\n✗ Error in workflow: {e}")
            return False

    def start_scheduled_uploads(self):
        print("Setting up upload schedule...")
        print(f"Upload times: {', '.join(config.UPLOAD_TIMES)}")
        print(f"Videos folder: {config.VIDEOS_FOLDER}/")
        print(f"Uploaded folder: {config.UPLOADED_FOLDER}/")

        # Import schedule here to avoid conflicts
        import schedule

        # Schedule uploads
        for upload_time in config.UPLOAD_TIMES:
            schedule.every().day.at(upload_time).do(self.uploader.process_and_upload)
            print(f"✓ Scheduled upload at {upload_time}")

        print(f"\n{'⏰'*5} Scheduler started!")
        print("The system will automatically upload videos at scheduled times.")
        print("Press Ctrl+C to stop.\n")

        # Show current status
        video_files = self.uploader.get_video_files()
        print(f"📊 Current Status:")
        print(f"  Videos in queue: {len(video_files)}")
        print(f"  Next uploads: {', '.join(config.UPLOAD_TIMES)}")

        # Run scheduler
        try:
            while True:
                schedule.run_pending()
                time.sleep(config.SCHEDULER_CHECK_INTERVAL)
        except KeyboardInterrupt:
            print(f"\n\n{'⏹️'*5} Upload scheduler stopped by user")

    def scrape_only(self):
        print("Scraping videos from Meta AI...")
        urls = self.scraper.scrape_meta_ai_videos(
            start_url=config.META_AI_START_URL,
            num_videos=config.NUM_VIDEOS_TO_SCRAPE,
            headless=config.SCRAPER_HEADLESS
        )
        print(f"Scraped {len(urls)} video URLs")
        return urls

    def download_only(self):
        print("Downloading videos...")
        stats = self.downloader.download_from_url_list()
        print(f"Downloaded {stats['success']} videos")
        return stats

    def upload_only(self):
        print("Starting YouTube uploader...")
        self.uploader.authenticate()
        self.start_scheduled_uploads()

    def show_status(self):
        print(f"\n{'📊'*5} SYSTEM STATUS {'📊'*5}")

        # Scraper status
        try:
            pending_urls = len(self.scraper.get_pending_urls())
            print(f"📋 Scraped URLs: {pending_urls} pending")
        except:
            print("📋 Scraped URLs: Unable to read")

        # Downloader status
        try:
            downloaded_count = self.downloader.get_downloaded_count()
            pending_downloads = len(self.downloader.get_pending_urls())
            print(f"⬇️ Downloaded videos: {downloaded_count} completed, {pending_downloads} pending")
        except:
            print("⬇️ Downloaded videos: Unable to read")

        # Uploader status
        try:
            video_files = len(self.uploader.get_video_files())
            print(f"⬆️ Videos ready for upload: {video_files}")
        except:
            print("⬆️ Videos ready for upload: Unable to read")

        print(f"{'📊'*15}\n")

    def schedule_videos(self):
        print("Starting Video Scheduler...")
        print("This will upload all videos and schedule them for optimal viewing times.")
        
        try:
            self.uploader.authenticate()
            uploaded, failed = self.uploader.upload_and_schedule_all_videos()
            
            print(f"\n{'✅'*5} SCHEDULING COMPLETE {'✅'*5}")
            if uploaded > 0:
                print(f"✅ Successfully uploaded and scheduled: {uploaded} videos")
                print(f"📁 Videos moved to: {config.UPLOADED_FOLDER}/")
                print(f"🎬 Videos will publish automatically at scheduled times!")
                print(f"📅 Next publish time: {config.UPLOAD_TIMES[0] if config.UPLOAD_TIMES else 'N/A'}")
            
            if failed > 0:
                print(f"❌ Failed uploads: {failed} videos")
                print("   These videos remain in the videos/ folder")
                
        except Exception as e:
            print(f"❌ Error during scheduling: {e}")


def show_interactive_menu():
    print(f"\n{'🎬'*20}")
    print("  VIDEO AUTOMATION SYSTEM")
    print(f"{'🎬'*20}")
    print("\nSelect an operation:")
    print("1. Run Full Workflow (Scrape → Download → Upload)")
    print("2. Scrape Videos Only")
    print("3. Download Videos Only") 
    print("4. Upload Videos Only (Scheduled)")
    print("5. Show System Status")
    print("6. Video Scheduler (Upload & Schedule)")
    print("0. Exit")
    print(f"\n{'='*50}")
    
    while True:
        try:
            choice = input("Enter your choice (0-6): ").strip()
            if choice in ['0', '1', '2', '3', '4', '5', '6']:
                return int(choice)
            else:
                print("❌ Invalid choice! Please enter a number between 0-6.")
        except (ValueError, KeyboardInterrupt):
            print("\n👋 Goodbye!")
            return 0

def main():
    # Check if command line arguments are provided
    if len(sys.argv) > 1:
        # Use command line mode
        parser = argparse.ArgumentParser(
            description='Video Automation System - Meta AI → Download → YouTube Upload',
            formatter_class=argparse.RawDescriptionHelpFormatter,
            epilog="""
Examples:
  python main.py --mode full          # Run complete workflow
  python main.py --mode scrape        # Only scrape videos
  python main.py --mode download      # Only download videos
  python main.py --mode schedule      # Only upload (scheduled)
  python main.py --mode status        # Show system status
  python main.py --mode scheduler     # Upload & schedule all videos
            """
        )

        parser.add_argument(
            '--mode',
            choices=['full', 'scrape', 'download', 'schedule', 'status', 'scheduler'],
            default='full',
            help='Operation mode (default: full)'
        )

        args = parser.parse_args()
        mode = args.mode
    else:
        # Use interactive mode
        choice = show_interactive_menu()
        if choice == 0:
            print("👋 Goodbye!")
            return
        
        mode_map = {
            1: 'full',
            2: 'scrape', 
            3: 'download',
            4: 'schedule',
            5: 'status',
            6: 'scheduler'
        }
        mode = mode_map[choice]

    # Initialize the system
    system = VideoAutomationSystem()

    # Execute based on mode
    print(f"\n🚀 Starting operation: {mode.upper()}\n")
    
    if mode == 'full':
        success = system.run_full_workflow()
        sys.exit(0 if success else 1)

    elif mode == 'scrape':
        system.scrape_only()

    elif mode == 'download':
        system.download_only()

    elif mode == 'schedule':
        system.upload_only()

    elif mode == 'status':
        system.show_status()

    elif mode == 'scheduler':
        system.schedule_videos()


if __name__ == '__main__':
    main()