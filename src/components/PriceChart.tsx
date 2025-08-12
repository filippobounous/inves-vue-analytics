import { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { TrendingUp, Loader2 } from 'lucide-react';
import { investmentApi } from '@/services/api';

interface PriceChartProps {
  portfolioCodes: string[];
  securityCodes: string[];
}

export function PriceChart({ portfolioCodes, securityCodes }: PriceChartProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const transformPriceData = useCallback(
    (apiData: any) => {
      // This is a placeholder transformation - adjust based on actual API response structure
      if (!apiData || !Array.isArray(apiData)) {
        return [];
      }

      return apiData.map((item: any, index: number) => ({
        date: item.date || `Day ${index + 1}`,
        ...portfolioCodes.reduce(
          (acc, code) => ({
            ...acc,
            [code]: item[code] || Math.random() * 1000 + 100,
          }),
          {},
        ),
        ...securityCodes.reduce(
          (acc, code) => ({
            ...acc,
            [code]: item[code] || Math.random() * 200 + 50,
          }),
          {},
        ),
      }));
    },
    [portfolioCodes, securityCodes],
  );

  const fetchPrices = useCallback(async () => {
    if (portfolioCodes.length === 0 && securityCodes.length === 0) {
      setData([]);
      return;
    }

    setLoading(true);
    setError(null);

    const response = await investmentApi.getPrices({
      portfolio_codes: portfolioCodes.length > 0 ? portfolioCodes : undefined,
      security_codes: securityCodes.length > 0 ? securityCodes : undefined,
      local_only: true,
      intraday: false,
    });

    setLoading(false);

    if (response.success && response.data) {
      // Transform API response to chart data format
      const chartData = transformPriceData(response.data);
      setData(chartData);
    } else {
      setError(response.error || 'Failed to fetch price data');
    }
  }, [portfolioCodes, securityCodes, transformPriceData]);

  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

  const getLineColor = (index: number) => {
    const colors = [
      'hsl(var(--chart-1))',
      'hsl(var(--chart-2))',
      'hsl(var(--chart-3))',
      'hsl(var(--chart-4))',
      'hsl(var(--chart-5))',
      'hsl(var(--chart-6))',
    ];
    return colors[index % colors.length];
  };

  if (portfolioCodes.length === 0 && securityCodes.length === 0) {
    return (
      <Card className="chart-container">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Price History
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">
            Select portfolios or securities to view price history
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="chart-container">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Price History
        </CardTitle>
      </CardHeader>
      <CardContent>
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
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
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
