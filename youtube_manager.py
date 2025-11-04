import os
import pickle
import schedule
import time
import shutil
from datetime import datetime
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow  # type: ignore
from googleapiclient.discovery import build  # type: ignore
from googleapiclient.http import MediaFileUpload  # type: ignore
from googleapiclient.errors import HttpError  # type: ignore
from hachoir.metadata import extractMetadata  # type: ignore
from hachoir.parser import createParser  # type: ignore
import config

# API scopes
SCOPES = [
    'https://www.googleapis.com/auth/youtube.upload',
    'https://www.googleapis.com/auth/youtube.readonly'
]

class YouTubeManager:
    def __init__(self, credentials_file='credentials.json', videos_folder='videos'):
        self.credentials_file = credentials_file
        self.token_file = 'token.pickle'
        self.videos_folder = videos_folder
        self.uploaded_folder = 'uploaded'
        self.creds = None
        self.youtube = None
        
        # Create necessary folders
        os.makedirs(self.videos_folder, exist_ok=True)
        os.makedirs(self.uploaded_folder, exist_ok=True)
        
    def authenticate(self):
        # Load saved credentials
        if os.path.exists(self.token_file):
            with open(self.token_file, 'rb') as token:
                self.creds = pickle.load(token)
        
        # If no valid credentials, let user log in
        if not self.creds or not self.creds.valid:
            if self.creds and self.creds.expired and self.creds.refresh_token:
                self.creds.refresh(Request())
            else:
                flow = InstalledAppFlow.from_client_secrets_file(
                    self.credentials_file, SCOPES)
                self.creds = flow.run_local_server(port=0)
            
            # Save credentials for future use
            with open(self.token_file, 'wb') as token:
                pickle.dump(self.creds, token)
        
        # Build YouTube service
        self.youtube = build('youtube', 'v3', credentials=self.creds)
        print("✓ Authentication successful!")
    
    def get_video_files(self):
        video_extensions = ('.mp4', '.avi', '.mov', '.mkv', '.flv', '.wmv', '.webm', '.m4v', '.3gp')
        
        video_files = [
            f for f in os.listdir(self.videos_folder)
            if f.lower().endswith(video_extensions) and os.path.isfile(os.path.join(self.videos_folder, f))
        ]
        
        # Sort by creation time (oldest first)
        video_files.sort(key=lambda x: os.path.getctime(os.path.join(self.videos_folder, x)))
        
        return video_files
    
    def generate_title(self, filename):
        import random

        # Try to extract title from video metadata first
        video_path = os.path.join(self.videos_folder, filename)
        try:
            parser = createParser(video_path)
            if parser:
                metadata = extractMetadata(parser)
                if metadata and metadata.get('title'):
                    title = metadata.get('title')
                    title = title.strip()
                    if len(title) > 5 and len(title) <= 100:  # Only use if meaningful
                        return title
        except Exception as e:
            print(f"Warning: Could not extract metadata from {filename}: {e}")

        # Generate unique, engaging titles based on content type
        # Analyze filename for clues about content
        base_name = os.path.splitext(filename)[0].lower()

        # Title templates for different content types
        title_templates = {
            'entertainment': [
                "You Won't Believe What Happens Next! 🤯",
                "This Is Absolutely Hilarious! 😂",
                "Mind-Blowing Moments You Can't Miss!",
                "The Funniest Thing You'll See Today!",
                "Epic Entertainment That Will Blow Your Mind!",
                "Unbelievable Content You Have To Watch!",
                "This Video Will Make Your Day! 😄",
                "Incredible Moments Caught On Camera!",
                "You Need To See This Right Now!",
               
            ],
            'viral': [
                "Going VIRAL! 🔥 This Is Insane!",
                "This Video Is BLOWING UP Everywhere!",
                "Everyone Is Talking About This! 📈",
                "The Hottest Trend Right Now!",
                "Can't Stop Watching This! 🔄",
                "This Is Why It's Going Viral!",
                "Millions Are Watching This! 🌟",
                "The Video That's Taking Over!",
                "Why This Video Went Viral! 📱",
                "The Most Shared Video Ever!"
            ],
            'amazing': [
                "Absolutely INCREDIBLE! 🤩",
                "This Is Truly Remarkable!",
                "You Have To See This Beauty! ✨",
                "Breathtaking Moments! 😍",
                "The Most Beautiful Thing Ever!",
                "Stunning Content You Can't Miss!",
                "Pure Perfection! 💎",
                "This Will Leave You Speechless!",
                "Absolutely Stunning! 🌈",
                "The Most Amazing Content Ever!"
            ],
            'funny': [
                "This Had Me DYING Of Laughter! 😂",
                "The Funniest Video Ever Made!",
                "You Will Laugh Until You Cry! 😭",
                "Hilarious Moments You Can't Miss!",
                "This Is Comedy GOLD! 🏆",
                "Laugh Out Loud Guaranteed! 🤣",
                "The Most Hilarious Thing Ever!",
                "Comedy At Its Finest! 🎭",
                "This Will Make You LOL! 😆",
                "Uncontrollable Laughter Incoming!"
            ],
            'shocking': [
                "SHOCKING! You Won't Believe This! 😱",
                "This Left Me In Complete Shock!",
                "Absolutely Mind-Blowing! 🤯",
                "You Have To See This! 🚨",
                "This Changes Everything! 💥",
                "Unbelievable Truth Revealed! 🔍",
                "This Is Absolutely Shocking!",
                "You Won't Believe Your Eyes! 👀",
                "The Most Shocking Video Ever!",
                "This Will Shock You To Your Core!"
            ]
        }

        # Default engaging titles if no specific category matches
        default_titles = [
            "You Have To Watch This! 🔥",
            "This Is Absolutely Incredible! ⭐",
            "Mind-Blowing Content! 🤯",
            "You Won't Believe This! 😱",
            "This Will Blow Your Mind! 💥",
            "Absolutely Amazing! ✨",
            "Must See Content! 👀",
            "This Is Unbelievable! 🚀",
            "Pure Entertainment! 🎉",
            "This Is Why It's Viral! 📈",
            "Can't Look Away! 👀",
            "This Is Perfect! 💯",
            "Absolutely Stunning! 🌟",
            "This Will Make You Smile! 😊",
            "Entertainment At Its Best! 🎬",
            "This Is Gold! 🏆",
            "You Need To See This! ⚡",
            "This Is Epic! 🌟",
            "Absolutely Fantastic! 🎊",
            "This Is Why We Love Content! ❤️"
        ]

        # Try to match content type from filename or use random
        selected_titles = default_titles

        # Check for keywords in filename to select appropriate category
        if any(word in base_name for word in ['funny', 'comedy', 'laugh', 'hilarious', 'joke']):
            selected_titles = title_templates['funny']
        elif any(word in base_name for word in ['viral', 'trending', 'hot', 'popular']):
            selected_titles = title_templates['viral']
        elif any(word in base_name for word in ['amazing', 'beautiful', 'stunning', 'incredible']):
            selected_titles = title_templates['amazing']
        elif any(word in base_name for word in ['shock', 'unbelievable', 'crazy', 'insane']):
            selected_titles = title_templates['shocking']
        elif any(word in base_name for word in ['entertain', 'fun', 'enjoy', 'happy']):
            selected_titles = title_templates['entertainment']

        # Select random title from appropriate category
        title = random.choice(selected_titles)

        # Add unique identifier to ensure uniqueness
        unique_id = random.randint(100, 999)
        title = f"{title} #{unique_id}"

        # Ensure title fits YouTube's 100 character limit
        if len(title) > 100:
            title = title[:97] + "..."

        return title
    
    def generate_description(self, filename):
        import random

        # Generate viral titles instead of using filename
        viral_titles = [
            "Mind-Blowing Content",
            "This Will Amaze You",
            "You Won't Believe This",
            "Absolutely Incredible",
            "Pure Entertainment Gold",
            "This Is Going Viral",
            "Unbelievable Moments",
            "Epic Content Alert",
            "Must-Watch Video",
            "Trending Entertainment",
            "Viral Sensation",
            "Amazing Discovery",
            "Incredible Footage",
            "Entertainment Perfection",
            "This Changes Everything"
        ]
        
        # Select random viral title
        video_title = random.choice(viral_titles)

        # Enhanced description templates with better SEO
        description_templates = [
            f"""🎬 {video_title} - You Won't Believe This!

🚀 Welcome to the most exciting content on YouTube! This video features incredible moments that will leave you speechless!

📌 What makes this video special:
• High-quality, engaging content
• Perfect for entertainment lovers
• Share-worthy moments
• Trending entertainment

🔔 SUBSCRIBE NOW and hit the bell 🔔 for more amazing content!
👍 LIKE this video if you're enjoying it!
💬 COMMENT your thoughts below!
📤 SHARE with friends who need to see this!

⭐ Featured Content:
• Viral entertainment
• Must-watch moments
• Trending videos
• Entertainment gold

⏰ New videos uploaded daily! Don't miss out!

📧 Business/Contact: {config.BUSINESS_EMAIL}

{self.generate_hashtags()}

#Viral #Trending #Entertainment #MustWatch #Amazing #Incredible #FYP #ForYou #ExplorePage #YouTube""",

            f"""🔥 HOTTEST VIDEO: {video_title} - Going Viral! 🔥

🎯 This is the content everyone's talking about! Prepare to be amazed by these incredible moments!

📈 Why this video is special:
• Trending entertainment content
• High engagement potential
• Perfect for sharing
• Viral-worthy moments

🔔 TURN ON NOTIFICATIONS and never miss a video!
👍 SMASH that LIKE button!
💬 DROP a comment below!
📤 TAG a friend who needs to see this!

🌟 Content Highlights:
• Premium entertainment
• Trending topics
• Must-see content
• Viral sensations

📅 Daily uploads at the best times for maximum views!

📧 Reach out: {config.BUSINESS_EMAIL}

{self.generate_hashtags()}

#ViralVideo #TrendingNow #Entertainment #MustSee #AmazingContent #FYP #ForYou #Viral #Hot""",

            f"""🤯 UNBELIEVABLE: {video_title} - You Have To See This! 🤯

💫 Experience entertainment like never before! This video contains moments that will blow your mind!

🎬 Video Features:
• Premium quality content
• Engaging entertainment
• Shareable moments
• Trending entertainment

🔔 SUBSCRIBE for more mind-blowing content!
👍 LIKE if this made your day!
💬 COMMENT your favorite part!
📤 SHARE with everyone you know!

⭐ Why watch this:
• High-quality production
• Engaging content
• Perfect entertainment
• Must-watch material

⏰ Fresh content uploaded regularly!

📧 Contact: {config.BUSINESS_EMAIL}

{self.generate_hashtags()}

#Unbelievable #Amazing #Entertainment #Viral #Trending #MustWatch #FYP #ForYou #Incredible""",

            f"""🎉 EPIC CONTENT: {video_title} - Pure Entertainment! 🎉

🎪 Get ready for the ultimate entertainment experience! This video delivers non-stop fun and excitement!

🎯 What you'll get:
• Premium entertainment content
• High-quality production
• Engaging moments
• Trending entertainment

🔔 SUBSCRIBE and join our amazing community!
👍 LIKE this video to support us!
💬 COMMENT below and let us know what you think!
📤 SHARE this with your friends!

🌟 Content Quality:
• Professional production
• Engaging entertainment
• Trending content
• Must-watch videos

📆 New videos every day!

📧 Business inquiries: {config.BUSINESS_EMAIL}

{self.generate_hashtags()}

#Entertainment #Viral #Trending #Amazing #MustWatch #FYP #ForYou #Epic #Fun #Awesome"""
        ]

        # Select random description template
        description = random.choice(description_templates)

        # Ensure description fits YouTube's 5000 character limit
        if len(description) > 5000:
            description = description[:4997] + "..."

        return description
    
    def generate_hashtags(self):
        """Generate comprehensive SEO-optimized hashtags for maximum reach"""
        import random

        # Base hashtags from config
        hashtags = []

        # Add default tags
        hashtags.extend(config.DEFAULT_TAGS)

        # Add niche-specific hashtags
        hashtags.extend(config.NICHE_HASHTAGS)

        # Add evergreen hashtags
        hashtags.extend(config.EVERGREEN_HASHTAGS)

        # Add trending/viral hashtags for better discoverability
        trending_hashtags = [
            '#ViralVideo', '#TrendingNow', '#GoingViral', '#ViralContent',
            '#HotVideo', '#Popular', '#MustWatch', '#CantMissThis',
            '#AmazingContent', '#Incredible', '#MindBlowing', '#Unbelievable',
            '#Entertainment', '#Fun', '#Awesome', '#Epic', '#Perfect',
            '#BestVideo', '#TopContent', '#Premium', '#QualityContent',
            '#ShareThis', '#WatchNow', '#DontMiss', '#MustSee',
            '#FYP', '#ForYou', '#ForYouPage', '#ExplorePage', '#Discover',
            '#YouTubeTrending', '#YouTubeViral', '#Algorithm', '#Views',
            '#Subscribers', '#LikeAndSubscribe', '#NewVideo', '#FreshContent',
            '#DailyVideo', '#ContentCreator', '#YouTuber', '#VideoContent',
            '#OnlineVideo', '#WatchOnline', '#FreeVideo', '#EntertainmentVideo'
        ]

        # Add random trending hashtags (YouTube allows max 15 hashtags)
        # First 3 hashtags appear above the title, so prioritize important ones
        num_additional = min(12, 15 - len(hashtags))  # Leave room for base hashtags
        if num_additional > 0 and len(trending_hashtags) > 0:
            num_to_sample = min(num_additional, len(trending_hashtags))
            additional_hashtags = random.sample(trending_hashtags, num_to_sample)
            hashtags.extend(additional_hashtags)

        # Remove duplicates and limit to 15 total
        hashtags = list(dict.fromkeys(hashtags))  # Remove duplicates while preserving order
        hashtags = hashtags[:15]  # YouTube's limit

        # Join with spaces (YouTube format)
        return ' '.join(hashtags)
    
    def upload_video(self, video_path, title, description, tags, category_id=None):
        """Upload video to YouTube"""
        # Use config defaults if not specified
        if category_id is None:
            category_id = config.VIDEO_CATEGORY_ID
        """Upload video to YouTube"""
        try:
            print(f"\n{'='*60}")
            print(f"Uploading: {os.path.basename(video_path)}")
            print(f"Title: {title}")
            print(f"{'='*60}\n")
            
            # Prepare request body
            body = {
                'snippet': {
                    'title': title,
                    'description': description,
                    'tags': tags,
                    'categoryId': category_id  # 22 = People & Blogs, change as needed
                },
                'status': {
                    'privacyStatus': config.VIDEO_PRIVACY,
                    'selfDeclaredMadeForKids': config.MADE_FOR_KIDS,
                    'madeForKids': config.MADE_FOR_KIDS
                }
            }
            
            # Create MediaFileUpload object with MIME type for better quality preservation
            media = MediaFileUpload(
                video_path,
                mimetype='video/mp4',  # Explicitly set MIME type for MP4
                chunksize=config.UPLOAD_CHUNK_SIZE,
                resumable=True
            )
            
            # Execute upload with progress
            request = self.youtube.videos().insert(
                part='snippet,status',
                body=body,
                media_body=media
            )
            
            response = None
            while response is None:
                status, response = request.next_chunk()
                if status:
                    progress = int(status.progress() * 100)
                    print(f"Upload progress: {progress}%")
            
            video_id = response['id']
            video_url = f"https://www.youtube.com/watch?v={video_id}"
            
            print(f"\n✓ Upload successful!")
            print(f"  Video ID: {video_id}")
            print(f"  URL: {video_url}")
            print(f"  Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
            
            return video_id
        
        except HttpError as error:
            print(f"\n✗ Error uploading video: {error}")
            return None
        except Exception as e:
            print(f"\n✗ Unexpected error: {e}")
            return None
    
    def move_to_uploaded(self, filename):
        """Move uploaded video to uploaded folder with improved file lock handling"""
        import time
        import gc

        source = os.path.join(self.videos_folder, filename)
        destination = os.path.join(self.uploaded_folder, filename)

        # If file with same name exists in uploaded folder, add timestamp
        if os.path.exists(destination):
            name, ext = os.path.splitext(filename)
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            destination = os.path.join(self.uploaded_folder, f"{name}_{timestamp}{ext}")

        # Force garbage collection to help release any Python file handles
        gc.collect()

        # Improved retry mechanism for Windows file locks
        max_retries = 5  # Increased retries
        for attempt in range(max_retries):
            try:
                # Wait progressively longer for file locks to release
                wait_time = 2 + (attempt * 3)  # 2s, 5s, 8s, 11s, 14s
                time.sleep(wait_time)

                # Check if file still exists before attempting move
                if not os.path.exists(source):
                    print(f"✓ File already moved or deleted: {filename}")
                    return

                # Try to move the file
                shutil.move(source, destination)
                print(f"✓ Moved to uploaded folder: {filename}")
                return

            except Exception as e:
                if attempt < max_retries - 1:
                    print(f"  Retry {attempt + 1}/{max_retries} moving file (waiting {2 + ((attempt + 1) * 3)}s)...")
                else:
                    print(f"✗ Error moving file after {max_retries} attempts: {e}")

                    # Final attempt: try to copy and delete instead of move
                    try:
                        print("  Attempting copy-delete approach...")
                        time.sleep(5)  # Final long wait

                        # Copy file first
                        shutil.copy2(source, destination)
                        print(f"✓ Copied to uploaded folder: {filename}")

                        # Then try to delete source
                        time.sleep(2)
                        os.remove(source)
                        print(f"✓ Deleted source file: {filename}")

                    except Exception as copy_e:
                        print(f"⚠ Could not copy/delete source file: {copy_e}")
                        print(f"  Manual cleanup may be required for: {filename}")

                        # Last resort: create a marker file to indicate this file was uploaded
                        try:
                            marker_file = os.path.join(self.videos_folder, f"{filename}.uploaded")
                            with open(marker_file, 'w') as f:
                                f.write(f"Uploaded at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
                            print(f"✓ Created upload marker: {filename}.uploaded")
                        except Exception as marker_e:
                            print(f"⚠ Could not create marker file: {marker_e}")

    def cleanup_uploaded_files(self):
        """Clean up any files that were uploaded but not moved properly"""
        import glob

        print("🧹 Checking for files that need cleanup...")

        # Look for .uploaded marker files
        marker_pattern = os.path.join(self.videos_folder, "*.uploaded")
        marker_files = glob.glob(marker_pattern)

        cleaned_count = 0
        for marker_file in marker_files:
            try:
                # Get the original filename (remove .uploaded extension)
                original_file = marker_file[:-9]  # Remove '.uploaded'

                # Check if the original file still exists
                if os.path.exists(original_file):
                    # Try to move it to uploaded folder
                    filename = os.path.basename(original_file)
                    destination = os.path.join(self.uploaded_folder, filename)

                    # Handle duplicate names
                    if os.path.exists(destination):
                        name, ext = os.path.splitext(filename)
                        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
                        destination = os.path.join(self.uploaded_folder, f"{name}_{timestamp}{ext}")

                    shutil.move(original_file, destination)
                    print(f"✓ Cleaned up: {filename}")

                    # Remove the marker file
                    os.remove(marker_file)
                    cleaned_count += 1
                else:
                    # Original file already moved, just remove marker
                    os.remove(marker_file)

            except Exception as e:
                print(f"⚠ Could not clean up {marker_file}: {e}")

        if cleaned_count > 0:
            print(f"✓ Cleaned up {cleaned_count} uploaded files")
        else:
            print("✓ No cleanup needed")

    def process_and_upload(self):
        """Main function to upload one video"""
        print(f"\n{'#'*60}")
        print(f"# Upload Process Started")
        print(f"# Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"{'#'*60}")
        
        # Get available videos
        video_files = self.get_video_files()
        
        if not video_files:
            print("\n⚠ No videos found in the 'videos' folder.")
            print("  Please add videos to upload.\n")
            return
        
        # Take the first video (oldest)
        video_file = video_files[0]
        video_path = os.path.join(self.videos_folder, video_file)
        
        print(f"\nFound {len(video_files)} video(s) in queue.")
        print(f"Processing: {video_file}")
        
        # Generate metadata
        title = self.generate_title(video_file)
        description = self.generate_description(video_file)
        tags = self.generate_hashtags()  # Use comprehensive hashtag generation
        
        # Upload video
        video_id = self.upload_video(
            video_path,
            title=title,
            description=description,
            tags=tags
            # category_id will use config default
        )
        
        # If successful, move to uploaded folder
        if video_id:
            self.move_to_uploaded(video_file)
            remaining = len(video_files) - 1
            print(f"✓ Upload complete! {remaining} video(s) remaining in queue.\n")
        else:
            print(f"✗ Upload failed. Video remains in queue.\n")

    def upload_and_schedule_all_videos(self):
        """Upload 5 videos per schedule cycle according to config times"""
        from datetime import datetime, timedelta
        
        print(f"\n{'='*70}")
        print("🚀 SCHEDULED VIDEO UPLOADER - 5 VIDEOS PER CYCLE")
        print(f"{'='*70}")
        
        # Get all video files
        video_files = self.get_video_files()
        
        if not video_files:
            print("⚠ No videos found in the 'videos' folder.")
            print("  Please add videos to upload and schedule.\n")
            return 0, 0
        
        # Check YouTube API quota before proceeding
        print("🔍 Checking YouTube API quota status...")
        if not self.check_quota_status():
            print("❌ Cannot proceed with uploads due to quota limits.")
            print("   Please resolve quota issues and try again.\n")
            return 0, 0

        # Clean up any files from previous failed uploads
        self.cleanup_uploaded_files()
        
        print(f"Found {len(video_files)} video(s) to upload")
        print(f"Upload times from config: {', '.join(config.UPLOAD_TIMES)}")
        print(f"Will upload 5 videos at each scheduled time")
        print(f"{'='*70}\n")
        
        # Get today's date
        today = datetime.now().date()
        
        uploaded_count = 0
        failed_count = 0
        
        # Upload only the first 5 videos (one per upload time)
        videos_to_upload = min(len(video_files), 5)
        
        for i in range(videos_to_upload):
            video_file = video_files[i]
            
            print(f"\n{'#'*60}")
            print(f"Processing video {i+1}/{videos_to_upload}: {video_file[:50]}...")
            print(f"{'#'*60}")
            
            video_path = os.path.join(self.videos_folder, video_file)
            
            # Use the corresponding upload time from config
            upload_time_str = config.UPLOAD_TIMES[i]
            
            # Parse upload time
            hour, minute = map(int, upload_time_str.split(':'))
            
            # Create scheduled publish datetime for today
            scheduled_datetime = datetime.combine(today, datetime.min.time().replace(hour=hour, minute=minute))
            
            # If the time has already passed today, schedule for tomorrow
            now = datetime.now()
            if scheduled_datetime <= now:
                scheduled_datetime = scheduled_datetime + timedelta(days=1)
            
            # Format for YouTube API (ISO 8601)
            scheduled_publish_time = scheduled_datetime.strftime('%Y-%m-%dT%H:%M:%S.000Z')
            
            print(f"📅 Scheduled to publish: {scheduled_datetime.strftime('%Y-%m-%d at %H:%M')}")
            
            # Generate metadata
            title = self.generate_title(video_file)
            description = self.generate_description(video_file)
            tags = self.generate_hashtags()
            
            # Upload with scheduled time
            video_id = self.upload_scheduled_video(
                video_path=video_path,
                title=title,
                description=description,
                tags=tags,
                scheduled_time=scheduled_publish_time
            )
            
            if video_id:
                # Move to uploaded folder
                self.move_to_uploaded(video_file)
                uploaded_count += 1
                
                print(f"✅ SUCCESS: Video uploaded and scheduled!")
                print(f"   Video ID: {video_id}")
                print(f"   Will publish: {scheduled_datetime.strftime('%Y-%m-%d at %H:%M')}")
                print(f"   URL: https://www.youtube.com/watch?v={video_id}")
            else:
                failed_count += 1
                print(f"❌ FAILED: Could not upload video")
        
        # Final summary
        print(f"\n{'='*70}")
        print("📊 UPLOAD COMPLETE!")
        print(f"{'='*70}")
        print(f"✅ Successfully uploaded and scheduled: {uploaded_count} videos")
        print(f"❌ Failed uploads: {failed_count} videos")
        print(f"📁 Uploaded videos moved to: {self.uploaded_folder}/")
        
        if uploaded_count > 0:
            first_upload_time = config.UPLOAD_TIMES[0]
            hour, minute = map(int, first_upload_time.split(':'))
            next_publish = datetime.combine(today, datetime.min.time().replace(hour=hour, minute=minute))
            if next_publish <= datetime.now():
                next_publish = next_publish + timedelta(days=1)
            
            print(f"\n🎉 DONE! 5 videos scheduled for today/tomorrow!")
            print(f"📅 First video publishes: {next_publish.strftime('%Y-%m-%d at %H:%M')}")
            print(f"🎬 You can close this program now - videos will publish on schedule!")
        
        print(f"{'='*70}\n")
        
        return uploaded_count, failed_count

    def upload_scheduled_video(self, video_path, title, description, tags, scheduled_time, category_id=None):
        """Upload video to YouTube with scheduled publish time"""
        # Use config defaults if not specified
        if category_id is None:
            category_id = config.VIDEO_CATEGORY_ID
            
        try:
            print(f"\n📹 Uploading: {os.path.basename(video_path)}")
            print(f"📝 Title: {title}")
            print(f"⏰ Scheduled for: {scheduled_time}")
            print("-" * 50)
            
            # Prepare request body with scheduled publish time
            body = {
                'snippet': {
                    'title': title,
                    'description': description,
                    'tags': tags,
                    'categoryId': category_id
                },
                'status': {
                    'privacyStatus': 'private',  # Set as private initially
                    'publishAt': scheduled_time,  # Schedule the publish time
                    'selfDeclaredMadeForKids': config.MADE_FOR_KIDS,
                    'madeForKids': config.MADE_FOR_KIDS
                }
            }
            
            # Create MediaFileUpload object
            media = MediaFileUpload(
                video_path,
                mimetype='video/mp4',
                chunksize=config.UPLOAD_CHUNK_SIZE,
                resumable=True
            )
            
            # Execute upload with progress
            request = self.youtube.videos().insert(
                part='snippet,status',
                body=body,
                media_body=media
            )
            
            response = None
            while response is None:
                status, response = request.next_chunk()
                if status:
                    progress = int(status.progress() * 100)
                    print(f"📤 Upload progress: {progress}%")
            
            video_id = response['id']
            
            return video_id
        
        except HttpError as error:
            print(f"❌ YouTube API Error: {error}")
            return None
        except Exception as e:
            print(f"❌ Upload Error: {e}")
            return None

    def check_quota_status(self):
        """Check current YouTube API quota status"""
        try:
            # Try to make a simple API call to check quota
            request = self.youtube.channels().list(
                part='snippet,statistics',
                mine=True
            )
            response = request.execute()
            
            print("✅ YouTube API quota is available")
            print(f"   Channel: {response['items'][0]['snippet']['title'] if response['items'] else 'Unknown'}")
            return True
            
        except HttpError as e:
            if 'quotaExceeded' in str(e):
                print("❌ YouTube API Quota Exceeded!")
                print("   Your daily quota limit has been reached.")
                print("   ")
                print("   Solutions:")
                print("   1. Wait until midnight Pacific Time for quota reset")
                print("   2. Increase your quota limit in Google Cloud Console:")
                print("      - Go to https://console.cloud.google.com/")
                print("      - Find your project → YouTube Data API v3 → Quotas")
                print("      - Request quota increase (up to 10M units/day)")
                print("   3. Each video upload costs ~1,600 quota units")
                print("   ")
                return False
            else:
                print(f"⚠ YouTube API Error: {e}")
                return False
        except Exception as e:
            print(f"⚠ Error checking quota: {e}")
            return False


def setup_schedule(uploader, upload_times):
    """Schedule uploads at specific times"""
    print("\n" + "="*60)
    print("Setting up upload schedule...")
    print("="*60)
    
    for upload_time in upload_times:
        schedule.every().day.at(upload_time).do(uploader.process_and_upload)
        print(f"✓ Scheduled upload at {upload_time}")
    
    print("="*60 + "\n")


def main():
    """Main execution function - Upload and Schedule ALL Videos"""
    print("\n" + "="*70)
    print("🚀 AUTOMATIC YOUTUBE VIDEO UPLOADER & SCHEDULER")
    print("="*70)
    print("This will upload ALL videos and schedule them automatically!")
    print("="*70 + "\n")
    
    # Initialize uploader
    uploader = YouTubeManager(
        credentials_file=config.CREDENTIALS_FILE,
        videos_folder=config.VIDEOS_FOLDER
    )
    uploader.uploaded_folder = config.UPLOADED_FOLDER
    uploader.token_file = config.TOKEN_FILE
    
    try:
        # Authenticate
        print("🔐 Authenticating with YouTube...")
        uploader.authenticate()
        print("✅ Authentication successful!\n")
        
        # Upload and schedule all videos
        uploaded, failed = uploader.upload_and_schedule_all_videos()
        
        if uploaded > 0:
            print("🎊 SUCCESS! All videos have been uploaded and scheduled.")
            print("🎬 You can now close this program - videos will publish automatically!")
        else:
            print("⚠️ No videos were uploaded. Please check your videos folder.")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        print("Please check your credentials and try again.")
    
    input("\nPress Enter to exit...")


if __name__ == '__main__':
    main()