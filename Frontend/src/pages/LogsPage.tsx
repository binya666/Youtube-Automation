import { useState } from 'react';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Search } from 'lucide-react';

export default function LogsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  const logs = [
    { id: 1, timestamp: '2024-10-31 10:34:22', type: 'success', operation: 'Download', message: 'Video "AI Tutorial Part 5" downloaded successfully', details: 'File size: 156 MB' },
    { id: 2, timestamp: '2024-10-31 10:28:15', type: 'success', operation: 'Upload', message: 'Video "Machine Learning Basics" uploaded to YouTube', details: 'Video ID: dQw4w9WgXcQ' },
    { id: 3, timestamp: '2024-10-31 10:15:08', type: 'info', operation: 'Scraper', message: 'Started scraping Meta AI Vibes page', details: 'Target: 25 videos' },
    { id: 4, timestamp: '2024-10-31 09:55:33', type: 'success', operation: 'Download', message: 'Video "Neural Networks Explained" downloaded successfully', details: 'File size: 203 MB' },
    { id: 5, timestamp: '2024-10-31 09:42:11', type: 'success', operation: 'Upload', message: 'Video "Deep Learning Introduction" uploaded to YouTube', details: 'Video ID: a3Z7zEc7AXQ' },
    { id: 6, timestamp: '2024-10-31 09:30:45', type: 'success', operation: 'Scraper', message: 'Scraping completed successfully', details: 'Found 47 video URLs' },
    { id: 7, timestamp: '2024-10-31 09:15:22', type: 'error', operation: 'Download', message: 'Failed to download "Computer Vision Tutorial"', details: 'Error: Connection timeout' },
    { id: 8, timestamp: '2024-10-31 09:05:18', type: 'warning', operation: 'Upload', message: 'Upload queue is getting full', details: '156 videos scheduled' },
    { id: 9, timestamp: '2024-10-31 08:50:33', type: 'info', operation: 'System', message: 'System started successfully', details: 'All modules initialized' },
    { id: 10, timestamp: '2024-10-31 08:45:12', type: 'success', operation: 'Download', message: 'Video "Python for AI" downloaded successfully', details: 'File size: 178 MB' },
  ];

  const getTypeBadge = (type: string) => {
    if (type === 'success') {
      return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Success</Badge>;
    }
    if (type === 'error') {
      return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Error</Badge>;
    }
    if (type === 'warning') {
      return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">Warning</Badge>;
    }
    return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Info</Badge>;
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = searchQuery === '' || 
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.operation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || log.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900 mb-2">Logs & History</h2>
        <p className="text-gray-600">View system activity and operation history</p>
      </div>

      {/* Filters */}
      <Card className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Input
              type="text"
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-lg"
            />
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-48 rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="error">Error</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="info">Info</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Logs List */}
      <Card className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-100">
          {filteredLogs.map((log) => (
            <div key={log.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  {getTypeBadge(log.type)}
                  <span className="text-sm text-gray-500">{log.timestamp}</span>
                  <Badge variant="outline" className="text-gray-600">{log.operation}</Badge>
                </div>
              </div>
              <p className="text-gray-900 mb-1">{log.message}</p>
              <p className="text-sm text-gray-500">{log.details}</p>
            </div>
          ))}
        </div>
      </Card>

      {filteredLogs.length === 0 && (
        <Card className="p-12 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="text-center">
            <p className="text-gray-500">No logs found matching your filters</p>
          </div>
        </Card>
      )}
    </div>
  );
}
