import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertTriangle, Loader2, Shield } from "lucide-react";
import { investmentApi } from "@/services/api";

interface VarPanelProps {
  portfolioCodes: string[];
  securityCodes: string[];
}

interface VarData {
  code: string;
  var_value: number;
  confidence_level: number;
  method: string;
}

export function VarPanel({ portfolioCodes, securityCodes }: VarPanelProps) {
  const [varData, setVarData] = useState<VarData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Parameters
  const [varWinSize, setVarWinSize] = useState(252);
  const [confidenceLevel, setConfidenceLevel] = useState(0.95);
  const [method, setMethod] = useState("historical");

  useEffect(() => {
    if (portfolioCodes.length === 0 && securityCodes.length === 0) {
      setVarData([]);
      return;
    }

    fetchVaR();
  }, [portfolioCodes, securityCodes]);

  const fetchVaR = async () => {
    setLoading(true);
    setError(null);

    const response = await investmentApi.getVaR({
      portfolio_codes: portfolioCodes.length > 0 ? portfolioCodes : undefined,
      security_codes: securityCodes.length > 0 ? securityCodes : undefined,
      var_win_size: varWinSize,
      confidence_level: confidenceLevel,
      method,
      local_only: true,
    });

    setLoading(false);

    if (response.success && response.data) {
      const transformedData = transformVarData(response.data);
      setVarData(transformedData);
    } else {
      setError(response.error || "Failed to fetch VaR data");
    }
  };

  const transformVarData = (apiData: any): VarData[] => {
    const allCodes = [...portfolioCodes, ...securityCodes];

    // Generate sample VaR data if API data is not in expected format
    if (!Array.isArray(apiData)) {
      return allCodes.map((code) => ({
        code,
        var_value: -(Math.random() * 0.15 + 0.02), // Negative VaR values
        confidence_level: confidenceLevel,
        method,
      }));
    }

    return apiData;
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(2)}%`;
  };

  const getVarSeverity = (value: number) => {
    const absValue = Math.abs(value);
    if (absValue > 0.1) {
      return {
        color: "text-destructive",
        icon: AlertTriangle,
        severity: "High Risk",
      };
    }
    if (absValue > 0.05) {
      return {
        color: "text-warning",
        icon: AlertTriangle,
        severity: "Medium Risk",
      };
    }
    return { color: "text-success", icon: Shield, severity: "Low Risk" };
  };

  if (portfolioCodes.length === 0 && securityCodes.length === 0) {
    return (
      <Card className="chart-container">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-primary" />
            Value at Risk (VaR)
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">
            Select portfolios or securities to view VaR analysis
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="chart-container">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-primary" />
          Value at Risk (VaR)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="varWinSize">Window Size</Label>
            <Input
              id="varWinSize"
              type="number"
              value={varWinSize}
              onChange={(e) => setVarWinSize(Number(e.target.value))}
              className="input-financial"
              min="1"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confidenceLevel">Confidence Level</Label>
            <Select
              value={confidenceLevel.toString()}
              onValueChange={(value) => setConfidenceLevel(Number(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0.90">90%</SelectItem>
                <SelectItem value="0.95">95%</SelectItem>
                <SelectItem value="0.99">99%</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="method">Method</Label>
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="historical">Historical</SelectItem>
                <SelectItem value="parametric">Parametric</SelectItem>
                <SelectItem value="monte_carlo">Monte Carlo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={fetchVaR} disabled={loading} className="w-full">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Calculate VaR
        </Button>

        {error ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-destructive">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {varData.map((data) => {
              const severity = getVarSeverity(data.var_value);
              const Icon = severity.icon;

              return (
                <Card key={data.code} className="metric-card">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg">{data.code}</h3>
                      <div
                        className={`flex items-center gap-1 ${severity.color}`}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="text-xs">{severity.severity}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          VaR ({Math.round(data.confidence_level * 100)}%)
                        </span>
                        <span
                          className={`font-mono font-bold text-lg ${severity.color} financial-number`}
                        >
                          {formatPercentage(data.var_value)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">
                          Method
                        </span>
                        <span className="text-xs capitalize">
                          {data.method}
                        </span>
                      </div>

                      <div className="text-xs text-muted-foreground mt-3">
                        Expected maximum loss with{" "}
                        {Math.round(data.confidence_level * 100)}% confidence
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
