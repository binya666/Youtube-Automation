import { useState, useEffect, useCallback } from 'react';
import { useApp } from '@/context/AppContext';
import { YouTubeUploaderAPI, ScraperResult, UploadResult, UploadProgress } from '@/services/api';

/**
 * Hook for managing video scraping operations
 */
export function useVideoScraper() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<ScraperResult[]>([]);

  const scrapeVideo = useCallback(async (url: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await YouTubeUploaderAPI.scrapeVideo(url);
      setResults(prev => [...prev, result]);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to scrape video';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const scrapeMultipleVideos = useCallback(async (urls: string[]) => {
    setLoading(true);
    setError(null);

    try {
      const batchResults = await YouTubeUploaderAPI.scrapeMultipleVideos(urls);
      setResults(prev => [...prev, ...batchResults]);
      return batchResults;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to scrape videos';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return {
    loading,
    error,
    results,
    scrapeVideo,
    scrapeMultipleVideos,
    clearResults,
  };
}

/**
 * Hook for managing video uploads with progress tracking
 */
export function useVideoUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<UploadResult[]>([]);

  const uploadVideo = useCallback(async (
    filePath: string,
    metadata: any,
    onProgress?: (progress: UploadProgress) => void
  ) => {
    setUploading(true);
    setError(null);
    setProgress(null);

    try {
      const result = await YouTubeUploaderAPI.uploadVideo(
        filePath,
        metadata,
        (progressData) => {
          setProgress(progressData);
          onProgress?.(progressData);
        }
      );

      setResults(prev => [...prev, result]);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload video';
      setError(errorMessage);
      throw err;
    } finally {
      setUploading(false);
      setProgress(null);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
    setProgress(null);
  }, []);

  return {
    uploading,
    progress,
    error,
    results,
    uploadVideo,
    clearResults,
  };
}

/**
 * Hook for managing scheduler operations
 */
export function useScheduler() {
  const { state, updateScheduler } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSchedulerStatus = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const status = await YouTubeUploaderAPI.getSchedulerStatus();
      updateScheduler({ running: status.running, nextRun: status.nextRun });
      return status;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get scheduler status';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [updateScheduler]);

  const startScheduler = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await YouTubeUploaderAPI.startScheduler();
      updateScheduler({ running: true });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start scheduler';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [updateScheduler]);

  const stopScheduler = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await YouTubeUploaderAPI.stopScheduler();
      updateScheduler({ running: false });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to stop scheduler';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [updateScheduler]);

  const updateSchedulerConfig = useCallback(async (config: any) => {
    setLoading(true);
    setError(null);

    try {
      await YouTubeUploaderAPI.updateSchedulerConfig(config);
      updateScheduler({ config });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update scheduler config';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [updateScheduler]);

  useEffect(() => {
    getSchedulerStatus();
  }, [getSchedulerStatus]);

  return {
    scheduler: state.scheduler,
    loading,
    error,
    getSchedulerStatus,
    startScheduler,
    stopScheduler,
    updateSchedulerConfig,
  };
}

/**
 * Hook for managing application settings
 */
export function useSettings() {
  const { state, updateSettings, setLoading, setError } = useApp();

  const loadSettings = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const settings = await YouTubeUploaderAPI.getSettings();
      updateSettings(settings);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load settings';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [updateSettings, setLoading, setError]);

  const saveSettings = useCallback(async (settings: Partial<{
    apiKey: string;
    channelId: string;
    defaultPrivacy: 'public' | 'private' | 'unlisted';
    autoTags: boolean;
    notifications: boolean;
  }>) => {
    setLoading(true);
    setError(null);

    try {
      await YouTubeUploaderAPI.updateSettings(settings);
      updateSettings(settings);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save settings';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [updateSettings, setLoading, setError]);

  useEffect(() => {
    if (!state.isAuthenticated) return;
    loadSettings();
  }, [loadSettings, state.isAuthenticated]);

  return {
    settings: state.settings,
    loading: state.loading,
    error: state.error,
    loadSettings,
    saveSettings,
  };
}

/**
 * Hook for managing quota information
 */
export function useQuota() {
  const { state, dispatch } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadQuota = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const quota = await YouTubeUploaderAPI.getQuotaInfo();
      dispatch({ type: 'UPDATE_QUOTA', payload: quota });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load quota information';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    if (!state.isAuthenticated) return;
    loadQuota();
  }, [loadQuota, state.isAuthenticated]);

  return {
    quota: state.quota,
    loading,
    error,
    loadQuota,
  };
}

/**
 * Hook for managing logs
 */
export function useLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const loadLogs = useCallback(async (limit = 100, offset = 0) => {
    setLoading(true);
    setError(null);

    try {
      const response = await YouTubeUploaderAPI.getLogs(limit, offset);
      setLogs(response.logs);
      setTotal(response.total);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load logs';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearLogs = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await YouTubeUploaderAPI.clearLogs();
      setLogs([]);
      setTotal(0);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to clear logs';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  return {
    logs,
    total,
    loading,
    error,
    loadLogs,
    clearLogs,
  };
}