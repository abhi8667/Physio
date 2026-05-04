import { ReactNode, useState } from 'react';
import { Sidebar } from './Sidebar';
import { Menu, X } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
}

export function Layout({ children, showSidebar = true }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {showSidebar && (
        <>
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="fixed top-4 left-4 z-50 lg:hidden p-2.5 bg-card rounded-xl shadow-lg border border-border/50"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Mobile overlay */}
          {mobileOpen && (
            <div
              className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
          )}

          {/* Sidebar — hidden on mobile unless toggled */}
          <div className={`
            fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out
            lg:translate-x-0
            ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          `}>
            <Sidebar onNavClick={() => setMobileOpen(false)} />
          </div>
        </>
      )}
      <main className={showSidebar ? 'lg:ml-64 min-h-screen' : 'min-h-screen'}>
        {children}
      </main>
    </div>
  );
}
