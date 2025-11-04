import { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Play, Pause, Square } from 'lucide-react';
import { VideoQueueTable } from '../components/VideoQueueTable';

export default function DownloaderPage() {
  const [isPaused, setIsPaused] = useState(false);

  const videos = [
    { id: 1, title: 'AI Revolution 2024 - Complete Guide', url: 'https://example.com/video1', status: 'downloading' as const, progress: 68 },
    { id: 2, title: 'Machine Learning Fundamentals', url: 'https://example.com/video2', status: 'queued' as const, progress: 0 },
    { id: 3, title: 'Neural Networks Explained Simply', url: 'https://example.com/video3', status: 'queued' as const, progress: 0 },
    { id: 4, title: 'Deep Learning Tutorial Part 1', url: 'https://example.com/video4', status: 'queued' as const, progress: 0 },
    { id: 5, title: 'Computer Vision Basics', url: 'https://example.com/video5', status: 'queued' as const, progress: 0 },
    { id: 6, title: 'Natural Language Processing Guide', url: 'https://example.com/video6', status: 'queued' as const, progress: 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 mb-2">Video Downloader</h2>
          <p className="text-gray-600">Manage and monitor video downloads</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => setIsPaused(!isPaused)}
            variant="outline"
            className="rounded-lg"
          >
            {isPaused ? (
              <>
                <Play size={16} className="mr-2" />
                Resume All
              </>
            ) : (
              <>
                <Pause size={16} className="mr-2" />
                Pause All
              </>
            )}
          </Button>
          <Button variant="outline" className="rounded-lg">
            <Square size={16} className="mr-2" />
            Stop All
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-6">
        <Card className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-600 mb-2">Total in Queue</p>
          <p className="text-gray-900">6 videos</p>
        </Card>
        <Card className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-600 mb-2">Total Downloaded</p>
          <p className="text-gray-900">723</p>
        </Card>
        <Card className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-600 mb-2">Download Speed</p>
          <p className="text-gray-900">2.4 MB/s</p>
        </Card>
        <Card className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-600 mb-2">ETA</p>
          <p className="text-gray-900">12m 45s</p>
        </Card>
      </div>

      {/* Downloads Table */}
      <VideoQueueTable videos={videos} showProgress={true} />
    </div>
  );
}
