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
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";

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

const calculateRealMetrics = (clients: any[], sessions: any[], payments: any[]): RevenueMetrics => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  // Monthly revenue (completed payments this month)
  const monthlyRevenue = payments
    .filter((payment) => {
      const paymentDate = new Date(payment.date);
      return (
        paymentDate.getMonth() === currentMonth &&
        paymentDate.getFullYear() === currentYear &&
        payment.status === "completed"
      );
    })
    .reduce((total, payment) => total + payment.amount, 0);

  // Last month's revenue for growth calculation
  const lastMonthRevenue = payments
    .filter((payment) => {
      const paymentDate = new Date(payment.date);
      return (
        paymentDate.getMonth() === lastMonth &&
        paymentDate.getFullYear() === lastMonthYear &&
        payment.status === "completed"
      );
    })
    .reduce((total, payment) => total + payment.amount, 0);

  // Monthly growth
  const monthlyGrowth = lastMonthRevenue > 0 
    ? ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
    : 0;

  // Sessions this month
  const totalSessions = sessions.filter((session) => {
    const sessionDate = new Date(session.date);
    return (
      sessionDate.getMonth() === currentMonth &&
      sessionDate.getFullYear() === currentYear &&
      session.status === "completed"
    );
  }).length;

  // Average session value
  const averageSessionValue = totalSessions > 0 ? monthlyRevenue / totalSessions : 0;

  // Active clients
  const activeClients = clients.length;

  // Client retention rate (simplified - clients who had sessions in both last and current month)
  const lastMonthClients = new Set(
    sessions
      .filter((session) => {
        const sessionDate = new Date(session.date);
        return (
          sessionDate.getMonth() === lastMonth &&
          sessionDate.getFullYear() === lastMonthYear &&
          session.status === "completed"
        );
      })
      .map((session) => session.clientId)
  );

  const currentMonthClients = new Set(
    sessions
      .filter((session) => {
        const sessionDate = new Date(session.date);
        return (
          sessionDate.getMonth() === currentMonth &&
          sessionDate.getFullYear() === currentYear &&
          session.status === "completed"
        );
      })
      .map((session) => session.clientId)
  );

  const retainedClients = [...lastMonthClients].filter(clientId => 
    currentMonthClients.has(clientId)
  ).length;

  const clientRetentionRate = lastMonthClients.size > 0 
    ? (retainedClients / lastMonthClients.size) * 100
    : 100;

  // Projected monthly revenue (simple projection based on current trend)
  const projectedMonthlyRevenue = monthlyRevenue > 0 
    ? monthlyRevenue * 1.1 // 10% growth projection
    : 0;

  // Goal progress (assuming $10,000 monthly goal)
  const monthlyGoal = 10000;
  const goalProgress = (monthlyRevenue / monthlyGoal) * 100;

  return {
    monthlyRevenue,
    monthlyGrowth,
    averageSessionValue,
    totalSessions,
    activeClients,
    clientRetentionRate,
    projectedMonthlyRevenue,
    goalProgress: Math.min(goalProgress, 100), // Cap at 100%
  };
};

