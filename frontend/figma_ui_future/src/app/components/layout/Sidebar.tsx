import { Link, useLocation } from 'react-router';
import { Home, Activity, ClipboardList, Dumbbell, TrendingUp, FileText, Settings, Heart } from 'lucide-react';

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/dashboard', icon: Activity, label: 'Dashboard' },
  { path: '/recovery-setup', icon: ClipboardList, label: 'Recovery Plan' },
  { path: '/session', icon: Dumbbell, label: 'Session' },
  { path: '/progress', icon: TrendingUp, label: 'Progress' },
  { path: '/exercises', icon: Dumbbell, label: 'Exercises' },
  { path: '/reports', icon: FileText, label: 'Reports' },
];

interface SidebarProps {
  onNavClick?: () => void;
}

export function Sidebar({ onNavClick }: SidebarProps) {
  const location = useLocation();

  return (
    <aside
      className="h-screen w-64 flex flex-col"
      style={{
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderRight: '1px solid var(--glass-border)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
      }}
    >
      <div className="p-6 flex-1">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/20 animate-pulse-glow">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight">PhysioTracker</h1>
            <p className="text-xs text-muted-foreground font-medium">AI Recovery</p>
          </div>
        </div>

        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onNavClick}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-white shadow-lg shadow-primary/25'
                    : 'text-foreground/60 hover:bg-primary/8 hover:text-primary'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium text-[0.9rem]">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-6 pt-0">
        <div className="border-t border-border/50 pt-4">
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-foreground/60 hover:bg-primary/8 hover:text-primary transition-all duration-200 w-full">
            <Settings className="w-5 h-5" />
            <span className="font-medium text-[0.9rem]">Settings</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
