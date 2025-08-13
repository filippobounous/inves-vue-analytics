
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EntitySelector } from '@/components/EntitySelector';
import { ComparisonAnalysis } from '@/components/ComparisonAnalysis';
import { BarChart3, Filter, Download } from 'lucide-react';

export function EntityComparison() {
  const [selectedPortfolios, setSelectedPortfolios] = useState<string[]>([]);
  const [selectedSecurities, setSelectedSecurities] = useState<string[]>([]);

  const handleSelectionChange = (portfolios: string[], securities: string[]) => {
    setSelectedPortfolios(portfolios);
    setSelectedSecurities(securities);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Entity Comparison & Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Side-by-side comparison and advanced analytics for portfolios and securities
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Selection Summary */}
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <BarChart3 className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">
                  {selectedPortfolios.length + selectedSecurities.length} entities selected for comparison
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedPortfolios.length} portfolios • {selectedSecurities.length} securities
                </p>
              </div>
            </div>
            {(selectedPortfolios.length > 0 || selectedSecurities.length > 0) && (
              <Badge variant="secondary">
                Ready for Analysis
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Entity Selection */}
      <EntitySelector onSelectionChange={handleSelectionChange} />

      {/* Comparison Analysis */}
      <ComparisonAnalysis 
        portfolioCodes={selectedPortfolios}
        securityCodes={selectedSecurities}
      />
    </div>
  );
}
