import { useState } from 'react';
import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BarChart3,
  TrendingUp,
  Upload,
  Shuffle,
  Settings,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useSettings } from '@/contexts/SettingsContext';

const navigationItems = [
  { name: 'Portfolio & Securities', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Entity Comparison', href: '/dashboard/comparison', icon: BarChart3 },
  { name: 'Backtesting Tool', href: '/dashboard/backtest', icon: TrendingUp },
  { name: 'Data Uploads', href: '/dashboard/uploads', icon: Upload },
  { name: 'Rebalancing Tool', href: '/dashboard/rebalance', icon: Shuffle },
];

export function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { useTestData } = useSettings();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const isActive = (href: string) => {
    return (
      location.pathname === href ||
      (href === '/dashboard' && location.pathname === '/dashboard')
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="lg:hidden"
              aria-label="Toggle navigation"
            >
              {sidebarCollapsed ? (
                <Menu className="h-5 w-5" />
              ) : (
                <X className="h-5 w-5" />
              )}
            </Button>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-semibold">Murgenere Analytics</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {useTestData && (
              <div className="flex items-center gap-2 px-3 py-1 bg-amber-100 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-700 rounded-lg">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-amber-700 dark:text-amber-300">
                  Test Data Mode
                </span>
              </div>
            )}
            <div className="text-sm text-muted-foreground">
              Last Updated: {new Date().toLocaleTimeString()}
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarCollapsed ? 'w-16' : 'w-64'
          } border-r bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50 transition-all duration-300 flex flex-col`}
        >
          {/* Main Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                } ${sidebarCollapsed ? 'justify-center' : ''}`}
                title={sidebarCollapsed ? item.name : undefined}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!sidebarCollapsed && (
                  <span className="font-medium">{item.name}</span>
                )}
              </Link>
            ))}
          </nav>

          {/* Settings at bottom */}
          <div className="p-4 border-t">
            <Link
              to="/dashboard/settings"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                location.pathname === '/dashboard/settings'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              } ${sidebarCollapsed ? 'justify-center' : ''}`}
              title={sidebarCollapsed ? 'Settings' : undefined}
            >
              <Settings className="h-5 w-5 flex-shrink-0" />
              {!sidebarCollapsed && (
                <span className="font-medium">Settings</span>
              )}
            </Link>
          </div>

          {/* Collapse Toggle (Desktop only) */}
          <div className="hidden lg:block p-4 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={`w-full ${sidebarCollapsed ? 'px-2' : ''}`}
            >
              {sidebarCollapsed ? (
                <Menu className="h-4 w-4" />
              ) : (
                <X className="h-4 w-4" />
              )}
              {!sidebarCollapsed && <span className="ml-2">Collapse</span>}
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
