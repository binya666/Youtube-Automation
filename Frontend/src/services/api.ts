import axios, { AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens if needed
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface VideoMetadata {
  id: string;
  title: string;
  description: string;
  tags: string[];
  category: string;
  privacy: 'public' | 'private' | 'unlisted';
  thumbnail?: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface ScraperResult {
  url: string;
  title: string;
  duration: string;
  thumbnail: string;
  metadata?: VideoMetadata;
}

export interface UploadResult {
  videoId: string;
  url: string;
  status: 'success' | 'failed';
  error?: string;
}

export interface SchedulerConfig {
  enabled: boolean;
  schedule: string; // cron expression
  maxVideosPerDay: number;
  categories: string[];
}

export class YouTubeUploaderAPI {
  // Video scraping endpoints
  static async scrapeVideo(url: string): Promise<ScraperResult> {
    const response = await api.post('/scrape', { url });
    return response.data;
  }

  static async scrapeMultipleVideos(urls: string[]): Promise<ScraperResult[]> {
    const response = await api.post('/scrape/batch', { urls });
    return response.data;
  }

  // Video processing endpoints
  static async downloadVideo(url: string, quality?: string): Promise<{ path: string }> {
    const response = await api.post('/download', { url, quality });
    return response.data;
  }

  static async processVideo(filePath: string, metadata: Partial<VideoMetadata>): Promise<{ processedPath: string }> {
    const response = await api.post('/process', { filePath, metadata });
    return response.data;
  }

  // YouTube upload endpoints
  static async uploadVideo(
    filePath: string,
    metadata: VideoMetadata,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadResult> {
    const formData = new FormData();
    formData.append('video', new File([await fetch(filePath).then(r => r.blob())], 'video.mp4'));
    formData.append('metadata', JSON.stringify(metadata));

    const response = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent: any) => {
        if (onProgress && progressEvent.total) {
          const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress({
            loaded: progressEvent.loaded,
            total: progressEvent.total,
            percentage,
          });
        }
      },
    });

    return response.data;
  }

  // Scheduler endpoints
  static async getSchedulerConfig(): Promise<SchedulerConfig> {
    const response = await api.get('/scheduler/config');
    return response.data;
  }

  static async updateSchedulerConfig(config: SchedulerConfig): Promise<void> {
    await api.put('/scheduler/config', config);
  }

  static async startScheduler(): Promise<void> {
    await api.post('/scheduler/start');
  }

  static async stopScheduler(): Promise<void> {
    await api.post('/scheduler/stop');
  }

  static async getSchedulerStatus(): Promise<{ running: boolean; nextRun?: string }> {
    const response = await api.get('/scheduler/status');
    return response.data;
  }

  // Quota and analytics endpoints
  static async getQuotaInfo(): Promise<{
    dailyQuota: number;
    usedToday: number;
    remaining: number;
    resetTime: string;
  }> {
    const response = await api.get('/quota');
    return response.data;
  }

  static async getAnalytics(): Promise<{
    totalUploads: number;
    successfulUploads: number;
    failedUploads: number;
    views: number;
    subscribers: number;
  }> {
    const response = await api.get('/analytics');
    return response.data;
  }

  // Settings endpoints
  static async getSettings(): Promise<{
    apiKey: string;
    channelId: string;
    defaultPrivacy: string;
    autoTags: boolean;
    notifications: boolean;
  }> {
    const response = await api.get('/settings');
    return response.data;
  }

  static async updateSettings(settings: Partial<{
    apiKey: string;
    channelId: string;
    defaultPrivacy: string;
    autoTags: boolean;
    notifications: boolean;
  }>): Promise<void> {
    await api.put('/settings', settings);
  }

  // Logs endpoints
  static async getLogs(limit: number = 100, offset: number = 0): Promise<{
    logs: Array<{
      id: string;
      timestamp: string;
      level: 'info' | 'warning' | 'error';
      message: string;
      details?: any;
    }>;
    total: number;
  }> {
    const response = await api.get('/logs', { params: { limit, offset } });
    return response.data;
  }

  static async clearLogs(): Promise<void> {
    await api.delete('/logs');
  }
}

export default api;