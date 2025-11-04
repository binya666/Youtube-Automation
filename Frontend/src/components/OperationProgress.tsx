import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Play } from 'lucide-react';

interface OperationProgressProps {
  title: string;
  description: string;
  progress: number;
  speed?: string;
  eta?: string;
  additionalInfo?: string;
  status?: 'active' | 'paused' | 'completed';
}

export function OperationProgress({ 
  title, 
  description, 
  progress, 
  speed, 
  eta, 
  additionalInfo,
  status = 'active'
}: OperationProgressProps) {
  return (
    <Card className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-gray-900 mb-1">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
            <Play size={12} className="mr-1" />
            {status === 'active' ? 'In Progress' : status === 'paused' ? 'Paused' : 'Completed'}
          </Badge>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Progress</span>
            <span className="text-gray-900">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        {(speed || eta || additionalInfo) && (
          <div className="flex gap-4 text-sm text-gray-600">
            {speed && <span>Speed: {speed}</span>}
            {speed && (eta || additionalInfo) && <span>•</span>}
            {eta && <span>ETA: {eta}</span>}
            {eta && additionalInfo && <span>•</span>}
            {additionalInfo && <span>{additionalInfo}</span>}
          </div>
        )}
      </div>
    </Card>
  );
}
