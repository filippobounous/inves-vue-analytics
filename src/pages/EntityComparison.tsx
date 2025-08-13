
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EntitySelector } from '@/components/EntitySelector';
import { ComparisonAnalysis } from '@/components/ComparisonAnalysis';
import { BarChart3, Download } from 'lucide-react';

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
      </div>

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
