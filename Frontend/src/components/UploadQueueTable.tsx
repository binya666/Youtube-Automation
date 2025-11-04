import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Clock } from 'lucide-react';

interface UploadVideo {
  id: number;
  title: string;
  scheduledTime: string;
  status: 'scheduled' | 'uploading' | 'completed' | 'error';
}

interface UploadQueueTableProps {
  videos: UploadVideo[];
}

export function UploadQueueTable({ videos }: UploadQueueTableProps) {
  const getStatusBadge = (status: string) => {
    if (status === 'uploading') {
      return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Uploading</Badge>;
    }
    if (status === 'completed') {
      return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Completed</Badge>;
    }
    if (status === 'error') {
      return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Error</Badge>;
    }
    return <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-100">Scheduled</Badge>;
  };

  return (
    <Card className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-gray-900">Upload Queue</h3>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-12">#</TableHead>
              <TableHead>Video Title</TableHead>
              <TableHead>Scheduled Time</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {videos.map((video) => (
              <TableRow key={video.id}>
                <TableCell className="text-gray-500">{video.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-gray-400" />
                    <span className="text-gray-900">{video.title}</span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-600">{video.scheduledTime}</TableCell>
                <TableCell>{getStatusBadge(video.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
