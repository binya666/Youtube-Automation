import { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Progress } from '../components/ui/progress';
import { Upload } from 'lucide-react';
import { UploadQueueTable } from '../components/UploadQueueTable';

export default function UploaderPage() {
  const [titleTemplate, setTitleTemplate] = useState('{video_title} | AI Tutorial');
  const [descriptionTemplate, setDescriptionTemplate] = useState('Check out this amazing AI tutorial!\n\n#AI #MachineLearning #Tutorial');
  const [uploadTime, setUploadTime] = useState('14:30');

  const uploadQueue = [
    { id: 1, title: 'AI Revolution 2024 - Complete Guide', scheduledTime: '2:30 PM', status: 'scheduled' as const },
    { id: 2, title: 'Machine Learning Fundamentals', scheduledTime: '3:00 PM', status: 'scheduled' as const },
    { id: 3, title: 'Neural Networks Explained Simply', scheduledTime: '3:30 PM', status: 'scheduled' as const },
    { id: 4, title: 'Deep Learning Tutorial Part 1', scheduledTime: '4:00 PM', status: 'scheduled' as const },
    { id: 5, title: 'Computer Vision Basics', scheduledTime: '4:30 PM', status: 'scheduled' as const },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900 mb-2">Video Uploader</h2>
        <p className="text-gray-600">Configure upload settings and manage upload queue</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Upload Configuration */}
        <Card className="col-span-2 p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-gray-900 mb-6">Upload Configuration</h3>
          
          <div className="space-y-6">
            {/* Schedule Settings */}
            <div className="space-y-2">
              <Label htmlFor="upload-time">Default Upload Time</Label>
              <div className="flex gap-3">
                <Input
                  id="upload-time"
                  type="time"
                  value={uploadTime}
                  onChange={(e) => setUploadTime(e.target.value)}
                  className="rounded-lg"
                />
                <Select defaultValue="daily">
                  <SelectTrigger className="w-40 rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="once">Once</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Title Template */}
            <div className="space-y-2">
              <Label htmlFor="title-template">Title Template</Label>
              <Input
                id="title-template"
                value={titleTemplate}
                onChange={(e) => setTitleTemplate(e.target.value)}
                placeholder="Enter title template"
                className="rounded-lg"
              />
              <p className="text-xs text-gray-500">Use {'{video_title}'} as placeholder</p>
            </div>

            {/* Description Template */}
            <div className="space-y-2">
              <Label htmlFor="description-template">Description Template</Label>
              <Textarea
                id="description-template"
                value={descriptionTemplate}
                onChange={(e) => setDescriptionTemplate(e.target.value)}
                placeholder="Enter description template"
                rows={5}
                className="rounded-lg resize-none"
              />
              <p className="text-xs text-gray-500">Add hashtags and custom text for all uploads</p>
            </div>

            {/* Action Button */}
            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-lg">
              <Upload size={16} className="mr-2" />
              Trigger Manual Upload
            </Button>
          </div>
        </Card>

        {/* Current Upload Progress */}
        <Card className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-gray-900 mb-6">Current Upload</h3>
          
          <div className="space-y-6">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-start gap-3">
                <Upload size={20} className="text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-blue-900 mb-1">Uploading to YouTube</p>
                  <p className="text-xs text-blue-700">AI Revolution 2024</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Upload Progress</span>
                <span className="text-gray-900">45%</span>
              </div>
              <Progress value={45} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Upload Speed</span>
                <span className="text-gray-900">1.8 MB/s</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Time Remaining</span>
                <span className="text-gray-900">5m 12s</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">File Size</span>
                <span className="text-gray-900">230 MB</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Upload Queue Table */}
      <UploadQueueTable videos={uploadQueue} />
    </div>
  );
}
