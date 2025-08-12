import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useSettings } from '@/contexts/SettingsContext';
import { useToast } from '@/hooks/use-toast';
import { Settings as SettingsIcon, Save, RotateCcw } from 'lucide-react';

const Settings = () => {
  const { toast } = useToast();
  const settings = useSettings();
  const [tempSettings, setTempSettings] = useState(settings);

  const handleSave = () => {
    settings.updateSettings(tempSettings);
    toast({
      title: 'Settings saved',
      description: 'Your preferences have been updated successfully.',
    });
  };

  const handleReset = () => {
    const defaultSettings = {
      defaultCurrency: 'USD',
      dateFormat: 'YYYY-MM-DD',
      chartTheme: 'auto' as const,
      defaultDateRange: 252,
      autoRefreshInterval: 300,
      showTooltips: true,
      useTestData: true,
      apiTimeout: 30,
      defaultChartType: 'line' as const,
      showGrid: true,
      showLegend: true,
    };
    setTempSettings(defaultSettings);
    toast({
      title: 'Settings reset',
      description: 'All settings have been reset to default values.',
    });
  };

  return (
    <div className='min-h-screen bg-background'>
      <header className='border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50'>
        <div className='container mx-auto px-4 py-4'>
          <div className='flex items-center space-x-4'>
            <div className='flex items-center space-x-2'>
              <div className='h-8 w-8 bg-muted rounded-lg flex items-center justify-center'>
                <SettingsIcon className='h-5 w-5 text-foreground' />
              </div>
              <div>
                <h1 className='text-xl font-bold'>Settings</h1>
                <p className='text-xs text-muted-foreground'>
                  Configure your preferences
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className='container mx-auto px-4 py-6 space-y-6'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* Display Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Display Preferences</CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='space-y-2'>
                <Label htmlFor='currency'>Default Currency</Label>
                <Select
                  value={tempSettings.defaultCurrency}
                  onValueChange={(value) =>
                    setTempSettings({ ...tempSettings, defaultCurrency: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='USD'>USD - US Dollar</SelectItem>
                    <SelectItem value='EUR'>EUR - Euro</SelectItem>
                    <SelectItem value='GBP'>GBP - British Pound</SelectItem>
                    <SelectItem value='JPY'>JPY - Japanese Yen</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='chart-theme'>Chart Theme</Label>
                <Select
                  value={tempSettings.chartTheme}
                  onValueChange={(value: 'auto' | 'light' | 'dark') =>
                    setTempSettings({ ...tempSettings, chartTheme: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='auto'>Auto (Follow System)</SelectItem>
                    <SelectItem value='light'>Light</SelectItem>
                    <SelectItem value='dark'>Dark</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='flex items-center justify-between'>
                <Label htmlFor='tooltips'>Show Tooltips</Label>
                <Switch
                  id='tooltips'
                  checked={tempSettings.showTooltips}
                  onCheckedChange={(checked) =>
                    setTempSettings({ ...tempSettings, showTooltips: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Data Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Data Preferences</CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='space-y-2'>
                <Label>
                  Default Date Range: {tempSettings.defaultDateRange} days
                </Label>
                <Slider
                  value={[tempSettings.defaultDateRange]}
                  onValueChange={([value]) =>
                    setTempSettings({
                      ...tempSettings,
                      defaultDateRange: value,
                    })
                  }
                  max={1000}
                  min={30}
                  step={10}
                  className='w-full'
                />
              </div>

              <div className='space-y-2'>
                <Label>
                  Auto Refresh: {tempSettings.autoRefreshInterval} seconds
                </Label>
                <Slider
                  value={[tempSettings.autoRefreshInterval]}
                  onValueChange={([value]) =>
                    setTempSettings({
                      ...tempSettings,
                      autoRefreshInterval: value,
                    })
                  }
                  max={3600}
                  min={30}
                  step={30}
                  className='w-full'
                />
              </div>

              <div className='flex items-center justify-between'>
                <Label htmlFor='test-data'>Use Test Data</Label>
                <Switch
                  id='test-data'
                  checked={tempSettings.useTestData}
                  onCheckedChange={(checked) =>
                    setTempSettings({ ...tempSettings, useTestData: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Chart Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Chart Preferences</CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='space-y-2'>
                <Label htmlFor='chart-type'>Default Chart Type</Label>
                <Select
                  value={tempSettings.defaultChartType}
                  onValueChange={(value: 'line' | 'area' | 'candlestick') =>
                    setTempSettings({
                      ...tempSettings,
                      defaultChartType: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='line'>Line Chart</SelectItem>
                    <SelectItem value='area'>Area Chart</SelectItem>
                    <SelectItem value='candlestick'>
                      Candlestick Chart
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='flex items-center justify-between'>
                <Label htmlFor='grid'>Show Grid</Label>
                <Switch
                  id='grid'
                  checked={tempSettings.showGrid}
                  onCheckedChange={(checked) =>
                    setTempSettings({ ...tempSettings, showGrid: checked })
                  }
                />
              </div>

              <div className='flex items-center justify-between'>
                <Label htmlFor='legend'>Show Legend</Label>
                <Switch
                  id='legend'
                  checked={tempSettings.showLegend}
                  onCheckedChange={(checked) =>
                    setTempSettings({ ...tempSettings, showLegend: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* API Settings */}
          <Card>
            <CardHeader>
              <CardTitle>API Settings</CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='space-y-2'>
                <Label>API Timeout: {tempSettings.apiTimeout} seconds</Label>
                <Slider
                  value={[tempSettings.apiTimeout]}
                  onValueChange={([value]) =>
                    setTempSettings({ ...tempSettings, apiTimeout: value })
                  }
                  max={120}
                  min={5}
                  step={5}
                  className='w-full'
                />
              </div>

              <div className='p-4 bg-muted rounded-lg'>
                <p className='text-sm text-muted-foreground'>
                  API Endpoint:{' '}
                  {import.meta.env.VITE_API_URL || 'http://localhost:8000'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* Actions */}
        <div className='flex justify-between'>
          <Button
            variant='outline'
            onClick={handleReset}
            className='flex items-center gap-2'
          >
            <RotateCcw className='h-4 w-4' />
            Reset to Defaults
          </Button>

          <Button onClick={handleSave} className='flex items-center gap-2'>
            <Save className='h-4 w-4' />
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
