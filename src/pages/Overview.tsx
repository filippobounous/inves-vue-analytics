
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart3,
  DollarSign,
  Percent,
  Activity,
  AlertCircle,
  Download,
} from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

export function Overview() {
  const { useTestData } = useSettings();

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return `${amount.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })} ${currency}`;
  };

  const formatPercent = (percent: number) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };

  // Mock data for demonstration
  const overviewData = {
    totalValue: 2847392.50,
    totalGainLoss: 127492.30,
    totalGainLossPercent: 4.69,
    mtdReturn: 2.14,
    qtdReturn: 8.32,
    ytdReturn: 12.76,
    oneYearReturn: 18.94,
    volatility: 14.28,
    sharpeRatio: 1.34,
    maxDrawdown: -8.42,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Portfolio Overview</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive view of your investment performance and allocation
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Dashboard
          </Button>
        </div>
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Portfolio Value</p>
                <p className="text-2xl font-bold">{formatCurrency(overviewData.totalValue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total P&L</p>
                <p className={`text-2xl font-bold ${
                  overviewData.totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatCurrency(overviewData.totalGainLoss)}
                </p>
                <p className={`text-sm ${
                  overviewData.totalGainLossPercent >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatPercent(overviewData.totalGainLossPercent)}
                </p>
              </div>
              {overviewData.totalGainLoss >= 0 ? 
                <TrendingUp className="h-8 w-8 text-green-600" /> : 
                <TrendingDown className="h-8 w-8 text-red-600" />
              }
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">YTD Return</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatPercent(overviewData.ytdReturn)}
                </p>
              </div>
              <Percent className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Volatility (Ann.)</p>
                <p className="text-2xl font-bold">{formatPercent(overviewData.volatility)}</p>
              </div>
              <Activity className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Performance Snapshot
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">MTD</span>
                  <span className="text-sm font-medium text-green-600">
                    {formatPercent(overviewData.mtdReturn)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">QTD</span>
                  <span className="text-sm font-medium text-green-600">
                    {formatPercent(overviewData.qtdReturn)}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">YTD</span>
                  <span className="text-sm font-medium text-green-600">
                    {formatPercent(overviewData.ytdReturn)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">1Y</span>
                  <span className="text-sm font-medium text-green-600">
                    {formatPercent(overviewData.oneYearReturn)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Risk Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Sharpe Ratio</span>
                <span className="text-sm font-medium">{overviewData.sharpeRatio.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Max Drawdown</span>
                <span className="text-sm font-medium text-red-600">
                  {formatPercent(overviewData.maxDrawdown)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Volatility (Ann.)</span>
                <span className="text-sm font-medium">
                  {formatPercent(overviewData.volatility)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Asset Allocation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Asset Allocation
            </CardTitle>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-3">By Asset Class</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Equities</span>
                  <Badge variant="outline">65.2%</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Fixed Income</span>
                  <Badge variant="outline">28.4%</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Cash</span>
                  <Badge variant="outline">6.4%</Badge>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">By Sector</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Technology</span>
                  <Badge variant="outline">22.1%</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Healthcare</span>
                  <Badge variant="outline">15.8%</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Financials</span>
                  <Badge variant="outline">12.3%</Badge>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">By Geography</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">North America</span>
                  <Badge variant="outline">58.7%</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Europe</span>
                  <Badge variant="outline">24.3%</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Asia Pacific</span>
                  <Badge variant="outline">17.0%</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts & Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Alerts & Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">Rebalancing Required</p>
                <p className="text-xs text-muted-foreground">
                  Portfolio allocation has drifted 5% from target
                </p>
              </div>
              <Button variant="outline" size="sm">
                Review
              </Button>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">Dividend Payment</p>
                <p className="text-xs text-muted-foreground">
                  AAPL dividend payment of 450.00 USD expected tomorrow
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