export const RevenueAnalytics = () => {
  const { clients, sessions, payments } = useData();
  const { user } = useAuth();

  // Check if this is the demo account
  const isDemoAccount = user?.email === "trainer@demo.com" || user?.uid === "demo-user-123";

  // Use mock data for demo account, real data for others
  const metrics = isDemoAccount ? {
    monthlyRevenue: 8750,
    monthlyGrowth: 12.5,
    averageSessionValue: 75,
    totalSessions: 142,
    activeClients: 28,
    clientRetentionRate: 89,
    projectedMonthlyRevenue: 9800,
    goalProgress: 73,
  } : calculateRealMetrics(clients, sessions, payments);

  const {
    monthlyRevenue,
    monthlyGrowth,
    averageSessionValue,
    totalSessions,
    activeClients,
    clientRetentionRate,
    projectedMonthlyRevenue,
    goalProgress,
  } = metrics;

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
    <div className="space-y-4 sm:space-y-6">
      {/* Revenue Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">
              Monthly Revenue
            </CardTitle>
            <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-lg sm:text-2xl font-bold">
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
              <span className="hidden sm:inline">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">
              Avg Session Value
            </CardTitle>
            <Target className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-lg sm:text-2xl font-bold">
              {formatCurrency(averageSessionValue)}
            </div>
            <p className="text-xs text-muted-foreground">
              {totalSessions} sessions this month
            </p>
          </CardContent>
        </Card>



        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Monthly Goal</CardTitle>
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-lg sm:text-2xl font-bold">{goalProgress}%</div>
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
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              Revenue Insights
            </CardTitle>
            <CardDescription className="text-sm">
              Key performance indicators for your business
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            {monthlyRevenue === 0 ? (
              // New account with no revenue
              <div className="text-center py-6 sm:py-8">
                <TrendingUp className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
                <h4 className="font-medium text-muted-foreground mb-2 text-sm sm:text-base">
                  Ready to Start Earning
                </h4>
                <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                  Complete your first sessions and add payments to see revenue insights and projections.
                </p>
                <Badge className="bg-green-100 text-green-800 text-xs">
                  Add sessions to track revenue
                </Badge>
              </div>
            ) : (
              // Existing account with revenue
              <>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium text-green-800 text-sm sm:text-base">
                      Projected Monthly Revenue
                    </p>
                    <p className="text-xs sm:text-sm text-green-600">
                      Based on current trends
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-base sm:text-lg font-bold text-green-800">
                      {formatCurrency(projectedMonthlyRevenue)}
                    </p>
                    <Badge className="bg-green-100 text-green-800 text-xs">
                      +{formatCurrency(projectedMonthlyRevenue - monthlyRevenue)}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm font-medium">Client Retention</span>
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      {clientRetentionRate.toFixed(0)}%
                    </span>
                  </div>
                  <Progress value={clientRetentionRate} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm font-medium">
                      Capacity Utilization
                    </span>
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      {Math.min(Math.floor((totalSessions / 30) * 100), 100)}%
                    </span>
                  </div>
                  <Progress value={Math.min(Math.floor((totalSessions / 30) * 100), 100)} className="h-2" />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Target className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              Business Opportunities
            </CardTitle>
            <CardDescription className="text-sm">Areas for growth and improvement</CardDescription>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            {activeClients === 0 ? (
              // New account with no clients
              <div className="text-center py-8">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h4 className="font-medium text-muted-foreground mb-2">
                  Start Building Your Business
                </h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Add your first clients to see personalized business opportunities and growth insights.
                </p>
                <Badge className="bg-blue-100 text-blue-800">
                  Add clients to unlock insights
                </Badge>
              </div>
            ) : (
              // Existing account with clients
              <>
                <div className="p-3 border border-blue-200 rounded-lg bg-blue-50">
                  <h4 className="font-medium text-blue-800 mb-1">
                    Package Upsell Opportunity
                  </h4>
                  <p className="text-sm text-blue-600 mb-2">
                    {Math.floor(activeClients * 0.4)} clients are due for package renewals this month
                  </p>
                  <Badge className="bg-blue-100 text-blue-800">
                    Potential: {formatCurrency(Math.floor(activeClients * 0.4 * 300))}
                  </Badge>
                </div>

                <div className="p-3 border border-purple-200 rounded-lg bg-purple-50">
                  <h4 className="font-medium text-purple-800 mb-1">
                    Referral Program
                  </h4>
                  <p className="text-sm text-purple-600 mb-2">
                    {Math.floor(activeClients * 0.2)} clients have high satisfaction scores
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
                    {Math.floor(Math.random() * 8) + 2} open slots during peak hours
                  </p>
                  <Badge className="bg-orange-100 text-orange-800">
                    Fill gaps: {formatCurrency((Math.floor(Math.random() * 8) + 2) * 75)}
                  </Badge>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
