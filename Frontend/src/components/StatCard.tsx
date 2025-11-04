import { Card } from './ui/card';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

export function StatCard({ title, value, icon: Icon, color, bgColor }: StatCardProps) {
  return (
    <Card className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-2">{title}</p>
          <p className="text-gray-900">{value}</p>
        </div>
        <div className={`${bgColor} ${color} p-3 rounded-lg`}>
          <Icon size={24} />
        </div>
      </div>
    </Card>
  );
}
