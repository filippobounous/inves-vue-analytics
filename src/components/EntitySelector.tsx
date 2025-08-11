
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, X, Search, Building, TrendingUp } from "lucide-react";
import { investmentApi } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface EntitySelectorProps {
  onSelectionChange: (portfolios: string[], securities: string[]) => void;
}

export function EntitySelector({ onSelectionChange }: EntitySelectorProps) {
  const [portfolioCodes, setPortfolioCodes] = useState<string[]>([]);
  const [securityCodes, setSecurityCodes] = useState<string[]>([]);
  const [portfolioInput, setPortfolioInput] = useState("");
  const [securityInput, setSecurityInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    onSelectionChange(portfolioCodes, securityCodes);
  }, [portfolioCodes, securityCodes, onSelectionChange]);

  const addPortfolio = async () => {
    if (!portfolioInput.trim()) return;
    
    const code = portfolioInput.trim().toUpperCase();
    if (portfolioCodes.includes(code)) {
      toast({
        title: "Portfolio already added",
        description: `Portfolio ${code} is already in your selection.`,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const response = await investmentApi.getPortfolio(code);
    setLoading(false);

    if (response.success) {
      setPortfolioCodes([...portfolioCodes, code]);
      setPortfolioInput("");
      toast({
        title: "Portfolio added",
        description: `Portfolio ${code} has been added to your selection.`,
      });
    } else {
      toast({
        title: "Portfolio not found",
        description: response.error || `Portfolio ${code} could not be found.`,
        variant: "destructive",
      });
    }
  };

  const addSecurity = async () => {
    if (!securityInput.trim()) return;
    
    const code = securityInput.trim().toUpperCase();
    if (securityCodes.includes(code)) {
      toast({
        title: "Security already added",
        description: `Security ${code} is already in your selection.`,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const response = await investmentApi.getSecurity(code);
    setLoading(false);

    if (response.success) {
      setSecurityCodes([...securityCodes, code]);
      setSecurityInput("");
      toast({
        title: "Security added",
        description: `Security ${code} has been added to your selection.`,
      });
    } else {
      toast({
        title: "Security not found",
        description: response.error || `Security ${code} could not be found.`,
        variant: "destructive",
      });
    }
  };

  const removePortfolio = (code: string) => {
    setPortfolioCodes(portfolioCodes.filter(c => c !== code));
  };

  const removeSecurity = (code: string) => {
    setSecurityCodes(securityCodes.filter(c => c !== code));
  };

  return (
    <Card className="glass border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5 text-primary" />
          Entity Selection
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
              <Input
                placeholder="Enter portfolio code (e.g., PF001)"
                value={portfolioInput}
                onChange={(e) => setPortfolioInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addPortfolio()}
                className="input-financial"
              />
              <Button 
                onClick={addPortfolio} 
                disabled={loading || !portfolioInput.trim()}
                className="shrink-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {portfolioCodes.map((code) => (
                <Badge key={code} variant="secondary" className="flex items-center gap-1">
                  {code}
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-destructive" 
                    onClick={() => removePortfolio(code)}
                  />
                </Badge>
              ))}
              {portfolioCodes.length === 0 && (
                <p className="text-muted-foreground text-sm">No portfolios selected</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="securities" className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter security code (e.g., AAPL)"
                value={securityInput}
                onChange={(e) => setSecurityInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addSecurity()}
                className="input-financial"
              />
              <Button 
                onClick={addSecurity} 
                disabled={loading || !securityInput.trim()}
                className="shrink-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {securityCodes.map((code) => (
                <Badge key={code} variant="secondary" className="flex items-center gap-1">
                  {code}
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-destructive" 
                    onClick={() => removeSecurity(code)}
                  />
                </Badge>
              ))}
              {securityCodes.length === 0 && (
                <p className="text-muted-foreground text-sm">No securities selected</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
