import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart3,
  Eye,
  Calendar,
  DollarSign,
  Percent,
} from 'lucide-react';
import { useSettings } from '@/hooks/use-settings';
import { TEST_PORTFOLIOS, TEST_SECURITIES } from '@/services/testData';

interface PortfolioHolding {
  code: string;
  name: string;
  assetClass: string;
  currency: string;
  weight: number;
  purchaseDate: string;
  currentPrice: number;
  purchasePrice: number;
  quantity: number;
  unrealizedGainLoss: number;
  unrealizedGainLossPercent: number;
  sector?: string;
}

interface PortfolioSummary {
  code: string;
  name: string;
  totalValue: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  holdings: PortfolioHolding[];
}

const generateMockHoldings = (portfolioCode: string): PortfolioHolding[] => {
  const securities = TEST_SECURITIES.slice(
    0,
    Math.floor(Math.random() * 5) + 3,
  );

  return securities.map((security, index) => {
    const purchasePrice = Math.random() * 200 + 50;
    const currentPrice = purchasePrice * (0.8 + Math.random() * 0.4);
    const quantity = Math.floor(Math.random() * 1000) + 100;
    const unrealizedGainLoss = (currentPrice - purchasePrice) * quantity;
    const unrealizedGainLossPercent =
      ((currentPrice - purchasePrice) / purchasePrice) * 100;

    return {
      code: security.code,
      name: security.name,
      assetClass: 'Equity',
      currency: security.currency,
      weight: Math.random() * 30 + 5,
      purchaseDate: new Date(
        Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000,
      )
        .toISOString()
        .split('T')[0],
      currentPrice,
      purchasePrice,
      quantity,
      unrealizedGainLoss,
      unrealizedGainLossPercent,
      sector: security.sector,
    };
  });
};

