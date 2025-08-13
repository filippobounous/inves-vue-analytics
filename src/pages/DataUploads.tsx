
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle, Download } from 'lucide-react';

interface UploadHistory {
  id: string;
  filename: string;
  type: 'transactions' | 'portfolios' | 'securities';
  status: 'success' | 'error' | 'processing';
  uploadTime: string;
  rowsProcessed?: number;
  errorCount?: number;
}

export function DataUploads() {
  const [uploadHistory] = useState<UploadHistory[]>([
    {
      id: '1',
      filename: 'portfolio_holdings.xlsx',
      type: 'portfolios',
      status: 'success',
      uploadTime: '2 hours ago',
      rowsProcessed: 1234
    },
    {
      id: '2',
      filename: 'transactions_2024.csv',
      type: 'transactions',
      status: 'error',
      uploadTime: '1 day ago',
      errorCount: 23
    }
  ]);

  const downloadTemplate = (type: string) => {
    // This would trigger template download
    console.log(`Downloading ${type} template`);
  };

  const handleUpload = (type: string) => {
    // This would handle file upload
    console.log(`Uploading ${type} file`);
  };

  const viewDetails = (id: string) => {
    console.log(`Viewing details for upload ${id}`);
  };

  const fixErrors = (id: string) => {
    console.log(`Fixing errors for upload ${id}`);
  };

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-indigo-500/10 to-indigo-600/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-indigo-600" />
              Transaction Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Upload buy/sell transactions, dividends, and corporate actions.
            </p>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => downloadTemplate('transactions')}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Template
              </Button>
              <Button 
                className="w-full"
                onClick={() => handleUpload('transactions')}
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Upload CSV/Excel
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-teal-500/10 to-teal-600/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-teal-600" />
              Portfolio Mappings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Upload portfolio holdings, allocations, and metadata.
            </p>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => downloadTemplate('portfolios')}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Template
              </Button>
              <Button 
                className="w-full"
                onClick={() => handleUpload('portfolios')}
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Upload CSV/Excel
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-orange-600" />
              Security Mappings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Upload security reference data and classifications.
            </p>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => downloadTemplate('securities')}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Template
              </Button>
              <Button 
                className="w-full"
                onClick={() => handleUpload('securities')}
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Upload CSV/Excel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upload History & Validation */}
      <Card>
        <CardHeader>
          <CardTitle>Upload History & Validation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {uploadHistory.map((upload) => (
              <div key={upload.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  {upload.status === 'success' && <CheckCircle className="h-5 w-5 text-green-600" />}
                  {upload.status === 'error' && <AlertCircle className="h-5 w-5 text-red-600" />}
                  <div>
                    <p className="font-medium">{upload.filename}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="outline" className="text-xs">{upload.type}</Badge>
                      <span>Uploaded {upload.uploadTime}</span>
                      {upload.rowsProcessed && <span>• {upload.rowsProcessed.toLocaleString()} rows processed</span>}
                      {upload.errorCount && <span>• {upload.errorCount} validation errors</span>}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => viewDetails(upload.id)}
                  >
                    View Details
                  </Button>
                  {upload.status === 'error' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => fixErrors(upload.id)}
                    >
                      Fix Errors
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
