import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Search, Building, TrendingUp } from 'lucide-react';
import { investmentApi } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { useSettings } from '@/hooks/use-settings';
import { SelectedEntitiesList } from './SelectedEntitiesList';
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

  return (
    <div className="space-y-4">
      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-muted-foreground" />
            Entity Selection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="portfolios" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="portfolios"
                className="flex items-center gap-2"
              >
                <Building className="h-4 w-4" />
                Portfolios
              </TabsTrigger>
              <TabsTrigger
                value="securities"
                className="flex items-center gap-2"
              >
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
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <SelectedEntitiesList
        selectedPortfolios={portfolioCodes}
        selectedSecurities={securityCodes}
        onRemovePortfolio={removePortfolio}
        onRemoveSecurity={removeSecurity}
      />
    </div>
  );
}
