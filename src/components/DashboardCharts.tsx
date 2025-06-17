import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useData } from "@/contexts/DataContext";
import { Client, Session, Payment } from "@/lib/types";

// Generate revenue data for the last 6 months from real payments
const generateRevenueData = (payments: Payment[]) => {
  const months = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const now = new Date();

  if (payments.length === 0) {
    // Return zeros for new accounts
    return months.map((month) => ({
      month,
      revenue: 0,
      sessions: 0,
    }));
  }

  return months.map((month, index) => {
    const monthNum = now.getMonth() - 5 + index;
    const year = now.getFullYear() + (monthNum < 0 ? -1 : 0);
    const adjustedMonth = monthNum < 0 ? 12 + monthNum : monthNum;

    const monthlyRevenue = payments
      .filter((payment) => {
        const paymentDate = new Date(payment.date);
        return (
          paymentDate.getMonth() === adjustedMonth &&
          paymentDate.getFullYear() === year &&
          payment.status === "completed"
        );
      })
      .reduce((total, payment) => total + payment.amount, 0);

    return {
      month,
      revenue: monthlyRevenue,
      sessions: Math.floor(monthlyRevenue / 75), // Estimate sessions based on average cost
    };
  });
};

// Generate client growth data
const generateClientGrowthData = () => {
  const months = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let total = 15;
  return months.map((month) => {
    total += Math.floor(Math.random() * 3) + 1;
    return {
      month,
      totalClients: total,
      newClients: Math.floor(Math.random() * 4) + 1,
    };
  });
};

// Generate session type distribution
const generateSessionTypeData = () => {
  const types = ["Personal Training", "Assessment", "Consultation"];
  return types.map((type, index) => ({
    name: type,
    value: [45, 30, 25][index],
    color: ["#16a34a", "#2563eb", "#dc2626"][index],
  }));
};

// Generate weekly session distribution
const generateWeeklySessionData = () => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return days.map((day) => ({
    day,
    sessions: Math.floor(Math.random() * 8) + 2,
    revenue: Math.floor(Math.random() * 600) + 200,
  }));
};

export const RevenueChart = () => {
  const { payments } = useData();
  const data = generateRevenueData(payments);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value, name) => [`$${value}`, "Revenue"]} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#16a34a"
              fill="#16a34a"
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export const ClientGrowthChart = () => {
  const data = generateClientGrowthData();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Client Growth</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="totalClients"
              stroke="#2563eb"
              strokeWidth={3}
              name="Total Clients"
            />
            <Line
              type="monotone"
              dataKey="newClients"
              stroke="#16a34a"
              strokeWidth={2}
              strokeDasharray="5 5"
              name="New Clients"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export const SessionTypeChart = () => {
  const data = generateSessionTypeData();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Session Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${percent.toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export const WeeklyActivityChart = () => {
  const data = generateWeeklySessionData();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="sessions"
              fill="#2563eb"
              name="Sessions"
            />
            <Bar
              yAxisId="right"
              dataKey="revenue"
              fill="#16a34a"
              name="Revenue ($)"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
