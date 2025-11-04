import { Badge } from './ui/badge';

interface TopBarProps {
  systemStatus: 'active' | 'paused';
  onToggleStatus: () => void;
}

export function TopBar({ systemStatus, onToggleStatus }: TopBarProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
      <div>
        <h2 className="text-gray-900">YouTube Video Automation System</h2>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-gray-600 text-sm">System Status:</span>
          <Badge 
            variant={systemStatus === 'active' ? 'default' : 'secondary'}
            className={systemStatus === 'active' ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-gray-100 text-gray-700 hover:bg-gray-100'}
          >
            <span className={`inline-block w-2 h-2 rounded-full mr-2 ${systemStatus === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
            {systemStatus === 'active' ? 'Active' : 'Paused'}
          </Badge>
        </div>
        <button
          onClick={onToggleStatus}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          {systemStatus === 'active' ? 'Pause System' : 'Resume System'}
        </button>
      </div>
    </header>
  );
}
