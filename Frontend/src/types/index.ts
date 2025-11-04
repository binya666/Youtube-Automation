// API Types
export interface VideoMetadata {
  id?: string;
  title: string;
  description: string;
  tags: string[];
  category: string;
  privacy: 'public' | 'private' | 'unlisted';
  thumbnail?: string;
  publishAt?: string;
}

export interface ScraperResult {
  url: string;
  title: string;
  description?: string;
  duration: string;
  thumbnail: string;
  channelName?: string;
  viewCount?: number;
  uploadDate?: string;
  metadata?: VideoMetadata;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
  speed?: number;
  eta?: number;
}

export interface UploadResult {
  videoId: string;
  url: string;
  status: 'success' | 'failed' | 'processing';
  error?: string;
  publishedAt?: string;
}

export interface SchedulerConfig {
  enabled: boolean;
  schedule: string; // cron expression
  maxVideosPerDay: number;
  categories: string[];
  autoStart: boolean;
}

export interface SchedulerStatus {
  running: boolean;
  nextRun?: string;
  lastRun?: string;
  queuedVideos: number;
  processedToday: number;
}

export interface QuotaInfo {
  dailyQuota: number;
  usedToday: number;
  remaining: number;
  resetTime: string;
  monthlyQuota?: number;
  usedThisMonth?: number;
}

export interface AnalyticsData {
  totalUploads: number;
  successfulUploads: number;
  failedUploads: number;
  views: number;
  subscribers: number;
  watchTime: number;
  avgViewDuration: number;
  topVideos: Array<{
    id: string;
    title: string;
    views: number;
    publishedAt: string;
  }>;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'debug';
  message: string;
  details?: any;
  source?: string;
}

// Component Props Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface VideoCardProps extends BaseComponentProps {
  video: ScraperResult;
  onSelect?: (video: ScraperResult) => void;
  selected?: boolean;
  showActions?: boolean;
}

export interface UploadFormProps extends BaseComponentProps {
  onSubmit: (data: UploadFormData) => Promise<void>;
  initialData?: Partial<UploadFormData>;
  loading?: boolean;
}

export interface UploadFormData {
  file: File | null;
  metadata: VideoMetadata;
  scheduleUpload?: boolean;
  publishAt?: Date;
}

// Form Types
export interface SettingsFormData {
  apiKey: string;
  channelId: string;
  defaultPrivacy: 'public' | 'private' | 'unlisted';
  autoTags: boolean;
  notifications: boolean;
  theme: 'light' | 'dark' | 'system';
}

export interface SchedulerFormData {
  enabled: boolean;
  schedule: string;
  maxVideosPerDay: number;
  categories: string[];
  autoStart: boolean;
}

// Navigation Types
export interface NavItem {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  children?: NavItem[];
}

// Table Types
export interface TableColumn<T = any> {
  key: keyof T | string;
  title: string;
  sortable?: boolean;
  render?: (value: any, record: T) => React.ReactNode;
  width?: string | number;
}

export interface TableProps<T = any> extends BaseComponentProps {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  pagination?: {
    current: number;
    total: number;
    pageSize: number;
    onChange: (page: number) => void;
  };
  onRowClick?: (record: T) => void;
  rowKey?: keyof T | ((record: T) => string);
}

// Modal/Dialog Types
export interface ModalProps extends BaseComponentProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// Toast Types
export interface ToastProps {
  id: string;
  title?: string;
  description?: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Error Types
export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> & {
  [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Keys>>;
}[Keys];

// Theme Types
export type Theme = 'light' | 'dark' | 'system';

// Status Types
export type UploadStatus = 'idle' | 'uploading' | 'processing' | 'completed' | 'failed';
export type SchedulerStatusType = 'stopped' | 'running' | 'paused';

// Filter Types
export interface VideoFilters {
  status?: UploadStatus;
  category?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  search?: string;
}

export interface LogFilters {
  level?: LogEntry['level'];
  dateRange?: {
    start: Date;
    end: Date;
  };
  source?: string;
  search?: string;
}