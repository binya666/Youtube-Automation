import { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import DashboardPage from './pages/DashboardPage';
import ScraperPage from './pages/ScraperPage';
import DownloaderPage from './pages/DownloaderPage';
import UploaderPage from './pages/UploaderPage';
import LogsPage from './pages/LogsPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  const [systemStatus, setSystemStatus] = useState<'active' | 'paused'>('active');

  return (
    <Router>
      <div className="flex h-screen bg-white">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar 
            systemStatus={systemStatus} 
            onToggleStatus={() => setSystemStatus(s => s === 'active' ? 'paused' : 'active')} 
          />
          <main className="flex-1 overflow-auto p-8 bg-gray-50">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/scraper" element={<ScraperPage />} />
              <Route path="/downloader" element={<DownloaderPage />} />
              <Route path="/uploader" element={<UploaderPage />} />
              <Route path="/logs" element={<LogsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}
