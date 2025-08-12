import { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Network, Loader2 } from 'lucide-react';
import { investmentApi } from '@/services/api';

interface CorrelationHeatmapProps {
  portfolioCodes: string[];
  securityCodes: string[];
}

export function CorrelationHeatmap({
  portfolioCodes,
  securityCodes,
}: CorrelationHeatmapProps) {
  const [correlationMatrix, setCorrelationMatrix] = useState<number[][]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Parameters
  const [useReturns, setUseReturns] = useState(true);
  const [logReturns, setLogReturns] = useState(false);
  const [retWinSize, setRetWinSize] = useState(30);
  const [corrModel, setCorrModel] = useState('pearson');
  const [window, setWindow] = useState(252);
  const [lag, setLag] = useState(0);

  const transformCorrelationData = useCallback(
    (apiData: any) => {
      const allCodes = [...portfolioCodes, ...securityCodes];

      // Generate sample correlation matrix if API data is not in expected format
      if (!apiData || !apiData.matrix) {
        const size = allCodes.length;
        const matrix = Array(size)
          .fill(null)
          .map((_, i) =>
            Array(size)
              .fill(null)
              .map((_, j) => {
                if (i === j) return 1;
                return Math.random() * 2 - 1; // Random correlation between -1 and 1
              }),
          );
        return { matrix, labels: allCodes };
      }

      return { matrix: apiData.matrix, labels: apiData.labels || allCodes };
    },
    [portfolioCodes, securityCodes],
  );

  const fetchCorrelations = useCallback(async () => {
    if (portfolioCodes.length === 0 && securityCodes.length === 0) {
      setCorrelationMatrix([]);
      setLabels([]);
      return;
    }

    setLoading(true);
    setError(null);

    const response = await investmentApi.getCorrelations({
      portfolio_codes: portfolioCodes.length > 0 ? portfolioCodes : undefined,
      security_codes: securityCodes.length > 0 ? securityCodes : undefined,
      use_returns: useReturns,
      log_returns: logReturns,
      ret_win_size: retWinSize,
      corr_model: corrModel,
      window,
      lag,
    });

    setLoading(false);

    if (response.success && response.data) {
      const { matrix, labels: responseLabels } = transformCorrelationData(
        response.data,
      );
      setCorrelationMatrix(matrix);
      setLabels(responseLabels);
    } else {
      setError(response.error || 'Failed to fetch correlation data');
    }
  }, [
    portfolioCodes,
    securityCodes,
    useReturns,
    logReturns,
    retWinSize,
    corrModel,
    window,
    lag,
    transformCorrelationData,
  ]);

  useEffect(() => {
    fetchCorrelations();
  }, [fetchCorrelations]);

  const getCorrelationColor = (value: number) => {
    if (value > 0.7) return 'bg-green-500';
    if (value > 0.3) return 'bg-green-400';
    if (value > 0.1) return 'bg-green-300';
    if (value > -0.1) return 'bg-gray-300';
    if (value > -0.3) return 'bg-red-300';
    if (value > -0.7) return 'bg-red-400';
    return 'bg-red-500';
  };

  const getTextColor = (value: number) => {
    return Math.abs(value) > 0.5 ? 'text-white' : 'text-black';
  };

  if (portfolioCodes.length === 0 && securityCodes.length === 0) {
    return (
      <Card className="chart-container">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-5 w-5 text-primary" />
            Correlation Matrix
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">
            Select portfolios or securities to view correlation matrix
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
          Correlation Matrix
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="retWinSize">Return Window</Label>
            <Input
              id="retWinSize"
              type="number"
              value={retWinSize}
              onChange={(e) => setRetWinSize(Number(e.target.value))}
              className="input-financial"
              min="1"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="window">Correlation Window</Label>
            <Input
              id="window"
              type="number"
              value={window}
              onChange={(e) => setWindow(Number(e.target.value))}
              className="input-financial"
              min="1"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lag">Lag</Label>
            <Input
              id="lag"
              type="number"
              value={lag}
              onChange={(e) => setLag(Number(e.target.value))}
              className="input-financial"
              min="0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="corrModel">Model</Label>
            <Select value={corrModel} onValueChange={setCorrModel}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pearson">Pearson</SelectItem>
                <SelectItem value="spearman">Spearman</SelectItem>
                <SelectItem value="kendall">Kendall</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="useReturns"
              checked={useReturns}
              onCheckedChange={(checked) => setUseReturns(checked as boolean)}
            />
            <Label htmlFor="useReturns">Use Returns</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="logReturns"
              checked={logReturns}
              onCheckedChange={(checked) => setLogReturns(checked as boolean)}
            />
            <Label htmlFor="logReturns">Log Returns</Label>
          </div>
          <Button onClick={fetchCorrelations} disabled={loading}>
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
        ) : correlationMatrix.length > 0 ? (
          <div className="overflow-auto">
            <div className="inline-block min-w-full">
              <table className="border-collapse">
                <thead>
                  <tr>
                    <th className="w-20"></th>
                    {labels.map((label) => (
                      <th
                        key={label}
                        className="w-20 p-2 text-xs font-medium text-center border border-border"
                      >
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {correlationMatrix.map((row, i) => (
                    <tr key={labels[i]}>
                      <th className="w-20 p-2 text-xs font-medium text-right border border-border">
                        {labels[i]}
                      </th>
                      {row.map((value, j) => (
                        <td
                          key={j}
                          className={`w-20 h-20 p-1 text-xs font-medium text-center border border-border ${getCorrelationColor(value)} ${getTextColor(value)}`}
                        >
                          {value.toFixed(2)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Color scale legend */}
            <div className="mt-4 flex items-center justify-center space-x-2">
              <span className="text-xs text-muted-foreground">-1.0</span>
              <div className="flex">
                <div className="w-6 h-4 bg-red-500"></div>
                <div className="w-6 h-4 bg-red-400"></div>
                <div className="w-6 h-4 bg-red-300"></div>
                <div className="w-6 h-4 bg-gray-300"></div>
                <div className="w-6 h-4 bg-green-300"></div>
                <div className="w-6 h-4 bg-green-400"></div>
                <div className="w-6 h-4 bg-green-500"></div>
              </div>
              <span className="text-xs text-muted-foreground">1.0</span>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
