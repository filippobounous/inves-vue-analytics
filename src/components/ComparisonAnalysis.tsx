import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { investmentApi } from '@/services/api';
import { useSettings } from '@/hooks/use-settings';
import {
  generateMockPriceData,
  generateMockReturnsData,
  generateMockVolatilityData,
} from '@/services/testData';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Plus, Trash2 } from 'lucide-react';

interface ComparisonAnalysisProps {
  portfolioCodes: string[];
  securityCodes: string[];
}

type Metric = 'price' | 'return' | 'volatility';
type Normalize = 'none' | 'index' | 'zscore';

interface SeriesConfig {
  id: string;
  code: string;
  metric: Metric;
  axis: 'left' | 'right';
  normalize: Normalize;
  color: string;
  data: { date: string; value: number }[];
}

const colors = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export function ComparisonAnalysis({
  portfolioCodes,
  securityCodes,
}: ComparisonAnalysisProps) {
  const { useTestData, defaultDateRange } = useSettings();
  const availableCodes = useMemo(
    () => [...portfolioCodes, ...securityCodes],
    [portfolioCodes, securityCodes],
  );
  const [seriesConfigs, setSeriesConfigs] = useState<SeriesConfig[]>([]);
  const [newCode, setNewCode] = useState('');
  const [newMetric, setNewMetric] = useState<Metric>('price');
  const [newNormalize, setNewNormalize] = useState<Normalize>('none');

  useEffect(() => {
    if (availableCodes.length > 0 && !newCode) {
      setNewCode(availableCodes[0]);
    }
  }, [availableCodes, newCode]);

  const fetchSeriesData = async (
    code: string,
    metric: Metric,
  ): Promise<{ date: string; value: number }[]> => {
    const params = {
      portfolio_codes: portfolioCodes.includes(code) ? [code] : undefined,
      security_codes: securityCodes.includes(code) ? [code] : undefined,
    };

    if (useTestData) {
      switch (metric) {
        case 'price':
          return generateMockPriceData(code, defaultDateRange).map(
            (d: any) => ({
              date: d.date,
              value: d.value,
            }),
          );
        case 'return':
          return generateMockReturnsData(code, defaultDateRange).map(
            (d: any) => ({
              date: d.date,
              value: d.value,
            }),
          );
        case 'volatility':
          return generateMockVolatilityData(code, defaultDateRange).map(
            (d: any) => ({
              date: d.date,
              value: d.value,
            }),
          );
      }
    } else {
      switch (metric) {
        case 'price': {
          const res = await investmentApi.getPrices(params);
          return (res.data || []).map((d: any) => ({
            date: d.date,
            value: d[code],
          }));
        }
        case 'return': {
          const res = await investmentApi.getReturns(params);
          return (res.data || []).map((d: any) => ({
            date: d.date,
            value: d[code],
          }));
        }
        case 'volatility': {
          const res = await investmentApi.getRealisedVolatility(params);
          return (res.data || []).map((d: any) => ({
            date: d.date,
            value: d[code],
          }));
        }
      }
    }
    return [];
  };

  const normalizeData = (
    data: { date: string; value: number }[],
    mode: Normalize,
  ) => {
    if (mode === 'index') {
      const base = data[0]?.value || 1;
      return data.map((d) => ({ ...d, value: (d.value / base) * 100 }));
    }
    if (mode === 'zscore') {
      const mean =
        data.reduce((sum, d) => sum + d.value, 0) / (data.length || 1);
      const std =
        Math.sqrt(
          data.reduce((sum, d) => sum + Math.pow(d.value - mean, 2), 0) /
            (data.length || 1),
        ) || 1;
      return data.map((d) => ({ ...d, value: (d.value - mean) / std }));
    }
    return data;
  };

  const refreshSeries = async (
    config: SeriesConfig,
    metric: Metric = config.metric,
    normalize: Normalize = config.normalize,
  ) => {
    const raw = await fetchSeriesData(config.code, metric);
    const data = normalizeData(raw, normalize);
    return { ...config, metric, normalize, data } as SeriesConfig;
  };

  const addSeries = async () => {
    if (!newCode) return;
    const id = `${newCode}-${newMetric}`;
    if (seriesConfigs.some((s) => s.id === id)) return;
    const raw = await fetchSeriesData(newCode, newMetric);
    const data = normalizeData(raw, newNormalize);
    const axis =
      seriesConfigs.length > 0 && seriesConfigs[0].metric !== newMetric
        ? 'right'
        : 'left';
    const color = colors[seriesConfigs.length % colors.length];
    setSeriesConfigs([
      ...seriesConfigs,
      {
        id,
        code: newCode,
        metric: newMetric,
        axis,
        normalize: newNormalize,
        color,
        data,
      },
    ]);
  };

  const removeSeries = (id: string) => {
    setSeriesConfigs(seriesConfigs.filter((s) => s.id !== id));
  };

  const handleMetricChange = async (id: string, metric: Metric) => {
    const existing = seriesConfigs.find((s) => s.id === id);
    if (!existing) return;
    const updated = await refreshSeries(existing, metric, existing.normalize);
    updated.axis =
      seriesConfigs[0]?.metric && seriesConfigs[0].metric !== metric
        ? 'right'
        : 'left';
    setSeriesConfigs((prev) => prev.map((s) => (s.id === id ? updated : s)));
  };

  const handleNormalizeChange = async (id: string, mode: Normalize) => {
    const existing = seriesConfigs.find((s) => s.id === id);
    if (!existing) return;
    const updated = await refreshSeries(existing, existing.metric, mode);
    setSeriesConfigs((prev) => prev.map((s) => (s.id === id ? updated : s)));
  };

  const handleAxisChange = (id: string, axis: 'left' | 'right') => {
    setSeriesConfigs((prev) =>
      prev.map((s) => (s.id === id ? { ...s, axis } : s)),
    );
  };

  const mergedData = () => {
    const map = new Map<string, any>();
    seriesConfigs.forEach((series) => {
      series.data.forEach((point) => {
        if (!map.has(point.date)) {
          map.set(point.date, { date: point.date });
        }
        map.get(point.date)[series.id] = point.value;
      });
    });
    return Array.from(map.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
  };

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle>Comparison Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-end gap-2">
          <div className="space-y-1">
            <Select value={newCode} onValueChange={setNewCode}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Entity" />
              </SelectTrigger>
              <SelectContent>
                {availableCodes.map((code) => (
                  <SelectItem key={code} value={code}>
                    {code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Select
              value={newMetric}
              onValueChange={(v) => setNewMetric(v as Metric)}
            >
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Metric" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="return">Return</SelectItem>
                <SelectItem value="volatility">Volatility</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Select
              value={newNormalize}
              onValueChange={(v) => setNewNormalize(v as Normalize)}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Normalize" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="index">Index 100</SelectItem>
                <SelectItem value="zscore">Z-Score</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={addSeries} size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {seriesConfigs.map((series) => (
          <div key={series.id} className="flex flex-wrap items-end gap-2">
            <div className="text-sm font-medium w-24">{series.code}</div>
            <Select
              value={series.metric}
              onValueChange={(v) => handleMetricChange(series.id, v as Metric)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="return">Return</SelectItem>
                <SelectItem value="volatility">Volatility</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={series.normalize}
              onValueChange={(v) =>
                handleNormalizeChange(series.id, v as Normalize)
              }
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="index">Index 100</SelectItem>
                <SelectItem value="zscore">Z-Score</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={series.axis}
              onValueChange={(v) =>
                handleAxisChange(series.id, v as 'left' | 'right')
              }
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left Axis</SelectItem>
                <SelectItem value="right">Right Axis</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeSeries(series.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}

        <div className="w-full h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={mergedData()}
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
              {seriesConfigs.some((s) => s.axis === 'left') && (
                <YAxis
                  yAxisId="left"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
              )}
              {seriesConfigs.some((s) => s.axis === 'right') && (
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
              )}
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              {seriesConfigs.map((series) => (
                <Line
                  key={series.id}
                  type="monotone"
                  dataKey={series.id}
                  stroke={series.color}
                  strokeWidth={2}
                  dot={false}
                  yAxisId={series.axis}
                  name={`${series.code} ${series.metric}`}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
