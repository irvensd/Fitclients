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

// Generate client growth data from real clients
const generateClientGrowthData = (clients: Client[]) => {
  const months = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const now = new Date();

  if (clients.length === 0) {
    return months.map((month) => ({
      month,
      totalClients: 0,
      newClients: 0,
    }));
  }

  let runningTotal = 0;
  return months.map((month, index) => {
    const monthNum = now.getMonth() - 5 + index;
    const year = now.getFullYear() + (monthNum < 0 ? -1 : 0);
    const adjustedMonth = monthNum < 0 ? 12 + monthNum : monthNum;

    const newClientsThisMonth = clients.filter((client) => {
      const joinDate = new Date(client.dateJoined);
      return (
        joinDate.getMonth() === adjustedMonth && joinDate.getFullYear() === year
      );
    }).length;

    runningTotal += newClientsThisMonth;

    return {
      month,
      totalClients: runningTotal,
      newClients: newClientsThisMonth,
    };
  });
};

// Generate session type distribution from real sessions
const generateSessionTypeData = (sessions: Session[]) => {
  if (sessions.length === 0) {
    return [
      { name: "Personal Training", value: 0, color: "#16a34a" },
      { name: "Assessment", value: 0, color: "#2563eb" },
      { name: "Consultation", value: 0, color: "#dc2626" },
    ];
  }

  const sessionCounts = sessions.reduce(
    (acc, session) => {
      const type = session.type.replace("-", " ");
      const typeName = type.charAt(0).toUpperCase() + type.slice(1);
      acc[typeName] = (acc[typeName] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return [
    {
      name: "Personal Training",
      value: sessionCounts["Personal training"] || 0,
      color: "#16a34a",
    },
    {
      name: "Assessment",
      value: sessionCounts["Assessment"] || 0,
      color: "#2563eb",
    },
    {
      name: "Consultation",
      value: sessionCounts["Consultation"] || 0,
      color: "#dc2626",
    },
  ];
};

// Generate weekly session distribution from real sessions
const generateWeeklySessionData = (sessions: Session[]) => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  if (sessions.length === 0) {
    return days.map((day) => ({
      day,
      sessions: 0,
      revenue: 0,
    }));
  }

  return days.map((day, dayIndex) => {
    const sessionsToday = sessions.filter((session) => {
      const sessionDate = new Date(session.date);
      return sessionDate.getDay() === dayIndex; // 0 = Sunday, 1 = Monday, etc.
    });

    const revenueToday = sessionsToday
      .filter((session) => session.status === "completed")
      .reduce((total, session) => total + session.cost, 0);

    return {
      day,
      sessions: sessionsToday.length,
      revenue: revenueToday,
    };
  });
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
  const { clients } = useData();
  const data = generateClientGrowthData(clients);

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
  const { sessions } = useData();
  const data = generateSessionTypeData(sessions);

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
              label={({ name, percent }) =>
                data.some((d) => d.value > 0)
                  ? `${name} ${percent.toFixed(0)}%`
                  : ""
              }
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
        {sessions.length === 0 && (
          <div className="text-center text-muted-foreground text-sm mt-4">
            No sessions yet. Add your first session to see distribution.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const WeeklyActivityChart = () => {
  const { sessions } = useData();
  const data = generateWeeklySessionData(sessions);

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
        {sessions.length === 0 && (
          <div className="text-center text-muted-foreground text-sm mt-4">
            No sessions yet. Schedule sessions to see weekly patterns.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
