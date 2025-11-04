import { Video, Download, Upload, Clock } from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { OperationProgress } from '../components/OperationProgress';
import { ActivityLog } from '../components/ActivityLog';
import { QuickActions } from '../components/QuickActions';

export default function DashboardPage() {
  const stats = [
    {
      title: 'Videos Scraped',
      value: '847',
      icon: Video,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Downloads Completed',
      value: '723',
      icon: Download,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Uploads Scheduled',
      value: '156',
      icon: Upload,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Next Upload Time',
      value: '2:30 PM',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  const recentActivity = [
    { time: '10:34 AM', operation: 'Video Downloaded', status: 'success' as const, title: 'AI Tutorial Part 5' },
    { time: '10:28 AM', operation: 'Video Uploaded', status: 'success' as const, title: 'Machine Learning Basics' },
    { time: '10:15 AM', operation: 'Scraping Started', status: 'info' as const, title: 'Meta AI Vibes Page' },
    { time: '09:55 AM', operation: 'Video Downloaded', status: 'success' as const, title: 'Neural Networks Explained' },
    { time: '09:42 AM', operation: 'Video Uploaded', status: 'success' as const, title: 'Deep Learning Introduction' },
    { time: '09:30 AM', operation: 'Scraping Completed', status: 'success' as const, title: 'Found 47 videos' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Current Operation Progress */}
      <OperationProgress
        title="Current Operation"
        description='Downloading: "AI Trends 2024 - Episode 12"'
        progress={68}
        speed="2.4 MB/s"
        eta="3m 24s"
        additionalInfo="Size: 156 MB / 230 MB"
        status="active"
      />

      <div className="grid grid-cols-3 gap-6">
        {/* Recent Activity Log */}
        <div className="col-span-2">
          <ActivityLog activities={recentActivity} />
        </div>

        {/* Quick Actions */}
        <QuickActions />
      </div>
    </div>
  );
}
