import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  gradient?: boolean;
}

export function StatsCard({ title, value, icon: Icon, trend, trendUp, gradient = false }: StatsCardProps) {
  return (
    <div
      className={`p-6 rounded-2xl shadow-sm border border-border/50 transition-all hover:shadow-lg ${
        gradient ? 'bg-gradient-to-br from-primary to-purple-600 text-white' : 'bg-card'
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-sm ${gradient ? 'text-white/80' : 'text-muted-foreground'}`}>{title}</p>
          <p className="text-3xl font-semibold mt-2">{value}</p>
          {trend && (
            <p className={`text-sm mt-2 ${gradient ? 'text-white/90' : trendUp ? 'text-green-600' : 'text-red-600'}`}>
              {trend}
            </p>
          )}
        </div>
        <div
          className={`p-3 rounded-xl ${gradient ? 'bg-white/20' : 'bg-primary/10'}`}
        >
          <Icon className={`w-6 h-6 ${gradient ? 'text-white' : 'text-primary'}`} />
        </div>
      </div>
    </div>
  );
}
