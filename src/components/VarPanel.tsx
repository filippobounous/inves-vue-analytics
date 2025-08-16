
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Activity, Loader2 } from 'lucide-react';

interface ApiVarData {
  date: string;
  [key: string]: number | string;
}

interface VarPanelProps {
  data: ApiVarData[];
  selectedCodes: string[];
  loading: boolean;
}

export function VarPanel({ data, selectedCodes, loading }: VarPanelProps) {
  const formatPercent = (value: number) => {
    return `${(value * 100).toFixed(2)}%`;
  };

  if (selectedCodes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
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

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Value at Risk (VaR)
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  // Ensure data is an array before processing
  const safeData = Array.isArray(data) ? data : [];
  const latestData = safeData.length > 0 ? safeData[safeData.length - 1] : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Value at Risk (VaR)
          <Badge variant="secondary" className="text-xs">
            95% Confidence
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {latestData ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Entity</TableHead>
                <TableHead>1-Day VaR</TableHead>
                <TableHead>5-Day VaR</TableHead>
                <TableHead>10-Day VaR</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedCodes.map((code) => (
                <TableRow key={code}>
                  <TableCell className="font-medium">{code}</TableCell>
                  <TableCell className="text-red-600">
                    {typeof latestData[`${code}_1d`] === 'number' 
                      ? formatPercent(latestData[`${code}_1d`] as number)
                      : 'N/A'
                    }
                  </TableCell>
                  <TableCell className="text-red-600">
                    {typeof latestData[`${code}_5d`] === 'number' 
                      ? formatPercent(latestData[`${code}_5d`] as number)
                      : 'N/A'
                    }
                  </TableCell>
                  <TableCell className="text-red-600">
                    {typeof latestData[`${code}_10d`] === 'number' 
                      ? formatPercent(latestData[`${code}_10d`] as number)
                      : 'N/A'
                    }
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            No VaR data available
          </div>
        )}
      </CardContent>
    </Card>
  );
}
