import { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Separator } from '../components/ui/separator';
import { Key, FolderOpen, Clock, Hash, Zap } from 'lucide-react';

export default function SettingsPage() {
  const [youtubeApiKey, setYoutubeApiKey] = useState('');
  const [downloadPath, setDownloadPath] = useState('/Users/automation/downloads');
  const [uploadPath, setUploadPath] = useState('/Users/automation/uploads');
  const [autoStart, setAutoStart] = useState(true);
  const [autoUpload, setAutoUpload] = useState(false);
  const [defaultHashtags, setDefaultHashtags] = useState('#AI #Tutorial #Education #Tech');

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-gray-900 mb-2">Settings</h2>
        <p className="text-gray-600">Configure system preferences and credentials</p>
      </div>

      {/* YouTube API Configuration */}
      <Card className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-red-50 rounded-lg">
            <Key size={20} className="text-red-600" />
          </div>
          <div>
            <h3 className="text-gray-900">YouTube API Credentials</h3>
            <p className="text-sm text-gray-600">Configure your YouTube Data API access</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">API Key</Label>
            <Input
              id="api-key"
              type="password"
              value={youtubeApiKey}
              onChange={(e) => setYoutubeApiKey(e.target.value)}
              placeholder="Enter your YouTube API key"
              className="rounded-lg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="client-id">OAuth Client ID</Label>
            <Input
              id="client-id"
              type="text"
              placeholder="Enter OAuth Client ID"
              className="rounded-lg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="client-secret">OAuth Client Secret</Label>
            <Input
              id="client-secret"
              type="password"
              placeholder="Enter OAuth Client Secret"
              className="rounded-lg"
            />
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
            Save Credentials
          </Button>
        </div>
      </Card>

      {/* File Paths Configuration */}
      <Card className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-50 rounded-lg">
            <FolderOpen size={20} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-gray-900">Default File Paths</h3>
            <p className="text-sm text-gray-600">Set default directories for downloads and uploads</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="download-path">Download Directory</Label>
            <Input
              id="download-path"
              type="text"
              value={downloadPath}
              onChange={(e) => setDownloadPath(e.target.value)}
              className="rounded-lg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="upload-path">Upload Directory</Label>
            <Input
              id="upload-path"
              type="text"
              value={uploadPath}
              onChange={(e) => setUploadPath(e.target.value)}
              className="rounded-lg"
            />
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
            Update Paths
          </Button>
        </div>
      </Card>

      {/* Upload Schedule */}
      <Card className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-50 rounded-lg">
            <Clock size={20} className="text-purple-600" />
          </div>
          <div>
            <h3 className="text-gray-900">Upload Schedule</h3>
            <p className="text-sm text-gray-600">Configure automated upload timing</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-time">Start Time</Label>
              <Input
                id="start-time"
                type="time"
                defaultValue="09:00"
                className="rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="interval">Upload Interval (minutes)</Label>
              <Input
                id="interval"
                type="number"
                defaultValue="30"
                className="rounded-lg"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="max-daily">Max Daily Uploads</Label>
            <Input
              id="max-daily"
              type="number"
              defaultValue="10"
              className="rounded-lg"
            />
          </div>
        </div>
      </Card>

      {/* Automation Settings */}
      <Card className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-50 rounded-lg">
            <Zap size={20} className="text-green-600" />
          </div>
          <div>
            <h3 className="text-gray-900">Automation Settings</h3>
            <p className="text-sm text-gray-600">Configure auto-start and automation preferences</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <Label htmlFor="auto-start" className="cursor-pointer">Auto-start on System Boot</Label>
              <p className="text-sm text-gray-500">Automatically start scraper when system starts</p>
            </div>
            <Switch
              id="auto-start"
              checked={autoStart}
              onCheckedChange={setAutoStart}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <Label htmlFor="auto-upload" className="cursor-pointer">Auto-upload After Download</Label>
              <p className="text-sm text-gray-500">Automatically schedule uploads after downloads complete</p>
            </div>
            <Switch
              id="auto-upload"
              checked={autoUpload}
              onCheckedChange={setAutoUpload}
            />
          </div>
        </div>
      </Card>

      {/* Metadata Templates */}
      <Card className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-orange-50 rounded-lg">
            <Hash size={20} className="text-orange-600" />
          </div>
          <div>
            <h3 className="text-gray-900">Hashtag and Metadata Templates</h3>
            <p className="text-sm text-gray-600">Default hashtags for video uploads</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="default-hashtags">Default Hashtags</Label>
            <Input
              id="default-hashtags"
              type="text"
              value={defaultHashtags}
              onChange={(e) => setDefaultHashtags(e.target.value)}
              placeholder="Enter hashtags separated by spaces"
              className="rounded-lg"
            />
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
            Save Templates
          </Button>
        </div>
      </Card>
    </div>
  );
}