export function PortfolioOverview() {
  const { useTestData } = useSettings();
  const [portfolios, setPortfolios] = useState<PortfolioSummary[]>([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState<string | null>(
    null,
  );
  const [activeView, setActiveView] = useState<'portfolios' | 'securities'>(
    'portfolios',
  );

  useEffect(() => {
    if (useTestData) {
      const mockPortfolios = TEST_PORTFOLIOS.map((portfolio) => {
        const holdings = generateMockHoldings(portfolio.code);
        const totalValue = holdings.reduce(
          (sum, holding) => sum + holding.currentPrice * holding.quantity,
          0,
        );
        const totalGainLoss = holdings.reduce(
          (sum, holding) => sum + holding.unrealizedGainLoss,
          0,
        );
        const totalGainLossPercent =
          (totalGainLoss / (totalValue - totalGainLoss)) * 100;

        return {
          code: portfolio.code,
          name: portfolio.name,
          totalValue,
          totalGainLoss,
          totalGainLossPercent,
          holdings,
        };
      });
      setPortfolios(mockPortfolios);
      if (mockPortfolios.length > 0) {
        setSelectedPortfolio(mockPortfolios[0].code);
      }
    }
  }, [useTestData]);

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return `${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`;
  };

  const formatPercent = (percent: number) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };

  const selectedPortfolioData = portfolios.find(
    (p) => p.code === selectedPortfolio,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Portfolio & Securities
          </h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive view of your investment holdings and performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          {useTestData && (
            <div className="flex items-center gap-2 px-3 py-1 bg-amber-100 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-700 rounded-lg">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              <span className="text-sm text-amber-700 dark:text-amber-300">
                Test Data Mode Active
              </span>
            </div>
          )}
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex items-center space-x-4">
        <Button
          variant={activeView === 'portfolios' ? 'default' : 'outline'}
          onClick={() => setActiveView('portfolios')}
        >
          Portfolios
        </Button>
        <Button
          variant={activeView === 'securities' ? 'default' : 'outline'}
          onClick={() => setActiveView('securities')}
        >
          Securities
        </Button>
      </div>

      {activeView === 'portfolios' && (
        <>
          {/* Portfolio Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {portfolios.slice(0, 4).map((portfolio) => (
              <Card
                key={portfolio.code}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedPortfolio === portfolio.code
                    ? 'ring-2 ring-primary'
                    : ''
                }`}
                onClick={() => setSelectedPortfolio(portfolio.code)}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">
                    {portfolio.name}
                  </CardTitle>
                  <div className="text-xs text-muted-foreground">
                    {portfolio.code}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-xl font-bold">
                      {formatCurrency(portfolio.totalValue)}
                    </div>
                    <div
                      className={`flex items-center text-sm ${
                        portfolio.totalGainLoss >= 0
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {portfolio.totalGainLoss >= 0 ? (
                        <TrendingUp className="h-4 w-4 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 mr-1" />
                      )}
                      {formatPercent(portfolio.totalGainLossPercent)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Detailed Portfolio View */}
          {selectedPortfolioData && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    {selectedPortfolioData.name} Details
                  </CardTitle>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="holdings" className="w-full">
                  <TabsList>
                    <TabsTrigger value="holdings">Holdings</TabsTrigger>
                    <TabsTrigger value="transactions">Transactions</TabsTrigger>
                    <TabsTrigger value="performance">Performance</TabsTrigger>
                    <TabsTrigger value="allocation">Allocation</TabsTrigger>
                  </TabsList>

                  <TabsContent value="holdings" className="mt-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Security</TableHead>
                          <TableHead>Asset Class</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Current Price</TableHead>
                          <TableHead>Market Value</TableHead>
                          <TableHead>Weight</TableHead>
                          <TableHead>Unrealized P&L</TableHead>
                          <TableHead>% Change</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedPortfolioData.holdings.map((holding) => (
                          <TableRow key={holding.code}>
                            <TableCell>
                              <div>
                                <div className="font-medium">
                                  {holding.code}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {holding.name}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {holding.assetClass}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {holding.quantity.toLocaleString()}
                            </TableCell>
                            <TableCell>
                              {formatCurrency(
                                holding.currentPrice,
                                holding.currency,
                              )}
                            </TableCell>
                            <TableCell>
                              {formatCurrency(
                                holding.currentPrice * holding.quantity,
                                holding.currency,
                              )}
                            </TableCell>
                            <TableCell>{holding.weight.toFixed(1)}%</TableCell>
                            <TableCell
                              className={
                                holding.unrealizedGainLoss >= 0
                                  ? 'text-green-600'
                                  : 'text-red-600'
                              }
                            >
                              {formatCurrency(
                                holding.unrealizedGainLoss,
                                holding.currency,
                              )}
                            </TableCell>
                            <TableCell
                              className={
                                holding.unrealizedGainLossPercent >= 0
                                  ? 'text-green-600'
                                  : 'text-red-600'
                              }
                            >
                              {formatPercent(holding.unrealizedGainLossPercent)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>

                  <TabsContent value="transactions" className="mt-4">
                    <div className="text-center text-muted-foreground py-8">
                      Transaction history will be implemented here
                    </div>
                  </TabsContent>

                  <TabsContent value="performance" className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Total Value
                              </p>
                              <p className="text-2xl font-bold">
                                {formatCurrency(
                                  selectedPortfolioData.totalValue,
                                )}
                              </p>
                            </div>
                            <DollarSign className="h-8 w-8 text-muted-foreground" />
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Total P&L
                              </p>
                              <p
                                className={`text-2xl font-bold ${
                                  selectedPortfolioData.totalGainLoss >= 0
                                    ? 'text-green-600'
                                    : 'text-red-600'
                                }`}
                              >
                                {formatCurrency(
                                  selectedPortfolioData.totalGainLoss,
                                )}
                              </p>
                            </div>
                            <Percent className="h-8 w-8 text-muted-foreground" />
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Holdings Count
                              </p>
                              <p className="text-2xl font-bold">
                                {selectedPortfolioData.holdings.length}
                              </p>
                            </div>
                            <BarChart3 className="h-8 w-8 text-muted-foreground" />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="allocation" className="mt-4">
                    <div className="text-center text-muted-foreground py-8">
                      <p className="text-lg font-medium mb-2">
                        Portfolio Allocation Analysis
                      </p>
                      <p className="text-sm">
                        This section will display interactive allocation charts
                        showing asset class distribution, sector weightings,
                        geographic exposure, and comparison to target
                        allocations.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {activeView === 'securities' && (
        <Card>
          <CardHeader>
            <CardTitle>All Securities</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Sector</TableHead>
                  <TableHead>Exchange</TableHead>
                  <TableHead>Currency</TableHead>
                  <TableHead>Current Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {TEST_SECURITIES.map((security) => {
                  const currentPrice = Math.random() * 200 + 50;
                  return (
                    <TableRow key={security.code}>
                      <TableCell className="font-medium">
                        {security.code}
                      </TableCell>
                      <TableCell>{security.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{security.sector}</Badge>
                      </TableCell>
                      <TableCell>{security.exchange}</TableCell>
                      <TableCell>{security.currency}</TableCell>
                      <TableCell>
                        {formatCurrency(currentPrice, security.currency)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
