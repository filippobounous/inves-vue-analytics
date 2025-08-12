import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Network, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { investmentApi, type ApiResponse } from "@/services/api";

interface ComparisonAnalysisProps {
  portfolioCodes: string[];
  securityCodes: string[];
}

type AnalysisType = "prices" | "returns" | "volatility";

interface AnalysisSeries {
  date?: string;
  [code: string]: number | string | undefined;
}

type ScatterDataPoint = {
  entity: string;
  x: number;
  y: number;
} & Partial<Record<AnalysisType, number>>;

export function ComparisonAnalysis({
  portfolioCodes,
  securityCodes,
}: ComparisonAnalysisProps) {
  const [data, setData] = useState<ScatterDataPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [xAxisType, setXAxisType] = useState<AnalysisType>("prices");
  const [yAxisType, setYAxisType] = useState<AnalysisType>("volatility");
  const [selectedEntities, setSelectedEntities] = useState<string[]>([]);

  const allEntities = useMemo(
    () => [...portfolioCodes, ...securityCodes],
    [portfolioCodes, securityCodes],
  );

  useEffect(() => {
    if (allEntities.length > 0) {
      setSelectedEntities(
        allEntities.slice(0, Math.min(10, allEntities.length)),
      ); // Limit to 10 entities
    }
  }, [allEntities]);

  const fetchAnalysisData = useCallback(
    async (
      analysisType: AnalysisType,
    ): Promise<ApiResponse<AnalysisSeries[]>> => {
      const params = {
        portfolio_codes: selectedEntities.filter((e) =>
          portfolioCodes.includes(e),
        ),
        security_codes: selectedEntities.filter((e) =>
          securityCodes.includes(e),
        ),
        local_only: true,
      };

      switch (analysisType) {
        case "prices":
          return investmentApi.getPrices(params);
        case "returns":
          return investmentApi.getReturns({
            ...params,
            use_ln_ret: false,
            win_size: 30,
          });
        case "volatility":
          return investmentApi.getRealisedVolatility({
            ...params,
            rv_model: "simple",
            rv_win_size: 30,
          });
        default:
          return { success: false, error: "Unknown analysis type" };
      }
    },
    [selectedEntities, portfolioCodes, securityCodes],
  );

  const combineAnalysisData = useCallback(
    (xData: AnalysisSeries[], yData: AnalysisSeries[]): ScatterDataPoint[] => {
      const combinedData: ScatterDataPoint[] = [];

      selectedEntities.forEach((entity) => {
        // Calculate average values for each entity
        const xValues = xData
          .map((item) => item[entity])
          .filter((v): v is number => typeof v === "number");
        const yValues = yData
          .map((item) => item[entity])
          .filter((v): v is number => typeof v === "number");

        if (xValues.length > 0 && yValues.length > 0) {
          const avgX =
            xValues.reduce((sum, val) => sum + val, 0) / xValues.length;
          const avgY =
            yValues.reduce((sum, val) => sum + val, 0) / yValues.length;

          const point: ScatterDataPoint = {
            entity,
            x: avgX,
            y: avgY,
          };
          point[xAxisType] = avgX;
          point[yAxisType] = avgY;
          combinedData.push(point);
        }
      });

      return combinedData;
    },
    [selectedEntities, xAxisType, yAxisType],
  );

  const fetchComparisonData = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const [xData, yData] = await Promise.all([
        fetchAnalysisData(xAxisType),
        fetchAnalysisData(yAxisType),
      ]);

      if (xData.success && yData.success && xData.data && yData.data) {
        // Ensure data is an array before passing to combineAnalysisData
        const xDataArray = Array.isArray(xData.data) ? xData.data : [];
        const yDataArray = Array.isArray(yData.data) ? yData.data : [];
        const combinedData = combineAnalysisData(xDataArray, yDataArray);
        setData(combinedData);
      } else {
        setError("Failed to fetch comparison data");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, [fetchAnalysisData, combineAnalysisData, xAxisType, yAxisType]);

  useEffect(() => {
    if (selectedEntities.length === 0) {
      setData([]);
      return;
    }

    fetchComparisonData();
  }, [selectedEntities, xAxisType, yAxisType, fetchComparisonData]);

  if (allEntities.length === 0) {
    return (
      <Card className="chart-container">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-5 w-5 text-primary" />
            Comparison Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">
            Select portfolios or securities to view comparison analysis
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="chart-container">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Network className="h-5 w-5 text-primary" />
          Comparison Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4 items-end">
          <div className="space-y-2">
            <Label>X-Axis</Label>
            <Select
              value={xAxisType}
              onValueChange={(value) => setXAxisType(value as AnalysisType)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="prices">Prices</SelectItem>
                <SelectItem value="returns">Returns</SelectItem>
                <SelectItem value="volatility">Volatility</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Y-Axis</Label>
            <Select
              value={yAxisType}
              onValueChange={(value) => setYAxisType(value as AnalysisType)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="prices">Prices</SelectItem>
                <SelectItem value="returns">Returns</SelectItem>
                <SelectItem value="volatility">Volatility</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={fetchComparisonData} disabled={loading}>
            Update
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-destructive">{error}</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart
              data={data}
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
              />
              <XAxis
                type="number"
                dataKey="x"
                name={xAxisType}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis
                type="number"
                dataKey="y"
                name={yAxisType}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                formatter={(value: number, name: string): [string, string] => [
                  value.toFixed(4),
                  name,
                ]}
                labelFormatter={(
                  label: string,
                  payload: Array<{ payload: ScatterDataPoint }>,
                ): string => {
                  if (payload && payload.length > 0) {
                    return `Entity: ${payload[0].payload.entity}`;
                  }
                  return label;
                }}
              />
              <Scatter
                dataKey="y"
                fill="hsl(var(--chart-1))"
                fillOpacity={0.7}
                strokeWidth={2}
                stroke="hsl(var(--chart-1))"
              />
            </ScatterChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
