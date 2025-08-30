import { useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  BarChart3,
  Upload,
  Shuffle,
  Settings,
  PanelLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';

const navigationItems = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  {
    name: 'Portfolios & Securities',
    href: '/dashboard/portfolios',
    icon: BarChart3,
  },
  { name: 'Comparison', href: '/dashboard/comparison', icon: Shuffle },
  { name: 'Data Uploads', href: '/dashboard/uploads', icon: Upload },
];

export function DashboardLayout() {
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const isActive = (href: string) => {
    return (
      location.pathname === href ||
      (href === '/dashboard' && location.pathname === '/dashboard')
    );
  };

  const getBreadcrumbs = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Overview';
    if (path.includes('portfolios') || path.includes('securities'))
      return 'Portfolios & Securities';
    if (path.includes('comparison')) return 'Entity Comparison';
    if (path.includes('uploads')) return 'Data Uploads';
    if (path.includes('settings')) return 'Settings';
    return 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Professional Top Bar */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="flex h-14 items-center justify-between px-6">
          {/* Left Section - Branding & Navigation */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-sm font-semibold tracking-tight">
                  Investment Analytics
                </h1>
                <p className="text-xs text-muted-foreground">
                  {getBreadcrumbs()}
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="h-8 w-8"
            >
              <PanelLeft className="h-4 w-4" />
            </Button>
          </div>
          {/* Right Section - Status & Actions */}
          <div className="flex items-center gap-3">
            <div className="text-xs text-muted-foreground">
              Updated:{' '}
              {new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Professional Sidebar */}
        <aside
          className={cn(
            'sticky top-14 h-[calc(100vh-3.5rem)] border-r bg-card transition-all duration-200 flex flex-col',
            sidebarCollapsed ? 'w-14' : 'w-56',
          )}
        >
          {/* Main Navigation */}
          <nav className="flex-1 p-3 space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive(item.href)
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
                  sidebarCollapsed ? 'justify-center' : '',
                )}
                title={sidebarCollapsed ? item.name : undefined}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {!sidebarCollapsed && <span>{item.name}</span>}
              </Link>
            ))}
          </nav>

          {/* Settings at bottom */}
          <div className="p-3 border-t">
            <Link
              to="/dashboard/settings"
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                location.pathname === '/dashboard/settings'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
                sidebarCollapsed ? 'justify-center' : '',
              )}
              title={sidebarCollapsed ? 'Settings' : undefined}
            >
              <Settings className="h-4 w-4 flex-shrink-0" />
              {!sidebarCollapsed && <span>Settings</span>}
            </Link>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 bg-background">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
