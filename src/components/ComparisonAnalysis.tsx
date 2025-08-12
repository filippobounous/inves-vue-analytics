
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PriceChart } from './PriceChart';
import { ReturnsChart } from './ReturnsChart';
import { VolatilityChart } from './VolatilityChart';
import { investmentApi } from '@/services/api';
import { useSettings } from '@/contexts/SettingsContext';
import {
  generateMockPriceData,
  generateMockReturnsData,
  generateMockVolatilityData,
} from '@/services/testData';
import { TrendingUp, BarChart3, Activity, Download } from 'lucide-react';

interface ComparisonAnalysisProps {
  portfolioCodes: string[];
  securityCodes: string[];
}

interface AnalysisSeries {
  [key: string]: any;
}

export function ComparisonAnalysis({
  portfolioCodes,
  securityCodes,
}: ComparisonAnalysisProps) {
  const [activeTab, setActiveTab] = useState('prices');
  const { useTestData, defaultDateRange } = useSettings();

  const allCodes = [...portfolioCodes, ...securityCodes];

  const combineAnalysisData = (data: AnalysisSeries[]): AnalysisSeries[] => {
    if (!Array.isArray(data) || data.length === 0) return [];
    
    const dateMap = new Map();
    
    data.forEach((series) => {
      if (Array.isArray(series)) {
        series.forEach((point: any) => {
          if (point.date) {
            if (!dateMap.has(point.date)) {
              dateMap.set(point.date, { date: point.date });
            }
            const existing = dateMap.get(point.date);
            Object.keys(point).forEach((key) => {
              if (key !== 'date') {
                existing[key] = point[key];
              }
            });
          }
        });
      }
    });

    return Array.from(dateMap.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
  };

  const generateTestData = (type: string) => {
    const data: AnalysisSeries[] = [];
    allCodes.forEach((code) => {
      switch (type) {
        case 'prices':
          data.push(generateMockPriceData(code, defaultDateRange) as any);
          break;
        case 'returns':
          data.push(generateMockReturnsData(code, defaultDateRange) as any);
          break;
        case 'volatility':
          data.push(generateMockVolatilityData(code, defaultDateRange) as any);
          break;
      }
    });
    return { success: true, data: combineAnalysisData(data) };
  };

  const pricesQuery = useQuery({
    queryKey: ['comparison-prices', portfolioCodes, securityCodes, useTestData],
    queryFn: async () => {
      if (useTestData) {
        return generateTestData('prices');
      }
      const pricesResponse = await investmentApi.getPrices({
        portfolio_codes: portfolioCodes.length > 0 ? portfolioCodes : undefined,
        security_codes: securityCodes.length > 0 ? securityCodes : undefined,
      });
      return {
        ...pricesResponse,
        data: Array.isArray(pricesResponse.data) ? pricesResponse.data : []
      };
    },
    enabled: allCodes.length > 0,
  });

  const returnsQuery = useQuery({
    queryKey: ['comparison-returns', portfolioCodes, securityCodes, useTestData],
    queryFn: async () => {
      if (useTestData) {
        return generateTestData('returns');
      }
      const returnsResponse = await investmentApi.getReturns({
        portfolio_codes: portfolioCodes.length > 0 ? portfolioCodes : undefined,
        security_codes: securityCodes.length > 0 ? securityCodes : undefined,
      });
      return {
        ...returnsResponse,
        data: Array.isArray(returnsResponse.data) ? returnsResponse.data : []
      };
    },
    enabled: allCodes.length > 0,
  });

  const volatilityQuery = useQuery({
    queryKey: ['comparison-volatility', portfolioCodes, securityCodes, useTestData],
    queryFn: async () => {
      if (useTestData) {
        return generateTestData('volatility');
      }
      const volatilityResponse = await investmentApi.getRealisedVolatility({
        portfolio_codes: portfolioCodes.length > 0 ? portfolioCodes : undefined,
        security_codes: securityCodes.length > 0 ? securityCodes : undefined,
      });
      return {
        ...volatilityResponse,
        data: Array.isArray(volatilityResponse.data) ? volatilityResponse.data : []
      };
    },
    enabled: allCodes.length > 0,
  });

  if (allCodes.length === 0) {
    return (
      <Card className="glass">
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground">
              No Data Selected
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              Select portfolios or securities to view comparison analysis
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getCurrentData = () => {
    switch (activeTab) {
      case 'prices':
        return pricesQuery.data?.data || [];
      case 'returns':
        return returnsQuery.data?.data || [];
      case 'volatility':
        return volatilityQuery.data?.data || [];
      default:
        return [];
    }
  };

  const getCurrentLoading = () => {
    switch (activeTab) {
      case 'prices':
        return pricesQuery.isLoading;
      case 'returns':
        return returnsQuery.isLoading;
      case 'volatility':
        return volatilityQuery.isLoading;
      default:
        return false;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="glass">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Comparison Analysis
              {useTestData && (
                <Badge variant="secondary" className="text-xs">
                  Test Data
                </Badge>
              )}
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="text-sm text-muted-foreground">
                {allCodes.length} selected
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="prices" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Prices
              </TabsTrigger>
              <TabsTrigger value="returns" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Returns
              </TabsTrigger>
              <TabsTrigger value="volatility" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Volatility
              </TabsTrigger>
            </TabsList>

            <TabsContent value="prices" className="mt-6">
              <PriceChart
                data={getCurrentData()}
                selectedCodes={allCodes}
                loading={getCurrentLoading()}
              />
            </TabsContent>

            <TabsContent value="returns" className="mt-6">
              <ReturnsChart
                data={getCurrentData()}
                selectedCodes={allCodes}
                loading={getCurrentLoading()}
              />
            </TabsContent>

            <TabsContent value="volatility" className="mt-6">
              <VolatilityChart
                data={getCurrentData()}
                selectedCodes={allCodes}
                loading={getCurrentLoading()}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
