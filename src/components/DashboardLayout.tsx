
import { useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { 
  PieChart, 
  BarChart3, 
  Settings, 
  TrendingUp, 
  Upload, 
  Shuffle,
  Building,
  Calculator,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';

const navigation = [
  {
    name: 'Portfolio & Securities',
    href: '/dashboard',
    icon: PieChart,
    description: 'View detailed portfolio and security information'
  },
  {
    name: 'Entity Comparison',
    href: '/dashboard/comparison',
    icon: BarChart3,
    description: 'Compare and analyze multiple entities'
  },
  {
    name: 'Backtesting',
    href: '/dashboard/backtest',
    icon: Calculator,
    description: 'Run historical performance backtests'
  },
  {
    name: 'Data Uploads',
    href: '/dashboard/uploads',
    icon: Upload,
    description: 'Upload transactions and portfolio data'
  },
  {
    name: 'Rebalancing',
    href: '/dashboard/rebalance',
    icon: Shuffle,
    description: 'Optimize portfolio allocations'
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
    description: 'Configure preferences and options'
  }
];

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 transform bg-card/95 backdrop-blur-xl border-r border-border/50 transition-transform duration-300 ease-in-out lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-border/50">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
                <Building className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">Murgenere</h1>
                <p className="text-xs text-muted-foreground">Investment Analytics</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 p-4">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href || 
                (item.href === '/dashboard' && location.pathname === '/');
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-start space-x-3 rounded-xl p-3 text-sm transition-all duration-200 hover:bg-muted/50",
                    isActive 
                      ? "bg-primary/10 text-primary border border-primary/20" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <item.icon className={cn(
                    "h-5 w-5 mt-0.5 flex-shrink-0",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )} />
                  <div className="flex-1 min-w-0">
                    <div className={cn(
                      "font-medium truncate",
                      isActive ? "text-primary" : "text-foreground"
                    )}>
                      {item.name}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {item.description}
                    </div>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border/50">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Theme</span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top bar */}
        <div className="sticky top-0 z-30 h-16 bg-background/95 backdrop-blur-xl border-b border-border/50">
          <div className="flex h-full items-center justify-between px-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-muted-foreground">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
