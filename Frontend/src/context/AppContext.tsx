import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

export interface AppSettings {
  apiKey: string;
  channelId: string;
  defaultPrivacy: 'public' | 'private' | 'unlisted';
  autoTags: boolean;
  notifications: boolean;
  theme: 'light' | 'dark' | 'system';
}

export interface SchedulerState {
  enabled: boolean;
  running: boolean;
  nextRun?: string;
  config: {
    schedule: string;
    maxVideosPerDay: number;
    categories: string[];
  };
}

export interface QuotaInfo {
  dailyQuota: number;
  usedToday: number;
  remaining: number;
  resetTime: string;
}

export interface AppState {
  settings: AppSettings;
  scheduler: SchedulerState;
  quota: QuotaInfo | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppSettings> }
  | { type: 'UPDATE_SCHEDULER'; payload: Partial<SchedulerState> }
  | { type: 'UPDATE_QUOTA'; payload: QuotaInfo }
  | { type: 'RESET_STATE' };

const initialState: AppState = {
  settings: {
    apiKey: '',
    channelId: '',
    defaultPrivacy: 'private',
    autoTags: true,
    notifications: true,
    theme: 'system',
  },
  scheduler: {
    enabled: false,
    running: false,
    config: {
      schedule: '0 9 * * *', // Daily at 9 AM
      maxVideosPerDay: 10,
      categories: [],
    },
  },
  quota: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload };
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };
    case 'UPDATE_SCHEDULER':
      return {
        ...state,
        scheduler: { ...state.scheduler, ...action.payload },
      };
    case 'UPDATE_QUOTA':
      return { ...state, quota: action.payload };
    case 'RESET_STATE':
      return initialState;
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // Helper functions
  updateSettings: (settings: Partial<AppSettings>) => void;
  updateScheduler: (scheduler: Partial<SchedulerState>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetState: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Helper functions
  const updateSettings = (settings: Partial<AppSettings>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
    // Persist to localStorage
    const updatedSettings = { ...state.settings, ...settings };
    localStorage.setItem('app_settings', JSON.stringify(updatedSettings));
  };

  const updateScheduler = (scheduler: Partial<SchedulerState>) => {
    dispatch({ type: 'UPDATE_SCHEDULER', payload: scheduler });
  };

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setError = (error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const resetState = () => {
    dispatch({ type: 'RESET_STATE' });
    localStorage.removeItem('app_settings');
    localStorage.removeItem('auth_token');
  };

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('app_settings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
      } catch (error) {
        console.error('Failed to parse saved settings:', error);
      }
    }

    // Check authentication status
    const token = localStorage.getItem('auth_token');
    dispatch({ type: 'SET_AUTHENTICATED', payload: !!token });
  }, []);

  // Theme management
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (state.settings.theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(state.settings.theme);
    }
  }, [state.settings.theme]);

  const value: AppContextType = {
    state,
    dispatch,
    updateSettings,
    updateScheduler,
    setLoading,
    setError,
    resetState,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}