import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useSettings } from '@/hooks/use-settings';
import { Settings as SettingsIcon, ArrowLeft } from 'lucide-react';

const Settings = () => {
  const navigate = useNavigate();
  const { useTestData, updateSettings } = useSettings();

  const handleTestDataToggle = (checked: boolean) => {
    updateSettings({ useTestData: checked });
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Configure your preferences and application settings
          </p>
        </div>
      </div>

      {/* Advanced Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            Advanced Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="test-data">Use Test Data</Label>
              <div className="text-sm text-muted-foreground">
                Toggle between test data and real API data for development and
                testing
              </div>
            </div>
            <Switch
              id="test-data"
              checked={useTestData}
              onCheckedChange={handleTestDataToggle}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
