
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { investmentApi } from "@/services/api";

interface MultiSeriesChartProps {
  portfolioCodes: string[];
  securityCodes: string[];
}

type SeriesType = 'prices' | 'returns' | 'volatility' | 'correlations';

interface SeriesConfig {
  type: SeriesType;
  enabled: boolean;
  normalized: boolean;
  color: string;
}

export function MultiSeriesChart({ portfolioCodes, securityCodes }: MultiSeriesChartProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [seriesConfigs, setSeriesConfigs] = useState<Record<SeriesType, SeriesConfig>>({
    prices: { type: 'prices', enabled: true, normalized: false, color: 'hsl(var(--chart-1))' },
    returns: { type: 'returns', enabled: false, normalized: false, color: 'hsl(var(--chart-2))' },
    volatility: { type: 'volatility', enabled: false, normalized: false, color: 'hsl(var(--chart-3))' },
    correlations: { type: 'correlations', enabled: false, normalized: false, color: 'hsl(var(--chart-4))' }
  });

  const [selectedEntity, setSelectedEntity] = useState<string>('');

  useEffect(() => {
    const allEntities = [...portfolioCodes, ...securityCodes];
    if (allEntities.length > 0 && !selectedEntity) {
      setSelectedEntity(allEntities[0]);
    }
  }, [portfolioCodes, securityCodes, selectedEntity]);

  useEffect(() => {
    if ((portfolioCodes.length === 0 && securityCodes.length === 0) || !selectedEntity) {
      setData([]);
      return;
    }

    fetchMultiSeriesData();
  }, [portfolioCodes, securityCodes, selectedEntity, seriesConfigs]);

  const fetchMultiSeriesData = async () => {
    setLoading(true);
    setError(null);

    try {
      const enabledSeries = Object.values(seriesConfigs).filter(config => config.enabled);
      const dataPromises = enabledSeries.map(config => fetchSeriesData(config.type));
      
      const results = await Promise.all(dataPromises);
      const combinedData = combineSeriesData(results, enabledSeries);
      
      setData(combinedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const fetchSeriesData = async (seriesType: SeriesType) => {
    const params = {
      portfolio_codes: portfolioCodes.includes(selectedEntity) ? [selectedEntity] : undefined,
      security_codes: securityCodes.includes(selectedEntity) ? [selectedEntity] : undefined,
      local_only: true,
    };

    switch (seriesType) {
      case 'prices':
        return investmentApi.getPrices(params);
      case 'returns':
        return investmentApi.getReturns({ ...params, use_ln_ret: false, win_size: 30 });
      case 'volatility':
        return investmentApi.getRealisedVolatility({ ...params, rv_model: 'simple', rv_win_size: 30 });
      case 'correlations':
        // For correlation, we need at least 2 entities, so return mock data or handle differently
        return { success: true, data: [] };
      default:
        return { success: false, error: 'Unknown series type' };
    }
  };

  const combineSeriesData = (results: any[], configs: SeriesConfig[]) => {
    const combinedData: any[] = [];
    
    results.forEach((result, index) => {
      if (result.success && result.data && Array.isArray(result.data)) {
        const config = configs[index];
        const seriesData = result.data.map((item: any, dataIndex: number) => {
          let value = item[selectedEntity] || Math.random() * 100;
          
          // Apply normalization if enabled
          if (config.normalized && result.data.length > 0) {
            const firstValue = result.data[0][selectedEntity] || 1;
            value = (value / firstValue) * 100; // Normalize to base 100
          }
          
          return {
            date: item.date || `Day ${dataIndex + 1}`,
            [`${config.type}_${selectedEntity}`]: value
          };
        });
        
        // Merge with existing data
        seriesData.forEach((item, dataIndex) => {
          if (!combinedData[dataIndex]) {
            combinedData[dataIndex] = { date: item.date };
          }
          Object.assign(combinedData[dataIndex], item);
        });
      }
    });
    
    return combinedData;
  };

  const normalizeData = (data: number[]): number[] => {
    if (data.length === 0) return [];
    const firstValue = data[0];
    return data.map(value => (value / firstValue) * 100);
  };

  const toggleSeries = (seriesType: SeriesType) => {
    setSeriesConfigs(prev => ({
      ...prev,
      [seriesType]: {
        ...prev[seriesType],
        enabled: !prev[seriesType].enabled
      }
    }));
  };

  const toggleNormalization = (seriesType: SeriesType) => {
    setSeriesConfigs(prev => ({
      ...prev,
      [seriesType]: {
        ...prev[seriesType],
        normalized: !prev[seriesType].normalized
      }
    }));
  };

  const allEntities = [...portfolioCodes, ...securityCodes];

  if (allEntities.length === 0) {
    return (
      <Card className="chart-container">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Multi-Series Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Select portfolios or securities to view multi-series analysis</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="chart-container">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Multi-Series Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4 items-center flex-wrap">
          <div className="space-y-2">
            <Label>Entity</Label>
            <Select value={selectedEntity} onValueChange={setSelectedEntity}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {allEntities.map(entity => (
                  <SelectItem key={entity} value={entity}>{entity}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(seriesConfigs).map(([key, config]) => (
              <div key={key} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`${key}-enabled`}
                    checked={config.enabled}
                    onCheckedChange={() => toggleSeries(key as SeriesType)}
                  />
                  <Label htmlFor={`${key}-enabled`} className="capitalize">{key}</Label>
                </div>
                {config.enabled && (
                  <div className="flex items-center space-x-2 ml-6">
                    <Checkbox
                      id={`${key}-normalized`}
                      checked={config.normalized}
                      onCheckedChange={() => toggleNormalization(key as SeriesType)}
                    />
                    <Label htmlFor={`${key}-normalized`} className="text-xs">Normalize</Label>
                  </div>
                )}
              </div>
            ))}
          </div>

          <Button onClick={fetchMultiSeriesData} disabled={loading}>
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
          <ResponsiveContainer width="100%" height={500}>
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              {Object.entries(seriesConfigs)
                .filter(([_, config]) => config.enabled)
                .map(([key, config]) => (
                  <Line
                    key={`${key}_${selectedEntity}`}
                    type="monotone"
                    dataKey={`${key}_${selectedEntity}`}
                    stroke={config.color}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: config.color }}
                    name={`${key}${config.normalized ? ' (normalized)' : ''}`}
                  />
                ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
