import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Building, TrendingUp } from 'lucide-react';
import { TEST_PORTFOLIOS, TEST_SECURITIES } from '@/services/testData';
import { useSettings } from '@/hooks/use-settings';

interface SelectedEntitiesListProps {
  selectedPortfolios: string[];
  selectedSecurities: string[];
  onRemovePortfolio: (code: string) => void;
  onRemoveSecurity: (code: string) => void;
}

export function SelectedEntitiesList({
  selectedPortfolios,
  selectedSecurities,
  onRemovePortfolio,
  onRemoveSecurity,
}: SelectedEntitiesListProps) {
  const { useTestData } = useSettings();

  const getPortfolioName = (code: string) => {
    if (useTestData) {
      const portfolio = TEST_PORTFOLIOS.find((p) => p.code === code);
      return portfolio?.name || code;
    }
    return code;
  };

  const getSecurityName = (code: string) => {
    if (useTestData) {
      const security = TEST_SECURITIES.find((s) => s.code === code);
      return security?.name || code;
    }
    return code;
  };

  const totalSelected = selectedPortfolios.length + selectedSecurities.length;

  if (totalSelected === 0) {
    return null;
  }

  return (
    <Card className="glass border-border/50">
      <CardHeader>
        <CardTitle className="text-sm font-medium">
          Selected Items ({totalSelected})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {selectedPortfolios.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Building className="h-3 w-3" />
              Portfolios ({selectedPortfolios.length})
            </div>
            <div className="space-y-1">
              {selectedPortfolios.map((code) => (
                <div
                  key={code}
                  className="flex items-center justify-between p-2 bg-muted/30 rounded-md"
                >
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {code}
                    </Badge>
                    <span className="text-sm">{getPortfolioName(code)}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemovePortfolio(code)}
                    className="h-6 w-6 p-0 hover:bg-destructive/20"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedSecurities.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              Securities ({selectedSecurities.length})
            </div>
            <div className="space-y-1">
              {selectedSecurities.map((code) => (
                <div
                  key={code}
                  className="flex items-center justify-between p-2 bg-muted/30 rounded-md"
                >
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {code}
                    </Badge>
                    <span className="text-sm">{getSecurityName(code)}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveSecurity(code)}
                    className="h-6 w-6 p-0 hover:bg-destructive/20"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
