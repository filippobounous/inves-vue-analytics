
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  Target,
  AlertTriangle,
  BarChart3,
  Download,
} from 'lucide-react';

export function Overview() {
  // Mock data for professional display
  const portfolioValue = 2847500;
  const totalReturn = 127500;
  const returnPercent = 4.69;
  const dayChange = -8750;
  const dayChangePercent = -0.31;

  const formatCurrency = (amount: number) => {
    return `${Math.abs(amount).toLocaleString()} USD`;
  };

  const formatPercent = (percent: number) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Portfolio Overview</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor your investments and track performance across all portfolios
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Value
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(portfolioValue)}</div>
            <div className="flex items-center text-sm mt-1">
              <TrendingUp className="h-3 w-3 text-success mr-1" />
              <span className="text-success">+2.1% vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Return
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {formatCurrency(totalReturn)}
            </div>
            <div className="text-sm text-success mt-1">
              {formatPercent(returnPercent)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Day Change
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {formatCurrency(dayChange)}
            </div>
            <div className="text-sm text-destructive mt-1">
              {formatPercent(dayChangePercent)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Risk Score
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6.2</div>
            <div className="flex items-center mt-1">
              <Badge variant="secondary" className="text-xs">
                Moderate
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Performance Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg">
              <div className="text-center text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-25" />
                <p className="text-sm">Performance chart will display here</p>
                <p className="text-xs">Shows portfolio value over time</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Asset Allocation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Asset Allocation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-chart-1"></div>
                  <span className="text-sm font-medium">Equities</span>
                </div>
                <span className="text-sm text-muted-foreground">65%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-chart-2"></div>
                  <span className="text-sm font-medium">Bonds</span>
                </div>
                <span className="text-sm text-muted-foreground">25%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-chart-3"></div>
                  <span className="text-sm font-medium">Alternatives</span>
                </div>
                <span className="text-sm text-muted-foreground">7%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-chart-4"></div>
                  <span className="text-sm font-medium">Cash</span>
                </div>
                <span className="text-sm text-muted-foreground">3%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Performers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'AAPL', return: '+8.4%', value: '45,200 USD' },
                { name: 'MSFT', return: '+6.2%', value: '38,900 USD' },
                { name: 'GOOGL', return: '+4.8%', value: '29,150 USD' },
              ].map((stock) => (
                <div key={stock.name} className="flex items-center justify-between py-1">
                  <div>
                    <p className="font-medium text-sm">{stock.name}</p>
                    <p className="text-xs text-muted-foreground">{stock.value}</p>
                  </div>
                  <Badge variant="secondary" className="text-success text-xs">
                    {stock.return}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alerts & Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Alerts & Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-2 rounded-lg bg-warning/5 border border-warning/20">
                <AlertTriangle className="h-4 w-4 text-warning mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Rebalancing Suggested</p>
                  <p className="text-xs text-muted-foreground">
                    Portfolio allocation drifted from target
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-2 rounded-lg bg-primary/5 border border-primary/20">
                <TrendingUp className="h-4 w-4 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Dividend Payment</p>
                  <p className="text-xs text-muted-foreground">
                    MSFT dividend of 850 USD received
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
