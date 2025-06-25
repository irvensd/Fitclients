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
import { useState, useEffect } from "react";
import { 
  TrendingUp, 
  Users, 
  Activity, 
  Calendar,
  Dumbbell,
  Heart,
  Target,
  Zap,
  Trophy,
  Star
} from "lucide-react";

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
      { name: "Personal Training", value: 0, color: "#16a34a", icon: "💪" },
      { name: "Assessment", value: 0, color: "#2563eb", icon: "📊" },
      { name: "Consultation", value: 0, color: "#dc2626", icon: "💬" },
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
      icon: "💪",
    },
    {
      name: "Assessment",
      value: sessionCounts["Assessment"] || 0,
      color: "#2563eb",
      icon: "📊",
    },
    {
      name: "Consultation",
      value: sessionCounts["Consultation"] || 0,
      color: "#dc2626",
      icon: "💬",
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

// Animated Progress Bar Component
const AnimatedProgressBar = ({ value, max, label, icon, color }: { 
  value: number; 
  max: number; 
  label: string; 
  icon: React.ReactNode; 
  color: string; 
}) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const percentage = Math.min((value / max) * 100, 100);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(percentage);
    }, 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="text-lg animate-pulse">{icon}</div>
          <span className="font-medium text-sm">{label}</span>
        </div>
        <span className="text-sm font-bold" style={{ color }}>
          {value}/{max}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden progress-bar-container">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out animate-progressFill"
          style={{
            width: `${animatedValue}%`,
            backgroundColor: color,
            backgroundImage: `linear-gradient(90deg, ${color} 0%, ${color}88 100%)`,
            '--progress-width': `${animatedValue}%`,
          } as React.CSSProperties}
        />
      </div>
    </div>
  );
};

// Progress Tree Component
const ProgressTree = ({ achievements }: { achievements: Array<{ name: string; unlocked: boolean; icon: string }> }) => {
  return (
    <div className="flex flex-col items-center space-y-4">
      {achievements.map((achievement, index) => (
        <div key={index} className="flex items-center">
          <div className={`text-2xl transition-all duration-500 achievement-tree-item ${
            achievement.unlocked ? 'animate-achievementUnlock' : 'opacity-30'
          }`}>
            {achievement.icon}
          </div>
          {index < achievements.length - 1 && (
            <div className={`w-0.5 h-8 mx-2 transition-all duration-500 achievement-tree-line ${
              achievement.unlocked ? 'bg-green-400' : 'bg-gray-300'
            }`} />
          )}
        </div>
      ))}
    </div>
  );
};

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded-lg shadow-lg chart-tooltip">
        <p className="font-medium text-gray-900">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const RevenueChart = () => {
  const { payments } = useData();
  const data = generateRevenueData(payments);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const totalRevenue = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const monthlyGoal = 5000; // Example goal

  return (
    <Card className="overflow-hidden chart-card animate-chartEntrance">
      <CardHeader className="pb-3">
        <CardTitle className="text-base sm:text-lg flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-600 animate-pulse" />
          Revenue Trend
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="mb-4">
          <AnimatedProgressBar
            value={totalRevenue}
            max={monthlyGoal}
            label="Monthly Revenue Goal"
            icon="💰"
            color="#16a34a"
          />
        </div>
        <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16a34a" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#16a34a" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#16a34a"
              fill="url(#revenueGradient)"
              strokeWidth={3}
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
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const clientGoal = 50; // Example goal
  const achievements = [
    { name: "First Client", unlocked: clients.length >= 1, icon: "👤" },
    { name: "10 Clients", unlocked: clients.length >= 10, icon: "👥" },
    { name: "25 Clients", unlocked: clients.length >= 25, icon: "🏆" },
    { name: "50 Clients", unlocked: clients.length >= 50, icon: "🌟" },
  ];

  return (
    <Card className="overflow-hidden chart-card animate-chartEntrance">
      <CardHeader className="pb-3">
        <CardTitle className="text-base sm:text-lg flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-600 animate-pulse" />
          Client Growth
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="mb-4">
          <AnimatedProgressBar
            value={clients.length}
            max={clientGoal}
            label="Client Growth Goal"
            icon="👥"
            color="#2563eb"
          />
        </div>
        <ResponsiveContainer width="100%" height={200} className="sm:h-[250px]">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Line
              type="monotone"
              dataKey="totalClients"
              stroke="#2563eb"
              strokeWidth={3}
              name="Total Clients"
              dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#2563eb', strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="newClients"
              stroke="#16a34a"
              strokeWidth={2}
              strokeDasharray="5 5"
              name="New Clients"
              dot={{ fill: '#16a34a', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#16a34a', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-4 pt-4 border-t">
          <p className="text-sm font-medium mb-2 text-center">Achievement Tree</p>
          <ProgressTree achievements={achievements} />
        </div>
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

  const totalSessions = sessions.length;
  const sessionGoal = 100; // Example goal

  return (
    <Card className="overflow-hidden chart-card animate-chartEntrance">
      <CardHeader className="pb-3">
        <CardTitle className="text-base sm:text-lg flex items-center gap-2">
          <Dumbbell className="h-5 w-5 text-green-600 animate-pulse" />
          Session Distribution
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="mb-4">
          <AnimatedProgressBar
            value={totalSessions}
            max={sessionGoal}
            label="Total Sessions Goal"
            icon="💪"
            color="#16a34a"
          />
        </div>
        <ResponsiveContainer width="100%" height={200} className="sm:h-[250px]">
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
            <Tooltip content={<CustomTooltip />} />
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

  const weeklyGoal = 20; // Example goal
  const weeklySessions = data.reduce((sum, day) => sum + day.sessions, 0);

  return (
    <Card className="overflow-hidden chart-card animate-chartEntrance">
      <CardHeader className="pb-3">
        <CardTitle className="text-base sm:text-lg flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600 animate-pulse" />
          Weekly Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="mb-4">
          <AnimatedProgressBar
            value={weeklySessions}
            max={weeklyGoal}
            label="Weekly Sessions Goal"
            icon="📅"
            color="#2563eb"
          />
        </div>
        <ResponsiveContainer width="100%" height={200} className="sm:h-[250px]">
          <BarChart data={data}>
            <defs>
              <linearGradient id="sessionsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0.3}/>
              </linearGradient>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16a34a" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#16a34a" stopOpacity={0.3}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" fontSize={12} />
            <YAxis yAxisId="left" fontSize={12} />
            <YAxis yAxisId="right" orientation="right" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Bar
              yAxisId="left"
              dataKey="sessions"
              fill="url(#sessionsGradient)"
              name="Sessions"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              yAxisId="right"
              dataKey="revenue"
              fill="url(#revenueGradient)"
              name="Revenue ($)"
              radius={[4, 4, 0, 0]}
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
