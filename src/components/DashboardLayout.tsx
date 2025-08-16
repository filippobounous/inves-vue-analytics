
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
  Search,
  Bell,
  Calendar,
  DollarSign,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useSettings } from '@/contexts/SettingsContext';
import { cn } from '@/lib/utils';

const navigationItems = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Portfolios', href: '/dashboard/portfolios', icon: BarChart3 },
  { name: 'Securities', href: '/dashboard/securities', icon: TrendingUp },
  { name: 'Comparison', href: '/dashboard/comparison', icon: Shuffle },
  { name: 'Data Uploads', href: '/dashboard/uploads', icon: Upload },
];

export function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { useTestData } = useSettings();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [globalCurrency, setGlobalCurrency] = useState('USD');

  const isActive = (href: string) => {
    return location.pathname === href || 
           (href === '/dashboard' && location.pathname === '/dashboard');
  };

  const getBreadcrumbs = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Overview';
    if (path.includes('portfolios')) return 'Portfolios';
    if (path.includes('securities')) return 'Securities';
    if (path.includes('comparison')) return 'Entity Comparison';
    if (path.includes('uploads')) return 'Data Uploads';
    if (path.includes('settings')) return 'Settings';
    return 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-6">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="lg:hidden"
              aria-label="Toggle navigation"
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-semibold">Investment Analytics</h1>
                <p className="text-xs text-muted-foreground">{getBreadcrumbs()}</p>
              </div>
            </div>
          </div>

          {/* Center Section */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Button variant="outline" size="sm">
                Last 1Y
              </Button>
            </div>
            
            <Select value={globalCurrency} onValueChange={setGlobalCurrency}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="GBP">GBP</SelectItem>
                <SelectItem value="JPY">JPY</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="w-64 pl-9"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {useTestData && (
              <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <span className="text-sm text-amber-700 dark:text-amber-300">
                  Test Data Mode
                </span>
              </div>
            )}
            
            <div className="text-sm text-muted-foreground">
              Last Updated: {new Date().toLocaleTimeString()}
            </div>
            
            <Button variant="ghost" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            'sticky top-16 h-[calc(100vh-4rem)] border-r bg-background/95 backdrop-blur transition-all duration-300 flex flex-col',
            sidebarCollapsed ? 'w-16' : 'w-64'
          )}
        >
          {/* Main Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                  isActive(item.href)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent',
                  sidebarCollapsed ? 'justify-center' : ''
                )}
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
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                location.pathname === '/dashboard/settings'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent',
                sidebarCollapsed ? 'justify-center' : ''
              )}
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
              className={cn('w-full', sidebarCollapsed ? 'px-2' : '')}
            >
              {sidebarCollapsed ? (
                <Menu className="h-4 w-4" />
              ) : (
                <>
                  <X className="h-4 w-4" />
                  <span className="ml-2">Collapse</span>
                </>
              )}
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
