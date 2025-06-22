import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, DollarSign, AlertTriangle } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { getOutstandingAmount } from "@/lib/dashboardMetrics";

interface AdminSummaryProps {
  totalClients: number;
  upcomingSessions: number;
  unpaidInvoices: number;
  monthlyRevenue: number;
}

// Helper function to calculate month-over-month changes
const calculateMonthlyChange = (current: number, clients: any[], payments: any[]) => {
  // For new accounts or accounts with less than 30 days of data, return appropriate messaging
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  // Check if account is new (oldest client/payment is less than 30 days old)
  const oldestClientDate = clients.length > 0 
    ? new Date(Math.min(...clients.map(c => new Date(c.dateJoined).getTime())))
    : now;
  
  const oldestPaymentDate = payments.length > 0
    ? new Date(Math.min(...payments.map(p => new Date(p.date).getTime())))
    : now;
    
  const accountAge = Math.min(oldestClientDate.getTime(), oldestPaymentDate.getTime());
  
  if (accountAge > thirtyDaysAgo.getTime() || current === 0) {
    return { isNew: true, text: "New account" };
  }
  
  // For established accounts, we'd calculate actual differences here
  // For now, return neutral messaging since we don't have historical tracking
  return { isNew: false, text: "This month" };
};

const calculateRevenueChange = (monthlyRevenue: number, payments: any[]) => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  // Check if we have any payments older than 30 days
  const hasHistoricalData = payments.some(p => new Date(p.date) < thirtyDaysAgo);
  
  if (!hasHistoricalData || monthlyRevenue === 0) {
    return { isNew: true, text: "First month" };
  }
  
  // For established accounts, show neutral text since we don't track historical revenue
  return { isNew: false, text: "This month" };
};

export const AdminSummary = ({
  totalClients,
  upcomingSessions,
  unpaidInvoices,
  monthlyRevenue,
}: AdminSummaryProps) => {
  const { payments, clients } = useData();
  const outstandingAmount = getOutstandingAmount(payments);
  
  const clientChange = calculateMonthlyChange(totalClients, clients, payments);
  const revenueChange = calculateRevenueChange(monthlyRevenue, payments);
  
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
      {/* Total Clients */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">
            Total Clients
          </CardTitle>
          <Users className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-700">
            {totalClients}
          </div>
          <p className="text-xs text-blue-600 hidden sm:block">
            {clientChange.text}
          </p>
        </CardContent>
      </Card>

      {/* Upcoming Sessions */}
      <Card className="border-green-200 bg-green-50/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">
            Sessions
          </CardTitle>
          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-700">
            {upcomingSessions}
          </div>
          <p className="text-xs text-green-600 hidden sm:block">Next 7 days</p>
        </CardContent>
      </Card>

      {/* Monthly Revenue */}
      <Card className="border-emerald-200 bg-emerald-50/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">Monthly Revenue</CardTitle>
          <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-600" />
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-emerald-700">
            ${monthlyRevenue}
          </div>
          <p className="text-xs text-emerald-600">{revenueChange.text}</p>
        </CardContent>
      </Card>

      {/* Unpaid Invoices */}
      <Card className="border-orange-200 bg-orange-50/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">Unpaid Invoices</CardTitle>
          <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600" />
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-700">
            {unpaidInvoices}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1">
            <p className="text-xs text-orange-600">
              ${outstandingAmount} outstanding
            </p>
            {unpaidInvoices > 0 && (
              <Badge variant="destructive" className="text-xs w-fit">
                Action Needed
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
