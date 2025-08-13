
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle } from 'lucide-react';

export function DataUploads() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Data Uploads</h1>
          <p className="text-muted-foreground mt-1">
            Upload transactions, portfolios, and securities with real-time validation
          </p>
        </div>
      </div>

      {/* Upload Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-indigo-500/10 to-indigo-600/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-indigo-600" />
              Transaction Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Upload buy/sell transactions, dividends, and corporate actions.
            </p>
            <Button variant="outline" className="w-full">
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Upload CSV/Excel
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-teal-500/10 to-teal-600/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-teal-600" />
              Portfolio Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Upload portfolio holdings, allocations, and metadata.
            </p>
            <Button variant="outline" className="w-full">
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Upload CSV/Excel
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-orange-600" />
              Security Master
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Upload security reference data and classifications.
            </p>
            <Button variant="outline" className="w-full">
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Upload CSV/Excel
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Validation Status */}
      <Card>
        <CardHeader>
          <CardTitle>Upload History & Validation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">portfolio_holdings.xlsx</p>
                  <p className="text-sm text-muted-foreground">Uploaded 2 hours ago • 1,234 rows processed</p>
                </div>
              </div>
              <Button variant="outline" size="sm">View Details</Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="font-medium">transactions_2024.csv</p>
                  <p className="text-sm text-muted-foreground">Uploaded 1 day ago • 23 validation errors</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Fix Errors</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
