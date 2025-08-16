
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Overview } from '@/pages/Overview';
import { PortfolioOverview } from '@/pages/PortfolioOverview';
import { EntityComparison } from '@/pages/EntityComparison';
import { BacktestingTool } from '@/pages/BacktestingTool';
import { DataUploads } from '@/pages/DataUploads';
import { RebalancingTool } from '@/pages/RebalancingTool';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SettingsProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Overview />} />
              <Route path="portfolios" element={<PortfolioOverview />} />
              <Route path="securities" element={<PortfolioOverview />} />
              <Route path="comparison" element={<EntityComparison />} />
              <Route path="backtest" element={<BacktestingTool />} />
              <Route path="uploads" element={<DataUploads />} />
              <Route path="rebalance" element={<RebalancingTool />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </SettingsProvider>
  </QueryClientProvider>
);

export default App;
