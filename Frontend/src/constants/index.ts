// YouTube API Constants
export const YOUTUBE_CATEGORIES = {
  '1': 'Film & Animation',
  '2': 'Autos & Vehicles',
  '10': 'Music',
  '15': 'Pets & Animals',
  '17': 'Sports',
  '18': 'Short Movies',
  '19': 'Travel & Events',
  '20': 'Gaming',
  '21': 'Videoblogging',
  '22': 'People & Blogs',
  '23': 'Comedy',
  '24': 'Entertainment',
  '25': 'News & Politics',
  '26': 'Howto & Style',
  '27': 'Education',
  '28': 'Science & Technology',
  '29': 'Nonprofits & Activism',
  '30': 'Movies',
  '31': 'Anime/Animation',
  '32': 'Action/Adventure',
  '33': 'Classics',
  '34': 'Comedy',
  '35': 'Documentary',
  '36': 'Drama',
  '37': 'Family',
  '38': 'Foreign',
  '39': 'Horror',
  '40': 'Sci-Fi/Fantasy',
  '41': 'Thriller',
  '42': 'Shorts',
  '43': 'Shows',
  '44': 'Trailers',
} as const;

export const YOUTUBE_PRIVACY_OPTIONS = [
  { value: 'public', label: 'Public' },
  { value: 'private', label: 'Private' },
  { value: 'unlisted', label: 'Unlisted' },
] as const;

// File Upload Constants
export const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024; // 2GB
export const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/avi',
  'video/mov',
  'video/wmv',
  'video/flv',
  'video/webm',
  'video/mkv',
] as const;

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
] as const;

// Scheduler Constants
export const DEFAULT_SCHEDULES = [
  { value: '0 9 * * *', label: 'Daily at 9:00 AM' },
  { value: '0 14 * * *', label: 'Daily at 2:00 PM' },
  { value: '0 18 * * *', label: 'Daily at 6:00 PM' },
  { value: '0 */2 * * *', label: 'Every 2 hours' },
  { value: '0 */4 * * *', label: 'Every 4 hours' },
  { value: '0 9 * * 1', label: 'Weekly on Monday at 9:00 AM' },
] as const;

// UI Constants
export const SIDEBAR_WIDTH = 280;
export const TOPBAR_HEIGHT = 64;
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// Time Constants
export const ONE_MINUTE = 60 * 1000;
export const ONE_HOUR = 60 * ONE_MINUTE;
export const ONE_DAY = 24 * ONE_HOUR;
export const ONE_WEEK = 7 * ONE_DAY;

// API Constants
export const API_TIMEOUT = 30000;
export const MAX_RETRY_ATTEMPTS = 3;
export const RETRY_DELAY = 1000;

// Validation Constants
export const TITLE_MIN_LENGTH = 1;
export const TITLE_MAX_LENGTH = 100;
export const DESCRIPTION_MAX_LENGTH = 5000;
export const TAGS_MAX_COUNT = 15;
export const TAG_MAX_LENGTH = 30;

// Log Levels
export const LOG_LEVELS = {
  DEBUG: 'debug',
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
} as const;

// Status Colors
export const STATUS_COLORS = {
  success: 'text-green-600 bg-green-50 border-green-200',
  error: 'text-red-600 bg-red-50 border-red-200',
  warning: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  info: 'text-blue-600 bg-blue-50 border-blue-200',
  processing: 'text-orange-600 bg-orange-50 border-orange-200',
} as const;

// Navigation Items
export const NAVIGATION_ITEMS = [
  {
    title: 'Dashboard',
    href: '/',
    icon: 'LayoutDashboard',
  },
  {
    title: 'Scraper',
    href: '/scraper',
    icon: 'Search',
  },
  {
    title: 'Downloader',
    href: '/downloader',
    icon: 'Download',
  },
  {
    title: 'Uploader',
    href: '/uploader',
    icon: 'Upload',
  },
  {
    title: 'Scheduler',
    href: '/scheduler',
    icon: 'Calendar',
  },
  {
    title: 'Analytics',
    href: '/analytics',
    icon: 'BarChart3',
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: 'Settings',
  },
  {
    title: 'Logs',
    href: '/logs',
    icon: 'FileText',
  },
] as const;

// Theme Options
export const THEME_OPTIONS = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
] as const;

// Cron Expression Examples
export const CRON_EXAMPLES = [
  {
    expression: '0 9 * * *',
    description: 'Every day at 9:00 AM',
  },
  {
    expression: '0 */2 * * *',
    description: 'Every 2 hours',
  },
  {
    expression: '0 9 * * 1',
    description: 'Every Monday at 9:00 AM',
  },
  {
    expression: '0 9 1 * *',
    description: 'First day of every month at 9:00 AM',
  },
  {
    expression: '*/30 * * * *',
    description: 'Every 30 minutes',
  },
] as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network connection failed. Please check your internet connection.',
  UNAUTHORIZED: 'Authentication failed. Please check your API credentials.',
  QUOTA_EXCEEDED: 'YouTube API quota exceeded. Please try again later.',
  INVALID_VIDEO: 'Invalid video file. Please select a valid video file.',
  UPLOAD_FAILED: 'Video upload failed. Please try again.',
  SCRAPE_FAILED: 'Failed to scrape video information. Please check the URL.',
  SETTINGS_SAVE_FAILED: 'Failed to save settings. Please try again.',
  SCHEDULER_START_FAILED: 'Failed to start scheduler. Please try again.',
  SCHEDULER_STOP_FAILED: 'Failed to stop scheduler. Please try again.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  VIDEO_UPLOADED: 'Video uploaded successfully!',
  SETTINGS_SAVED: 'Settings saved successfully!',
  SCHEDULER_STARTED: 'Scheduler started successfully!',
  SCHEDULER_STOPPED: 'Scheduler stopped successfully!',
  LOGS_CLEARED: 'Logs cleared successfully!',
} as const;