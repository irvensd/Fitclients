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

// Helper to get the last 6 months dynamically
const getLastSixMonths = () => {
  const months = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      name: d.toLocaleString('default', { month: 'short' }),
      month: d.getMonth(),
      year: d.getFullYear(),
    });
  }
  return months;
};

// Generate revenue data for the last 6 months from real payments
const generateRevenueData = (payments: Payment[]) => {
  const sixMonths = getLastSixMonths();
  
  if (payments.length === 0) {
    return sixMonths.map(m => ({ month: m.name, revenue: 0, sessions: 0 }));
  }

  return sixMonths.map(m => {
    const monthlyRevenue = payments
      .filter(p => {
        const paymentDate = new Date(p.date);
        return paymentDate.getMonth() === m.month && paymentDate.getFullYear() === m.year && p.status === 'completed';
      })
      .reduce((total, p) => total + p.amount, 0);

    return {
      month: m.name,
      revenue: monthlyRevenue,
      sessions: Math.floor(monthlyRevenue / 75), // Estimate sessions
    };
  });
};

// Generate client growth data from real clients
const generateClientGrowthData = (clients: Client[]) => {
  const sixMonths = getLastSixMonths();

  if (clients.length === 0) {
    return sixMonths.map(m => ({ month: m.name, totalClients: 0, newClients: 0 }));
  }

  // First, get the total number of clients before the 6-month window
  const sixMonthsAgo = new Date(sixMonths[0].year, sixMonths[0].month, 1);
  let runningTotal = clients.filter(c => new Date(c.dateJoined) < sixMonthsAgo).length;

  return sixMonths.map(m => {
    const newClientsThisMonth = clients.filter(c => {
      const joinDate = new Date(c.dateJoined);
      return joinDate.getMonth() === m.month && joinDate.getFullYear() === m.year;
    }).length;

    runningTotal += newClientsThisMonth;

    return {
      month: m.name,
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
      <CardHeader className="pb-3">
        <CardTitle className="text-base sm:text-lg">Revenue Trend</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" fontSize={12} />
            <YAxis fontSize={12} />
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
      <CardHeader className="pb-3">
        <CardTitle className="text-base sm:text-lg">Client Growth</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
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

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // Position label outside for small slices
    const labelRadius = outerRadius + 20;
    const lx = cx + labelRadius * Math.cos(-midAngle * RADIAN);
    const ly = cy + labelRadius * Math.sin(-midAngle * RADIAN);
    
    // Line from slice to label
    const lineStartX = cx + (outerRadius + 5) * Math.cos(-midAngle * RADIAN);
    const lineStartY = cy + (outerRadius + 5) * Math.sin(-midAngle * RADIAN);

    if (percent === 0) return null;

    if (percent < 0.1) {
      return (
        <>
          <path d={`M${lineStartX},${lineStartY}L${lx},${ly}`} stroke="#666" fill="none" />
          <text x={lx} y={ly} textAnchor={lx > cx ? 'start' : 'end'} dominantBaseline="central" fill="#333" fontSize={10}>
            {`${name} ${(percent * 100).toFixed(0)}%`}
          </text>
        </>
      );
    }
    
    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight="bold">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base sm:text-lg">Session Distribution</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
          <PieChart margin={{ top: 20, right: 30, left: 30, bottom: 20 }}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={60}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value, name) => [value, name]} />
            <Legend wrapperStyle={{ fontSize: '11px' }}/>
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
      <CardHeader className="pb-3">
        <CardTitle className="text-base sm:text-lg">Weekly Activity</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" fontSize={12} />
            <YAxis yAxisId="left" fontSize={12} />
            <YAxis yAxisId="right" orientation="right" fontSize={12} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
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
