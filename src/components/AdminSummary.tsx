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

export const AdminSummary = ({
  totalClients,
  upcomingSessions,
  unpaidInvoices,
  monthlyRevenue,
}: AdminSummaryProps) => {
  const { payments } = useData();
  const outstandingAmount = getOutstandingAmount(payments);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Clients */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
          <Users className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-700">{totalClients}</div>
          <p className="text-xs text-blue-600">+3 from last month</p>
        </CardContent>
      </Card>

      {/* Upcoming Sessions */}
      <Card className="border-green-200 bg-green-50/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Upcoming Sessions
          </CardTitle>
          <Calendar className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-700">
            {upcomingSessions}
          </div>
          <p className="text-xs text-green-600">Next 7 days</p>
        </CardContent>
      </Card>

      {/* Monthly Revenue */}
      <Card className="border-emerald-200 bg-emerald-50/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-emerald-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-700">
            ${monthlyRevenue}
          </div>
          <p className="text-xs text-emerald-600">+12% from last month</p>
        </CardContent>
      </Card>

      {/* Unpaid Invoices */}
      <Card className="border-orange-200 bg-orange-50/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Unpaid Invoices</CardTitle>
          <AlertTriangle className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-700">
            {unpaidInvoices}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-xs text-orange-600">
              ${outstandingAmount} outstanding
            </p>
            {unpaidInvoices > 0 && (
              <Badge variant="destructive" className="text-xs">
                Action Needed
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
