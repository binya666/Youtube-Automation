import { Card } from './ui/card';
import { Badge } from './ui/badge';

interface Activity {
  time: string;
  operation: string;
  status: 'success' | 'info' | 'error';
  title: string;
}

interface ActivityLogProps {
  activities: Activity[];
}

export function ActivityLog({ activities }: ActivityLogProps) {
  return (
    <Card className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
      <h3 className="text-gray-900 mb-4">Recent Activity</h3>
      <div className="space-y-3">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
            <div className="flex items-center gap-4 flex-1">
              <span className="text-sm text-gray-500 w-20">{activity.time}</span>
              <div className="flex-1">
                <p className="text-sm text-gray-900">{activity.operation}</p>
                <p className="text-xs text-gray-500">{activity.title}</p>
              </div>
            </div>
            <Badge 
              variant="secondary"
              className={
                activity.status === 'success' 
                  ? 'bg-green-100 text-green-700 hover:bg-green-100' 
                  : activity.status === 'error'
                  ? 'bg-red-100 text-red-700 hover:bg-red-100'
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-100'
              }
            >
              {activity.status === 'success' ? 'Success' : activity.status === 'error' ? 'Error' : 'Info'}
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  );
}
