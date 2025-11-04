# YouTube Video Uploader Client

A comprehensive YouTube automation system with both backend processing capabilities and a modern web interface for managing video uploads, scheduling, and analytics.

## Project Structure

```
YouTube Uploader Client/
├── backend/               # Python backend (YouTube automation)
│   ├── src/              # Main Python source code
│   ├── config/           # Configuration and credentials
│   ├── data/             # Data files and spreadsheets
│   ├── output/           # Generated content and uploads
│   ├── logs/             # Application logs
│   └── requirements.txt  # Python dependencies
├── Frontend/             # React/TypeScript web interface
│   ├── src/             # React application source
│   ├── public/          # Static assets
│   └── package.json     # Node.js dependencies
├── .gitignore           # Git ignore rules
└── README.md            # This file
```

## Components

### Backend (Python)
- **Video Scraping**: Extract video information from various sources
- **Video Processing**: Download and process videos for upload
- **YouTube API Integration**: Automated upload with metadata management
- **Scheduler**: Queue management and automated upload scheduling
- **Quota Management**: Monitor YouTube API usage limits
- **Comprehensive Logging**: Track all operations and errors

### Frontend (React/TypeScript)
- **Modern Web Interface**: Clean, responsive dashboard
- **Real-time Monitoring**: Live status updates and progress tracking
- **Video Management**: Upload queue management and scheduling
- **Analytics Dashboard**: View upload statistics and performance
- **Settings Management**: Configure API keys and preferences
- **Log Viewer**: Monitor application logs and debug issues

## Quick Start

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python src/main.py
```

### Frontend Setup
```bash
cd Frontend
npm install
npm run dev
```

## Features

- ✅ Video scraping from multiple sources
- ✅ Automated YouTube uploads with metadata
- ✅ Upload scheduling and queue management
- ✅ Real-time progress monitoring
- ✅ Comprehensive logging and error handling
- ✅ Modern web interface
- ✅ API quota management
- ✅ Batch processing capabilities
- ✅ Responsive design for all devices

## Requirements

### Backend
- Python 3.8+
- YouTube Data API v3 credentials
- Required Python packages (see `backend/requirements.txt`)

### Frontend
- Node.js 16+
- npm or yarn
- Modern web browser

## Configuration

1. **YouTube API Setup**:
   - Create a project in Google Cloud Console
   - Enable YouTube Data API v3
   - Download `credentials.json` and place in `backend/config/`

2. **Environment Setup**:
   - Backend: Configure `backend/config/config.py`
   - Frontend: Copy `Frontend/.env.example` to `.env.local`

## Usage

1. **Add Video URLs**: Use the Excel spreadsheet in `backend/data/video_urls.xlsx`
2. **Configure Settings**: Set upload preferences and scheduling
3. **Start Processing**: Run the backend application
4. **Monitor Progress**: Use the web interface to track uploads
5. **View Analytics**: Check upload statistics and performance metrics

## Security

- API credentials are stored securely and never committed to version control
- Sensitive files are automatically excluded by `.gitignore`
- OAuth tokens are managed securely
- All data transmission uses secure protocols

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues and questions:
- Check the logs in `backend/logs/`
- Review the documentation in each component's README
- Create an issue on GitHub

---

**Built with ❤️ for YouTube creators and automation enthusiasts**