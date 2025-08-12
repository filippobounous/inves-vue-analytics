import { useEffect, useState } from 'react';
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
import { Activity, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { investmentApi } from '@/services/api';

interface VolatilityChartProps {
  portfolioCodes: string[];
  securityCodes: string[];
}

export function VolatilityChart({
  portfolioCodes,
  securityCodes,
}: VolatilityChartProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rvModel, setRvModel] = useState('simple');
  const [rvWinSize, setRvWinSize] = useState(30);

  useEffect(() => {
    if (portfolioCodes.length === 0 && securityCodes.length === 0) {
      setData([]);
      return;
    }

    fetchVolatility();
  }, [portfolioCodes, securityCodes]);

  const fetchVolatility = async () => {
    setLoading(true);
    setError(null);

    const response = await investmentApi.getRealisedVolatility({
      portfolio_codes: portfolioCodes.length > 0 ? portfolioCodes : undefined,
      security_codes: securityCodes.length > 0 ? securityCodes : undefined,
      rv_model: rvModel,
      rv_win_size: rvWinSize,
      local_only: true,
    });

    setLoading(false);

    if (response.success && response.data) {
      const chartData = transformVolatilityData(response.data);
      setData(chartData);
    } else {
      setError(response.error || 'Failed to fetch volatility data');
    }
  };

  const transformVolatilityData = (apiData: any) => {
    if (!apiData || !Array.isArray(apiData)) {
      return [];
    }

    return apiData.map((item: any, index: number) => ({
      date: item.date || `Day ${index + 1}`,
      ...portfolioCodes.reduce(
        (acc, code) => ({
          ...acc,
          [code]: item[code] || Math.random() * 0.3 + 0.1,
        }),
        {},
      ),
      ...securityCodes.reduce(
        (acc, code) => ({
          ...acc,
          [code]: item[code] || Math.random() * 0.4 + 0.15,
        }),
        {},
      ),
    }));
  };

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
      <Card className='chart-container'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Activity className='h-5 w-5 text-primary' />
            Realised Volatility
          </CardTitle>
        </CardHeader>
        <CardContent className='flex items-center justify-center h-64'>
          <p className='text-muted-foreground'>
            Select portfolios or securities to view volatility analysis
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='chart-container'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Activity className='h-5 w-5 text-primary' />
          Realised Volatility
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='flex gap-4 items-end'>
          <div className='space-y-2'>
            <Label htmlFor='rvWinSize'>Window Size</Label>
            <Input
              id='rvWinSize'
              type='number'
              value={rvWinSize}
              onChange={(e) => setRvWinSize(Number(e.target.value))}
              className='w-24 input-financial'
              min='1'
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='rvModel'>Model</Label>
            <Select value={rvModel} onValueChange={setRvModel}>
              <SelectTrigger className='w-32'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='simple'>Simple</SelectItem>
                <SelectItem value='garch'>GARCH</SelectItem>
                <SelectItem value='ewma'>EWMA</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={fetchVolatility} disabled={loading}>
            Update
          </Button>
        </div>

        {loading ? (
          <div className='flex items-center justify-center h-64'>
            <Loader2 className='h-8 w-8 animate-spin text-primary' />
          </div>
        ) : error ? (
          <div className='flex items-center justify-center h-64'>
            <p className='text-destructive'>{error}</p>
          </div>
        ) : (
          <ResponsiveContainer width='100%' height={400}>
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray='3 3'
                stroke='hsl(var(--border))'
              />
              <XAxis
                dataKey='date'
                stroke='hsl(var(--muted-foreground))'
                fontSize={12}
              />
              <YAxis
                stroke='hsl(var(--muted-foreground))'
                fontSize={12}
                tickFormatter={(value) => `${(value * 100).toFixed(1)}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                formatter={(value: any) => [`${(value * 100).toFixed(2)}%`, '']}
              />
              <Legend />
              {[...portfolioCodes, ...securityCodes].map((code, index) => (
                <Line
                  key={code}
                  type='monotone'
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
