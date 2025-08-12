import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, X, Search, Building, TrendingUp } from 'lucide-react';
import { investmentApi } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { useSettings } from '@/contexts/SettingsContext';
import {
  TEST_PORTFOLIOS,
  TEST_SECURITIES,
  type Portfolio,
  type Security,
} from '@/services/testData';

interface EntitySelectorProps {
  onSelectionChange: (portfolios: string[], securities: string[]) => void;
}

export function EntitySelector({ onSelectionChange }: EntitySelectorProps) {
  const [portfolioCodes, setPortfolioCodes] = useState<string[]>([]);
  const [securityCodes, setSecurityCodes] = useState<string[]>([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState<string>('');
  const [selectedSecurity, setSelectedSecurity] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [availablePortfolios, setAvailablePortfolios] = useState<Portfolio[]>(
    [],
  );
  const [availableSecurities, setAvailableSecurities] = useState<Security[]>(
    [],
  );
  const { toast } = useToast();
  const { useTestData } = useSettings();

  useEffect(() => {
    // Load available entities based on settings
    if (useTestData) {
      setAvailablePortfolios(TEST_PORTFOLIOS);
      setAvailableSecurities(TEST_SECURITIES);
    } else {
      // In a real scenario, you'd fetch these from the API
      setAvailablePortfolios([]);
      setAvailableSecurities([]);
    }
  }, [useTestData]);

  useEffect(() => {
    onSelectionChange(portfolioCodes, securityCodes);
  }, [portfolioCodes, securityCodes, onSelectionChange]);

  const addPortfolio = async () => {
    if (!selectedPortfolio) return;

    if (portfolioCodes.includes(selectedPortfolio)) {
      toast({
        title: 'Portfolio already added',
        description: `Portfolio ${selectedPortfolio} is already in your selection.`,
        variant: 'destructive',
      });
      return;
    }

    if (useTestData) {
      setPortfolioCodes([...portfolioCodes, selectedPortfolio]);
      setSelectedPortfolio('');
      toast({
        title: 'Portfolio added',
        description: `Portfolio ${selectedPortfolio} has been added to your selection.`,
      });
    } else {
      setLoading(true);
      const response = await investmentApi.getPortfolio(selectedPortfolio);
      setLoading(false);

      if (response.success) {
        setPortfolioCodes([...portfolioCodes, selectedPortfolio]);
        setSelectedPortfolio('');
        toast({
          title: 'Portfolio added',
          description: `Portfolio ${selectedPortfolio} has been added to your selection.`,
        });
      } else {
        toast({
          title: 'Portfolio not found',
          description:
            response.error ||
            `Portfolio ${selectedPortfolio} could not be found.`,
          variant: 'destructive',
        });
      }
    }
  };

  const addSecurity = async () => {
    if (!selectedSecurity) return;

    if (securityCodes.includes(selectedSecurity)) {
      toast({
        title: 'Security already added',
        description: `Security ${selectedSecurity} is already in your selection.`,
        variant: 'destructive',
      });
      return;
    }

    if (useTestData) {
      setSecurityCodes([...securityCodes, selectedSecurity]);
      setSelectedSecurity('');
      toast({
        title: 'Security added',
        description: `Security ${selectedSecurity} has been added to your selection.`,
      });
    } else {
      setLoading(true);
      const response = await investmentApi.getSecurity(selectedSecurity);
      setLoading(false);

      if (response.success) {
        setSecurityCodes([...securityCodes, selectedSecurity]);
        setSelectedSecurity('');
        toast({
          title: 'Security added',
          description: `Security ${selectedSecurity} has been added to your selection.`,
        });
      } else {
        toast({
          title: 'Security not found',
          description:
            response.error ||
            `Security ${selectedSecurity} could not be found.`,
          variant: 'destructive',
        });
      }
    }
  };

  const removePortfolio = (code: string) => {
    setPortfolioCodes(portfolioCodes.filter((c) => c !== code));
  };

  const removeSecurity = (code: string) => {
    setSecurityCodes(securityCodes.filter((c) => c !== code));
  };

  const getPortfolioDetails = (code: string) => {
    return availablePortfolios.find((p) => p.code === code);
  };

  const getSecurityDetails = (code: string) => {
    return availableSecurities.find((s) => s.code === code);
  };

  return (
    <Card className="glass border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5 text-muted-foreground" />
          Entity Selection
          {useTestData && (
            <Badge variant="secondary" className="text-xs">
              Test Mode
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="portfolios" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="portfolios" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Portfolios
            </TabsTrigger>
            <TabsTrigger value="securities" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Securities
            </TabsTrigger>
          </TabsList>

          <TabsContent value="portfolios" className="space-y-4">
            <div className="flex gap-2">
              <Select
                value={selectedPortfolio}
                onValueChange={setSelectedPortfolio}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select a portfolio..." />
                </SelectTrigger>
                <SelectContent>
                  {availablePortfolios
                    .filter((p) => !portfolioCodes.includes(p.code))
                    .map((portfolio) => (
                      <SelectItem key={portfolio.code} value={portfolio.code}>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {portfolio.code} - {portfolio.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {portfolio.description}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Button
                onClick={addPortfolio}
                disabled={loading || !selectedPortfolio}
                className="shrink-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              {portfolioCodes.map((code) => {
                const details = getPortfolioDetails(code);
                return (
                  <div
                    key={code}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {code}
                        </Badge>
                        <span className="font-medium">
                          {details?.name || code}
                        </span>
                      </div>
                      {details && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {details.description}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removePortfolio(code)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
              {portfolioCodes.length === 0 && (
                <p className="text-muted-foreground text-sm text-center py-4">
                  No portfolios selected
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="securities" className="space-y-4">
            <div className="flex gap-2">
              <Select
                value={selectedSecurity}
                onValueChange={setSelectedSecurity}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select a security..." />
                </SelectTrigger>
                <SelectContent>
                  {availableSecurities
                    .filter((s) => !securityCodes.includes(s.code))
                    .map((security) => (
                      <SelectItem key={security.code} value={security.code}>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {security.code} - {security.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {security.sector} • {security.exchange}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Button
                onClick={addSecurity}
                disabled={loading || !selectedSecurity}
                className="shrink-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              {securityCodes.map((code) => {
                const details = getSecurityDetails(code);
                return (
                  <div
                    key={code}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {code}
                        </Badge>
                        <span className="font-medium">
                          {details?.name || code}
                        </span>
                      </div>
                      {details && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {details.sector} • {details.exchange}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeSecurity(code)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
              {securityCodes.length === 0 && (
                <p className="text-muted-foreground text-sm text-center py-4">
                  No securities selected
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
