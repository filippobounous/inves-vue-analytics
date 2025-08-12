
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { EntitySelector } from '@/components/EntitySelector';
import { MultiSeriesChart } from '@/components/MultiSeriesChart';
import { ComparisonAnalysis } from '@/components/ComparisonAnalysis';
import { CorrelationHeatmap } from '@/components/CorrelationHeatmap';
import { MetricsPanel } from '@/components/MetricsPanel';
import { VarPanel } from '@/components/VarPanel';
import {
  TrendingUp,
  Network,
  Activity,
  Target,
  AlertTriangle,
  BarChart3,
  Settings,
} from 'lucide-react';

const Index = () => {
  const [selectedPortfolios, setSelectedPortfolios] = useState<string[]>([]);
  const [selectedSecurities, setSelectedSecurities] = useState<string[]>([]);

  const handleSelectionChange = (
    portfolios: string[],
    securities: string[],
  ) => {
    setSelectedPortfolios(portfolios);
    setSelectedSecurities(securities);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-muted rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">
                    Murgenere
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    Multi-Series Investment Analytics
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium">
                  {selectedPortfolios.length + selectedSecurities.length}{' '}
                  Selected
                </p>
                <p className="text-xs text-muted-foreground">
                  {selectedPortfolios.length} Portfolios •{' '}
                  {selectedSecurities.length} Securities
                </p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/settings" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Entity Selection */}
        <EntitySelector onSelectionChange={handleSelectionChange} />

        {/* Main Analytics Dashboard */}
        <Tabs defaultValue="multiseries" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger
              value="multiseries"
              className="flex items-center gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              Multi-Series
            </TabsTrigger>
            <TabsTrigger value="comparison" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Comparison
            </TabsTrigger>
            <TabsTrigger
              value="correlations"
              className="flex items-center gap-2"
            >
              <Network className="h-4 w-4" />
              Correlations
            </TabsTrigger>
            <TabsTrigger value="metrics" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Risk & Performance Metrics
            </TabsTrigger>
            <TabsTrigger value="var" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              VaR Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="multiseries" className="space-y-6">
            <MultiSeriesChart
              portfolioCodes={selectedPortfolios}
              securityCodes={selectedSecurities}
            />
          </TabsContent>

          <TabsContent value="comparison">
            <ComparisonAnalysis
              portfolioCodes={selectedPortfolios}
              securityCodes={selectedSecurities}
            />
          </TabsContent>

          <TabsContent value="correlations">
            <CorrelationHeatmap
              portfolioCodes={selectedPortfolios}
              securityCodes={selectedSecurities}
            />
          </TabsContent>

          <TabsContent value="metrics">
            <MetricsPanel
              portfolioCodes={selectedPortfolios}
              securityCodes={selectedSecurities}
            />
          </TabsContent>

          <TabsContent value="var">
            <VarPanel
              portfolioCodes={selectedPortfolios}
              securityCodes={selectedSecurities}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
