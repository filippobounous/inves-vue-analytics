
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shuffle, Target, TrendingUp, DollarSign } from 'lucide-react';

export function RebalancingTool() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Rebalancing & Allocation</h1>
          <p className="text-muted-foreground mt-1">
            Optimize portfolio allocations and minimize transaction costs
          </p>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Target className="h-4 w-4 text-emerald-600" />
              Set Targets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-3">
              Define target allocations for your portfolio
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Configure
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Shuffle className="h-4 w-4 text-blue-600" />
              Rebalance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-3">
              Generate rebalancing suggestions
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Analyze
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-purple-600" />
              Backtest
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-3">
              Test rebalanced portfolio performance
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Run Test
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-rose-500/10 to-rose-600/5">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4 text-rose-600" />
              Execute
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-3">
              Execute recommended trades
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Execute
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Current vs Target Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center text-muted-foreground py-12">
              <Shuffle className="h-12 w-12 mx-auto mb-4" />
              <p>Allocation comparison will be displayed here</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rebalancing Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center text-muted-foreground py-12">
              <Target className="h-12 w-12 mx-auto mb-4" />
              <p>Trade recommendations will be shown here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
