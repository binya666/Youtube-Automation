# YouTube Uploader Backend

This is the Python backend for the YouTube Video Uploader Client, providing comprehensive YouTube automation capabilities.

## Directory Structure

```
backend/
├── src/                    # Main Python source code
│   ├── main.py            # Main application entry point
│   ├── video_scraper.py   # Video scraping functionality
│   ├── video_processor.py # Video processing and downloading
│   ├── youtube_manager.py # YouTube API integration
│   └── check_quota.py     # YouTube API quota management
├── config/                # Configuration and credentials
│   ├── config.py          # Application configuration
│   ├── credentials.json   # YouTube API credentials (gitignored)
│   └── token.pickle       # OAuth tokens (gitignored)
├── data/                  # Data files and spreadsheets
│   ├── video_urls.xlsx    # Video URL spreadsheet
│   └── downloaded_log.json # Download history
├── output/                # Generated content and uploads
│   ├── uploaded/          # Successfully uploaded videos
│   └── videos/            # Downloaded/processed videos
├── logs/                  # Application logs
└── requirements.txt       # Python dependencies
```

## Features

- **Video Scraping**: Extract video information from various sources
- **Video Processing**: Download and process videos for upload
- **YouTube Integration**: Automated upload to YouTube with metadata
- **Scheduler**: Automated upload scheduling and queue management
- **Quota Management**: Monitor and manage YouTube API quotas
- **Logging**: Comprehensive logging and error tracking

## Setup

1. **Install Dependencies**:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Configure YouTube API**:
   - Place your `credentials.json` in the `config/` directory
   - Run the application once to generate OAuth tokens

3. **Run the Application**:
   ```bash
   python src/main.py
   ```

## Configuration

Edit `config/config.py` to customize:
- API settings
- Upload preferences
- Scheduler configuration
- Logging levels

## Data Files

- `video_urls.xlsx`: Excel spreadsheet containing video URLs to process
- `downloaded_log.json`: JSON log of all download operations
- Upload logs are stored in the `logs/` directory

## Output

- Processed videos are stored in `output/videos/`
- Successfully uploaded videos are moved to `output/uploaded/`
- All operations are logged with timestamps

## Security Notes

- Never commit `credentials.json` or `token.pickle` to version control
- These files are automatically excluded by `.gitignore`
- Keep your YouTube API credentials secure