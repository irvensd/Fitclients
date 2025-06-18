import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Users,
  Target,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

interface RevenueMetrics {
  monthlyRevenue: number;
  monthlyGrowth: number;
  averageSessionValue: number;
  totalSessions: number;
  activeClients: number;
  clientRetentionRate: number;
  projectedMonthlyRevenue: number;
  goalProgress: number;
}

const mockMetrics: RevenueMetrics = {
  monthlyRevenue: 8750,
  monthlyGrowth: 12.5,
  averageSessionValue: 75,
  totalSessions: 142,
  activeClients: 28,
  clientRetentionRate: 89,
  projectedMonthlyRevenue: 9800,
  goalProgress: 73,
};

export const RevenueAnalytics = () => {
  const {
    monthlyRevenue,
    monthlyGrowth,
    averageSessionValue,
    totalSessions,
    activeClients,
    clientRetentionRate,
    projectedMonthlyRevenue,
    goalProgress,
  } = mockMetrics;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Revenue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(monthlyRevenue)}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {monthlyGrowth > 0 ? (
                <ArrowUpRight className="h-3 w-3 text-green-600" />
              ) : (
                <ArrowDownRight className="h-3 w-3 text-red-600" />
              )}
              <span
                className={
                  monthlyGrowth > 0 ? "text-green-600" : "text-red-600"
                }
              >
                {formatPercentage(monthlyGrowth)}
              </span>
              <span>vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Session Value
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(averageSessionValue)}
            </div>
            <p className="text-xs text-muted-foreground">
              {totalSessions} sessions this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Clients
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeClients}</div>
            <p className="text-xs text-muted-foreground">
              {clientRetentionRate}% retention rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Goal</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{goalProgress}%</div>
            <div className="mt-2">
              <Progress value={goalProgress} className="h-2" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Target: {formatCurrency(12000)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Revenue Insights
            </CardTitle>
            <CardDescription>
              Key performance indicators for your business
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium text-green-800">
                  Projected Monthly Revenue
                </p>
                <p className="text-sm text-green-600">
                  Based on current trends
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-green-800">
                  {formatCurrency(projectedMonthlyRevenue)}
                </p>
                <Badge className="bg-green-100 text-green-800">
                  +{formatCurrency(projectedMonthlyRevenue - monthlyRevenue)}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Client Retention</span>
                <span className="text-sm text-muted-foreground">
                  {clientRetentionRate}%
                </span>
              </div>
              <Progress value={clientRetentionRate} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  Capacity Utilization
                </span>
                <span className="text-sm text-muted-foreground">76%</span>
              </div>
              <Progress value={76} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Business Opportunities
            </CardTitle>
            <CardDescription>Areas for growth and improvement</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 border border-blue-200 rounded-lg bg-blue-50">
              <h4 className="font-medium text-blue-800 mb-1">
                Package Upsell Opportunity
              </h4>
              <p className="text-sm text-blue-600 mb-2">
                12 clients are due for package renewals this month
              </p>
              <Badge className="bg-blue-100 text-blue-800">
                Potential: {formatCurrency(3600)}
              </Badge>
            </div>

            <div className="p-3 border border-purple-200 rounded-lg bg-purple-50">
              <h4 className="font-medium text-purple-800 mb-1">
                Referral Program
              </h4>
              <p className="text-sm text-purple-600 mb-2">
                3 clients have high satisfaction scores
              </p>
              <Badge className="bg-purple-100 text-purple-800">
                Ask for referrals
              </Badge>
            </div>

            <div className="p-3 border border-orange-200 rounded-lg bg-orange-50">
              <h4 className="font-medium text-orange-800 mb-1">
                Schedule Optimization
              </h4>
              <p className="text-sm text-orange-600 mb-2">
                5 open slots during peak hours
              </p>
              <Badge className="bg-orange-100 text-orange-800">
                Fill gaps: {formatCurrency(375)}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
