
import { useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  BarChart3,
  TrendingUp,
  Upload,
  Shuffle,
  Settings,
  Menu,
  Search,
  Bell,
  Calendar,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
                <h1 className="text-sm font-semibold tracking-tight">Investment Analytics</h1>
                <p className="text-xs text-muted-foreground">{getBreadcrumbs()}</p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="h-8 w-8"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>

          {/* Center Section - Controls */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Button variant="outline" size="sm" className="h-8 text-xs">
                Last 12M
              </Button>
            </div>
            
            <Select value={globalCurrency} onValueChange={setGlobalCurrency}>
              <SelectTrigger className="w-16 h-8 text-xs">
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
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="w-48 h-8 pl-8 text-xs"
              />
            </div>
          </div>

          {/* Right Section - Status & Actions */}
          <div className="flex items-center gap-3">
            {useTestData && (
              <div className="flex items-center gap-1.5 px-2 py-1 bg-warning/10 border border-warning/20 rounded text-xs">
                <AlertTriangle className="h-3 w-3 text-warning" />
                <span className="text-warning font-medium">Test Mode</span>
              </div>
            )}
            
            <div className="text-xs text-muted-foreground">
              Updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Bell className="h-3.5 w-3.5" />
            </Button>
            
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Professional Sidebar */}
        <aside
          className={cn(
            'sticky top-14 h-[calc(100vh-3.5rem)] border-r bg-card transition-all duration-200 flex flex-col',
            sidebarCollapsed ? 'w-14' : 'w-56'
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
                  sidebarCollapsed ? 'justify-center' : ''
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
                sidebarCollapsed ? 'justify-center' : ''
              )}
              title={sidebarCollapsed ? 'Settings' : undefined}
            >
              <Settings className="h-4 w-4 flex-shrink-0" />
              {!sidebarCollapsed && <span>Settings</span>}
            </Link>
          </div>

          {/* Collapse Toggle */}
          <div className="p-3 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={cn('w-full h-8 text-xs', sidebarCollapsed ? 'px-2' : '')}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="h-3.5 w-3.5" />
              ) : (
                <>
                  <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                  Collapse
                </>
              )}
            </Button>
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
