import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Star, 
  Target, 
  Heart, 
  Zap, 
  TrendingUp,
  Award,
  Crown,
  CheckCircle,
  Activity,
  Dumbbell,
  Users,
  Calendar,
  DollarSign
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface Achievement {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  gradient: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

interface MotivationalStats {
  totalClients: number;
  totalSessions: number;
  totalRevenue: number;
  streakDays: number;
  recentAchievements: Achievement[];
}

interface Session {
  id: string;
  clientId: string;
  date: string;
  status: string;
  cost: number;
}

const CreativeDashboard: React.FC<{ 
  stats: MotivationalStats;
  sessions: Session[];
}> = ({ stats, sessions }) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  // Define achievements based on stats
  const allAchievements: Achievement[] = [
    {
      id: 1,
      icon: <Users className="h-5 w-5" />,
      title: "First Client",
      description: "Welcome your first client to FitClient!",
      color: "bg-yellow-500",
      gradient: "from-yellow-400 to-orange-500",
      unlocked: stats.totalClients >= 1,
      progress: Math.min(stats.totalClients, 1),
      maxProgress: 1
    },
    {
      id: 2,
      icon: <Calendar className="h-5 w-5" />,
      title: "5 Sessions",
      description: "Completed 5 training sessions",
      color: "bg-blue-500",
      gradient: "from-blue-400 to-indigo-500",
      unlocked: stats.totalSessions >= 5,
      progress: Math.min(stats.totalSessions, 5),
      maxProgress: 5
    },
    {
      id: 3,
      icon: <Target className="h-5 w-5" />,
      title: "Goal Setter",
      description: "Set goals for 3 clients",
      color: "bg-green-500",
      gradient: "from-green-400 to-emerald-500",
      unlocked: stats.totalClients >= 3,
      progress: Math.min(stats.totalClients, 3),
      maxProgress: 3
    },
    {
      id: 4,
      icon: <DollarSign className="h-5 w-5" />,
      title: "Revenue Builder",
      description: "Earn $1000 in revenue",
      color: "bg-purple-500",
      gradient: "from-purple-400 to-violet-500",
      unlocked: stats.totalRevenue >= 1000,
      progress: Math.min(stats.totalRevenue, 1000),
      maxProgress: 1000
    },
    {
      id: 5,
      icon: <TrendingUp className="h-5 w-5" />,
      title: "Consistency King",
      description: "7-day activity streak",
      color: "bg-red-500",
      gradient: "from-red-400 to-pink-500",
      unlocked: stats.streakDays >= 7,
      progress: Math.min(stats.streakDays, 7),
      maxProgress: 7
    },
    {
      id: 6,
      icon: <Crown className="h-5 w-5" />,
      title: "Pro Trainer",
      description: "Manage 10+ clients",
      color: "bg-indigo-500",
      gradient: "from-indigo-400 to-purple-500",
      unlocked: stats.totalClients >= 10,
      progress: Math.min(stats.totalClients, 10),
      maxProgress: 10
    }
  ];

  // Check for newly unlocked achievements
  useEffect(() => {
    const newlyUnlocked = allAchievements.filter(achievement => 
      achievement.unlocked && 
      !achievements.find(a => a.id === achievement.id)?.unlocked
    );
    
    if (newlyUnlocked.length > 0) {
      setAchievements(prev => [...prev, ...newlyUnlocked]);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [stats, achievements, allAchievements]);

  // Energy colors for motivation
  const energyColors = {
    primary: "bg-gradient-to-r from-orange-500 to-red-500",
    secondary: "bg-gradient-to-r from-red-400 to-pink-500",
    accent: "bg-gradient-to-r from-pink-400 to-rose-500"
  };

  // Calm colors for trust
  const calmColors = {
    primary: "bg-gradient-to-r from-blue-500 to-indigo-500",
    secondary: "bg-gradient-to-r from-green-400 to-emerald-500",
    accent: "bg-gradient-to-r from-teal-400 to-cyan-500"
  };

  // Achievement colors
  const achievementColors = {
    primary: "bg-gradient-to-r from-yellow-400 to-orange-500",
    secondary: "bg-gradient-to-r from-purple-400 to-violet-500",
    accent: "bg-gradient-to-r from-indigo-400 to-purple-500"
  };

  // Calculate real business metrics with error handling
  const calculateBusinessMetrics = () => {
    try {
      // Client retention rate (clients with sessions in last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const recentSessions = sessions.filter(s => {
        try {
          return new Date(s.date) >= thirtyDaysAgo;
        } catch {
          return false;
        }
      });
      const activeClients = new Set(recentSessions.map(s => s.clientId)).size;
      const retentionRate = stats.totalClients > 0 ? Math.round((activeClients / stats.totalClients) * 100) : 0;

      // Average session completion rate
      const totalScheduled = sessions.filter(s => s.status === 'scheduled' || s.status === 'completed').length;
      const totalCompleted = sessions.filter(s => s.status === 'completed').length;
      const completionRate = totalScheduled > 0 ? Math.round((totalCompleted / totalScheduled) * 100) : 0;

      // Revenue growth (compare current month to previous month)
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const currentMonthSessions = sessions.filter(s => {
        try {
          const sessionDate = new Date(s.date);
          return sessionDate.getMonth() === currentMonth && sessionDate.getFullYear() === currentYear;
        } catch {
          return false;
        }
      });
      const currentMonthRevenue = currentMonthSessions.reduce((sum, s) => sum + (s.cost || 0), 0);

      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      const lastMonthSessions = sessions.filter(s => {
        try {
          const sessionDate = new Date(s.date);
          return sessionDate.getMonth() === lastMonth && sessionDate.getFullYear() === lastMonthYear;
        } catch {
          return false;
        }
      });
      const lastMonthRevenue = lastMonthSessions.reduce((sum, s) => sum + (s.cost || 0), 0);

      const revenueGrowth = lastMonthRevenue > 0 ? Math.round(((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100) : 0;

      // Average client value
      const totalRevenue = sessions.reduce((sum, s) => sum + (s.cost || 0), 0);
      const avgClientValue = stats.totalClients > 0 ? Math.round(totalRevenue / stats.totalClients) : 0;

      return {
        retentionRate,
        completionRate,
        revenueGrowth,
        avgClientValue,
        currentMonthRevenue,
        lastMonthRevenue
      };
    } catch (error) {
      console.error('Error calculating business metrics:', error);
      return {
        retentionRate: 0,
        completionRate: 0,
        revenueGrowth: 0,
        avgClientValue: 0,
        currentMonthRevenue: 0,
        lastMonthRevenue: 0
      };
    }
  };

  const businessMetrics = calculateBusinessMetrics();

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Motivational Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 touch-manipulation">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Clients</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.totalClients}</p>
              </div>
              <div className={`p-2 sm:p-3 rounded-full ${calmColors.primary} text-white`}>
                <Users className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4">
              <Progress value={Math.min((stats.totalClients / 10) * 100, 100)} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">Goal: 10 clients</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 touch-manipulation">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Sessions</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.totalSessions}</p>
              </div>
              <div className={`p-2 sm:p-3 rounded-full ${energyColors.primary} text-white`}>
                <Activity className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4">
              <Progress value={Math.min((stats.totalSessions / 50) * 100, 100)} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">Goal: 50 sessions</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 touch-manipulation">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">${stats.totalRevenue}</p>
              </div>
              <div className={`p-2 sm:p-3 rounded-full ${achievementColors.primary} text-white`}>
                <DollarSign className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4">
              <Progress value={Math.min((stats.totalRevenue / 1000) * 100, 100)} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">Goal: $1,000</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 touch-manipulation">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Streak</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.streakDays} days</p>
              </div>
              <div className={`p-2 sm:p-3 rounded-full ${energyColors.secondary} text-white`}>
                <Zap className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4">
              <Progress value={Math.min((stats.streakDays / 7) * 100, 100)} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">Goal: 7 days</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements Section */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
            Your Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {allAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-3 sm:p-4 rounded-lg border-2 transition-all duration-300 ${
                  achievement.unlocked 
                    ? 'border-green-200 bg-green-50 animate-pulseGlow' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className={`p-2 rounded-full ${achievement.unlocked ? achievement.color : 'bg-gray-300'} text-white flex-shrink-0`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-semibold text-sm sm:text-base ${achievement.unlocked ? 'text-gray-900' : 'text-gray-500'} truncate`}>
                      {achievement.title}
                    </h4>
                    <p className={`text-xs sm:text-sm ${achievement.unlocked ? 'text-gray-600' : 'text-gray-400'} line-clamp-2`}>
                      {achievement.description}
                    </p>
                    {achievement.progress !== undefined && achievement.maxProgress && (
                      <div className="mt-2">
                        <Progress 
                          value={(achievement.progress / achievement.maxProgress) * 100} 
                          className="h-1" 
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {achievement.progress}/{achievement.maxProgress}
                        </p>
                      </div>
                    )}
                  </div>
                  {achievement.unlocked && (
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Real Business Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Client Retention & Engagement */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-green-50">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-center gap-2 text-blue-800 text-sm sm:text-base">
              <Users className="h-4 w-4 sm:h-5 sm:w-5" />
              Client Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between p-2 sm:p-3 bg-white rounded-lg">
                <div className="min-w-0 flex-1">
                  <span className="text-xs sm:text-sm font-medium text-gray-700 block">Retention Rate</span>
                  <p className="text-xs text-gray-500">Last 30 days</p>
                </div>
                <div className="text-right ml-2">
                  <Badge className={`text-xs ${businessMetrics.retentionRate >= 80 ? 'bg-green-500' : businessMetrics.retentionRate >= 60 ? 'bg-yellow-500' : 'bg-red-500'} text-white`}>
                    {businessMetrics.retentionRate}%
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between p-2 sm:p-3 bg-white rounded-lg">
                <div className="min-w-0 flex-1">
                  <span className="text-xs sm:text-sm font-medium text-gray-700 block">Session Completion</span>
                  <p className="text-xs text-gray-500">Success rate</p>
                </div>
                <div className="text-right ml-2">
                  <Badge className={`text-xs ${businessMetrics.completionRate >= 90 ? 'bg-green-500' : businessMetrics.completionRate >= 75 ? 'bg-yellow-500' : 'bg-red-500'} text-white`}>
                    {businessMetrics.completionRate}%
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Performance */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-center gap-2 text-green-800 text-sm sm:text-base">
              <DollarSign className="h-4 w-4 sm:h-5 sm:w-5" />
              Revenue Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between p-2 sm:p-3 bg-white rounded-lg">
                <div className="min-w-0 flex-1">
                  <span className="text-xs sm:text-sm font-medium text-gray-700 block">Monthly Growth</span>
                  <p className="text-xs text-gray-500">vs last month</p>
                </div>
                <div className="text-right ml-2">
                  <Badge className={`text-xs ${businessMetrics.revenueGrowth > 0 ? 'bg-green-500' : businessMetrics.revenueGrowth < 0 ? 'bg-red-500' : 'bg-gray-500'} text-white`}>
                    {businessMetrics.revenueGrowth > 0 ? '+' : ''}{businessMetrics.revenueGrowth}%
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between p-2 sm:p-3 bg-white rounded-lg">
                <div className="min-w-0 flex-1">
                  <span className="text-xs sm:text-sm font-medium text-gray-700 block">Avg Client Value</span>
                  <p className="text-xs text-gray-500">Lifetime value</p>
                </div>
                <div className="text-right ml-2">
                  <Badge className="text-xs bg-blue-500 text-white">
                    ${businessMetrics.avgClientValue}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Business Health */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-indigo-50 md:col-span-2 lg:col-span-1">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-center gap-2 text-purple-800 text-sm sm:text-base">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
              Business Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between p-2 sm:p-3 bg-white rounded-lg">
                <div className="min-w-0 flex-1">
                  <span className="text-xs sm:text-sm font-medium text-gray-700 block">Current Month</span>
                  <p className="text-xs text-gray-500">Revenue</p>
                </div>
                <div className="text-right ml-2">
                  <Badge className="text-xs bg-purple-500 text-white">
                    ${businessMetrics.currentMonthRevenue}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between p-2 sm:p-3 bg-white rounded-lg">
                <div className="min-w-0 flex-1">
                  <span className="text-xs sm:text-sm font-medium text-gray-700 block">Last Month</span>
                  <p className="text-xs text-gray-500">Revenue</p>
                </div>
                <div className="text-right ml-2">
                  <Badge className="text-xs bg-indigo-500 text-white">
                    ${businessMetrics.lastMonthRevenue}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: ['#fbbf24', '#ef4444', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'][Math.floor(Math.random() * 6)],
                width: Math.random() * 8 + 4,
                height: Math.random() * 8 + 4,
                borderRadius: '50%',
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: '3s',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CreativeDashboard; 