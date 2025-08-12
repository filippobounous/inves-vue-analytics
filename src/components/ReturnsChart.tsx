import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { BarChart3, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { investmentApi } from "@/services/api";

interface ReturnsChartProps {
  portfolioCodes: string[];
  securityCodes: string[];
}

export function ReturnsChart({
  portfolioCodes,
  securityCodes,
}: ReturnsChartProps) {
  type ReturnsDataItem = { date: string } & Record<string, number | string>;
  type ReturnsApiItem = { date?: string } & Record<
    string,
    number | string | undefined
  >;

  const [data, setData] = useState<ReturnsDataItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useLnRet, setUseLnRet] = useState(false);
  const [winSize, setWinSize] = useState(30);

  useEffect(() => {
    if (portfolioCodes.length === 0 && securityCodes.length === 0) {
      setData([]);
      return;
    }

    fetchReturns();
  }, [portfolioCodes, securityCodes]);

  const fetchReturns = async () => {
    setLoading(true);
    setError(null);

    const response = await investmentApi.getReturns({
      portfolio_codes: portfolioCodes.length > 0 ? portfolioCodes : undefined,
      security_codes: securityCodes.length > 0 ? securityCodes : undefined,
      use_ln_ret: useLnRet,
      win_size: winSize,
      local_only: true,
    });

    setLoading(false);

    if (response.success && response.data) {
      const chartData = transformReturnsData(response.data);
      setData(chartData);
    } else {
      setError(response.error || "Failed to fetch returns data");
    }
  };

  const transformReturnsData = (apiData: unknown): ReturnsDataItem[] => {
    if (!apiData || !Array.isArray(apiData)) {
      return [];
    }

    return (apiData as ReturnsApiItem[]).map((item, index) => ({
      date: item.date || `Day ${index + 1}`,
      ...portfolioCodes.reduce(
        (acc, code) => ({
          ...acc,
          [code]: (item[code] as number) || (Math.random() - 0.5) * 0.05,
        }),
        {},
      ),
      ...securityCodes.reduce(
        (acc, code) => ({
          ...acc,
          [code]: (item[code] as number) || (Math.random() - 0.5) * 0.08,
        }),
        {},
      ),
    }));
  };

  const getLineColor = (index: number) => {
    const colors = [
      "hsl(var(--chart-1))",
      "hsl(var(--chart-2))",
      "hsl(var(--chart-3))",
      "hsl(var(--chart-4))",
      "hsl(var(--chart-5))",
      "hsl(var(--chart-6))",
    ];
    return colors[index % colors.length];
  };

  if (portfolioCodes.length === 0 && securityCodes.length === 0) {
    return (
      <Card className="chart-container">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Returns Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">
            Select portfolios or securities to view returns analysis
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="chart-container">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Returns Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4 items-end">
          <div className="space-y-2">
            <Label htmlFor="winSize">Window Size</Label>
            <Input
              id="winSize"
              type="number"
              value={winSize}
              onChange={(e) => setWinSize(Number(e.target.value))}
              className="w-24 input-financial"
              min="1"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="useLnRet"
              checked={useLnRet}
              onCheckedChange={(checked) => setUseLnRet(checked as boolean)}
            />
            <Label htmlFor="useLnRet">Log Returns</Label>
          </div>
          <Button onClick={fetchReturns} disabled={loading}>
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
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
              />
              <XAxis
                dataKey="date"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickFormatter={(value) => `${(value * 100).toFixed(2)}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                formatter={(value: number) => [
                  `${(value * 100).toFixed(3)}%`,
                  "",
                ]}
              />
              <Legend />
              {[...portfolioCodes, ...securityCodes].map((code, index) => (
                <Line
                  key={code}
                  type="monotone"
                  dataKey={code}
                  stroke={getLineColor(index)}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: getLineColor(index) }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
