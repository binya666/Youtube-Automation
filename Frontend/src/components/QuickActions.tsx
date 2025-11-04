import { useNavigate } from 'react-router-dom';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Play, Download, Upload } from 'lucide-react';

export function QuickActions() {
  const navigate = useNavigate();

  return (
    <Card className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
      <h3 className="text-gray-900 mb-4">Quick Actions</h3>
      <div className="space-y-3">
        <Button 
          onClick={() => navigate('/scraper')}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          <Play size={16} className="mr-2" />
          Start Scraper
        </Button>
        <Button 
          onClick={() => navigate('/downloader')}
          className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg"
        >
          <Download size={16} className="mr-2" />
          Start Downloader
        </Button>
        <Button 
          onClick={() => navigate('/uploader')}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
        >
          <Upload size={16} className="mr-2" />
          Start Uploader
        </Button>
      </div>
    </Card>
  );
}
