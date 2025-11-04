import { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Slider } from '../components/ui/slider';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { Play, Square, Link, Eye, EyeOff } from 'lucide-react';

export default function ScraperPage() {
  const [url, setUrl] = useState('https://www.facebook.com/MetaAIVibes');
  const [videoCount, setVideoCount] = useState([25]);
  const [headlessMode, setHeadlessMode] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [foundUrls, setFoundUrls] = useState(0);

  const handleStart = () => {
    setIsRunning(true);
    // Simulate progress
    let currentProgress = 0;
    let currentUrls = 0;
    const interval = setInterval(() => {
      currentProgress += 2;
      currentUrls += 1;
      setProgress(currentProgress);
      setFoundUrls(currentUrls);
      if (currentProgress >= 100) {
        clearInterval(interval);
        setIsRunning(false);
      }
    }, 200);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-gray-900 mb-2">Video Scraper</h2>
        <p className="text-gray-600">Configure and run the video scraping process</p>
      </div>

      {/* Configuration Card */}
      <Card className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-gray-900 mb-6">Scraper Configuration</h3>
        
        <div className="space-y-6">
          {/* URL Input */}
          <div className="space-y-2">
            <Label htmlFor="url">Meta AI Vibes Page URL</Label>
            <div className="relative">
              <Input
                id="url"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter Facebook page URL"
                className="pl-10 rounded-lg"
              />
              <Link size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Video Count Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="video-count">Number of Videos to Scrape</Label>
              <span className="text-sm text-gray-900">{videoCount[0]}</span>
            </div>
            <Slider
              id="video-count"
              value={videoCount}
              onValueChange={setVideoCount}
              min={1}
              max={50}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>1</span>
              <span>50</span>
            </div>
          </div>

          {/* Headless Mode Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              {headlessMode ? <EyeOff size={20} className="text-gray-600" /> : <Eye size={20} className="text-gray-600" />}
              <div>
                <Label htmlFor="headless-mode" className="cursor-pointer">Headless Browser Mode</Label>
                <p className="text-sm text-gray-500">Run browser in background without UI</p>
              </div>
            </div>
            <Switch
              id="headless-mode"
              checked={headlessMode}
              onCheckedChange={setHeadlessMode}
            />
          </div>

          {/* Control Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleStart}
              disabled={isRunning || !url}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              <Play size={16} className="mr-2" />
              Start Scraper
            </Button>
            <Button
              onClick={handleStop}
              disabled={!isRunning}
              variant="outline"
              className="rounded-lg"
            >
              <Square size={16} className="mr-2" />
              Stop
            </Button>
          </div>
        </div>
      </Card>

      {/* Progress Card */}
      <Card className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-900">Scraping Progress</h3>
          <Badge 
            variant="secondary"
            className={isRunning ? 'bg-blue-100 text-blue-700 hover:bg-blue-100' : 'bg-gray-100 text-gray-700 hover:bg-gray-100'}
          >
            {isRunning ? 'Running' : 'Idle'}
          </Badge>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">URLs Found</p>
              <p className="text-gray-900">{foundUrls}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Target</p>
              <p className="text-gray-900">{videoCount[0]} videos</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Current Status</span>
              <span className="text-gray-900">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {isRunning && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-sm text-blue-900">
                {progress < 30 ? 'Initializing browser...' : 
                 progress < 60 ? 'Scrolling through page...' : 
                 progress < 90 ? 'Extracting video URLs...' : 
                 'Finalizing...'}
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
