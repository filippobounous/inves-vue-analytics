
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { EntitySelector } from "@/components/EntitySelector";
import { PriceChart } from "@/components/PriceChart";
import { ReturnsChart } from "@/components/ReturnsChart";
import { VolatilityChart } from "@/components/VolatilityChart";
import { CorrelationHeatmap } from "@/components/CorrelationHeatmap";
import { MetricsPanel } from "@/components/MetricsPanel";
import { VarPanel } from "@/components/VarPanel";
import { TrendingUp, BarChart3, Activity, Network, Target, AlertTriangle } from "lucide-react";

const Index = () => {
  const [selectedPortfolios, setSelectedPortfolios] = useState<string[]>([]);
  const [selectedSecurities, setSelectedSecurities] = useState<string[]>([]);

  const handleSelectionChange = (portfolios: string[], securities: string[]) => {
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
                <div className="h-8 w-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Investment Analytics
                  </h1>
                  <p className="text-xs text-muted-foreground">Professional Portfolio Analysis</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium">
                  {selectedPortfolios.length + selectedSecurities.length} Selected
                </p>
                <p className="text-xs text-muted-foreground">
                  {selectedPortfolios.length} Portfolios • {selectedSecurities.length} Securities
                </p>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Entity Selection */}
        <EntitySelector onSelectionChange={handleSelectionChange} />

        {/* Main Analytics Dashboard */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="prices" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Prices & Returns
            </TabsTrigger>
            <TabsTrigger value="volatility" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Volatility
            </TabsTrigger>
            <TabsTrigger value="correlations" className="flex items-center gap-2">
              <Network className="h-4 w-4" />
              Correlations
            </TabsTrigger>
            <TabsTrigger value="metrics" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Risk Metrics
            </TabsTrigger>
            <TabsTrigger value="var" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              VaR Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PriceChart 
                portfolioCodes={selectedPortfolios} 
                securityCodes={selectedSecurities} 
              />
              <ReturnsChart 
                portfolioCodes={selectedPortfolios} 
                securityCodes={selectedSecurities} 
              />
            </div>
            
            {(selectedPortfolios.length > 0 || selectedSecurities.length > 0) && (
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="text-center text-primary">Quick Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div className="p-4 rounded-lg bg-card/50">
                      <h3 className="font-semibold text-chart-1">Price Analysis</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Historical price movements and trends for your selected assets
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-card/50">
                      <h3 className="font-semibold text-chart-2">Return Distribution</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Daily and rolling return patterns with configurable windows
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-card/50">
                      <h3 className="font-semibold text-chart-3">Risk Assessment</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Comprehensive risk metrics including VaR and volatility
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="prices" className="space-y-6">
            <PriceChart 
              portfolioCodes={selectedPortfolios} 
              securityCodes={selectedSecurities} 
            />
            <ReturnsChart 
              portfolioCodes={selectedPortfolios} 
              securityCodes={selectedSecurities} 
            />
          </TabsContent>

          <TabsContent value="volatility">
            <VolatilityChart 
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

        {/* Footer */}
        <Card className="glass mt-8">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">
              Investment Analytics Dashboard • Connected to FastAPI Backend • 
              <span className="text-primary ml-1">Real-time Financial Data Analysis</span>
            </p>
            <div className="flex justify-center space-x-4 mt-2 text-xs text-muted-foreground">
              <span>API: {import.meta.env.VITE_INVESTMENT_API_URL || 'http://localhost:8000'}</span>
              <span>•</span>
              <span>Recharts Visualization</span>
              <span>•</span>
              <span>Professional Risk Analytics</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
