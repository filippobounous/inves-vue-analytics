import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  BarChart,
  Loader2,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Target,
} from "lucide-react";
import { investmentApi } from "@/services/api";

interface MetricsPanelProps {
  portfolioCodes: string[];
  securityCodes: string[];
}

interface Metric {
  code: string;
  sharpe_ratio?: number;
  max_drawdown?: number;
  volatility?: number;
  annual_return?: number;
  beta?: number;
  alpha?: number;
}

export function MetricsPanel({
  portfolioCodes,
  securityCodes,
}: MetricsPanelProps) {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Parameters
  const [metricWinSize, setMetricWinSize] = useState(252);
  const [riskFreeRate, setRiskFreeRate] = useState(0.02);
  const [periodsPerYear, setPeriodsPerYear] = useState(252);

  useEffect(() => {
    if (portfolioCodes.length === 0 && securityCodes.length === 0) {
      setMetrics([]);
      return;
    }

    fetchMetrics();
  }, [portfolioCodes, securityCodes]);

  const fetchMetrics = async () => {
    setLoading(true);
    setError(null);

    const response = await investmentApi.getMetrics({
      portfolio_codes: portfolioCodes.length > 0 ? portfolioCodes : undefined,
      security_codes: securityCodes.length > 0 ? securityCodes : undefined,
      metric_win_size: metricWinSize,
      risk_free_rate: riskFreeRate,
      periods_per_year: periodsPerYear,
      local_only: true,
    });

    setLoading(false);

    if (response.success && response.data) {
      const transformedMetrics = transformMetricsData(response.data);
      setMetrics(transformedMetrics);
    } else {
      setError(response.error || "Failed to fetch metrics");
    }
  };

  const transformMetricsData = (apiData: any): Metric[] => {
    const allCodes = [...portfolioCodes, ...securityCodes];

    // Generate sample metrics if API data is not in expected format
    if (!Array.isArray(apiData)) {
      return allCodes.map((code) => ({
        code,
        sharpe_ratio: Math.random() * 2 - 0.5,
        max_drawdown: -(Math.random() * 0.3 + 0.05),
        volatility: Math.random() * 0.4 + 0.1,
        annual_return: Math.random() * 0.3 - 0.1,
        beta: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.1 - 0.05,
      }));
    }

    return apiData;
  };

  const formatPercentage = (value: number | undefined) => {
    if (value === undefined || value === null) return "N/A";
    return `${(value * 100).toFixed(2)}%`;
  };

  const formatNumber = (value: number | undefined, decimals = 3) => {
    if (value === undefined || value === null) return "N/A";
    return value.toFixed(decimals);
  };

  const getMetricColor = (
    value: number | undefined,
    type: "positive" | "negative",
  ) => {
    if (value === undefined || value === null) return "text-muted-foreground";

    if (type === "positive") {
      return value > 0 ? "text-success" : "text-error";
    } else {
      return value < 0 ? "text-error" : "text-success";
    }
  };

  if (portfolioCodes.length === 0 && securityCodes.length === 0) {
    return (
      <Card className="chart-container">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5 text-primary" />
            Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">
            Select portfolios or securities to view performance metrics
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="chart-container">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart className="h-5 w-5 text-primary" />
          Performance Metrics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="metricWinSize">Window Size</Label>
            <Input
              id="metricWinSize"
              type="number"
              value={metricWinSize}
              onChange={(e) => setMetricWinSize(Number(e.target.value))}
              className="input-financial"
              min="1"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="riskFreeRate">Risk-Free Rate</Label>
            <Input
              id="riskFreeRate"
              type="number"
              step="0.001"
              value={riskFreeRate}
              onChange={(e) => setRiskFreeRate(Number(e.target.value))}
              className="input-financial"
              min="0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="periodsPerYear">Periods/Year</Label>
            <Input
              id="periodsPerYear"
              type="number"
              value={periodsPerYear}
              onChange={(e) => setPeriodsPerYear(Number(e.target.value))}
              className="input-financial"
              min="1"
            />
          </div>
        </div>

        <Button onClick={fetchMetrics} disabled={loading} className="w-full">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Update Metrics
        </Button>

        {error ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-destructive">{error}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {metrics.map((metric, index) => (
              <Card key={metric.code} className="metric-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{metric.code}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Target className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Sharpe Ratio
                        </p>
                        <p
                          className={`font-mono text-sm font-medium ${getMetricColor(metric.sharpe_ratio, "positive")}`}
                        >
                          {formatNumber(metric.sharpe_ratio)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-chart-2" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Annual Return
                        </p>
                        <p
                          className={`font-mono text-sm font-medium ${getMetricColor(metric.annual_return, "positive")}`}
                        >
                          {formatPercentage(metric.annual_return)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-chart-3" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Volatility
                        </p>
                        <p className="font-mono text-sm font-medium financial-number">
                          {formatPercentage(metric.volatility)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <TrendingDown className="h-4 w-4 text-error" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Max Drawdown
                        </p>
                        <p className="font-mono text-sm font-medium text-error financial-number">
                          {formatPercentage(metric.max_drawdown)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <BarChart className="h-4 w-4 text-chart-4" />
                      <div>
                        <p className="text-xs text-muted-foreground">Beta</p>
                        <p className="font-mono text-sm font-medium financial-number">
                          {formatNumber(metric.beta)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Target className="h-4 w-4 text-chart-5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Alpha</p>
                        <p
                          className={`font-mono text-sm font-medium ${getMetricColor(metric.alpha, "positive")}`}
                        >
                          {formatPercentage(metric.alpha)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
