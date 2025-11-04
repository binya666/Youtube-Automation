import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Download } from 'lucide-react';

interface Video {
  id: number;
  title: string;
  url: string;
  status: 'downloading' | 'queued' | 'completed' | 'error';
  progress: number;
}

interface VideoQueueTableProps {
  videos: Video[];
  showProgress?: boolean;
}

export function VideoQueueTable({ videos, showProgress = true }: VideoQueueTableProps) {
  const getStatusBadge = (status: string) => {
    if (status === 'downloading') {
      return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Downloading</Badge>;
    }
    if (status === 'completed') {
      return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Completed</Badge>;
    }
    if (status === 'error') {
      return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Error</Badge>;
    }
    return <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-100">Queued</Badge>;
  };

  return (
    <Card className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-12">#</TableHead>
              <TableHead>Video Title</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Status</TableHead>
              {showProgress && <TableHead className="w-64">Progress</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {videos.map((video) => (
              <TableRow key={video.id}>
                <TableCell className="text-gray-500">{video.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Download size={16} className="text-gray-400" />
                    <span className="text-gray-900">{video.title}</span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-500 text-sm max-w-xs truncate">
                  {video.url}
                </TableCell>
                <TableCell>{getStatusBadge(video.status)}</TableCell>
                {showProgress && (
                  <TableCell>
                    {video.status === 'downloading' ? (
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Downloading...</span>
                          <span className="text-gray-900">{video.progress}%</span>
                        </div>
                        <Progress value={video.progress} className="h-1.5" />
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <Progress value={video.status === 'completed' ? 100 : 0} className="h-1.5" />
                      </div>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
