import React from 'react';
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
  Calendar,
  DollarSign
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateJoined: string;
  fitnessLevel: "beginner" | "intermediate" | "advanced";
  goals: string;
  notes?: string;
  avatar?: string;
}

interface ClientStats {
  totalSessions: number;
  completedSessions: number;
  totalSpent: number;
  lastSession?: string;
  progressPercentage: number;
}

interface CreativeClientCardProps {
  client: Client;
  stats: ClientStats;
  onClientClick?: () => void;
}

const CreativeClientCard: React.FC<CreativeClientCardProps> = ({ 
  client, 
  stats, 
  onClientClick 
}) => {
  // Determine client achievement level based on stats
  const getAchievementLevel = () => {
    if (stats.completedSessions >= 20) return { level: 'Elite', icon: <Crown className="h-4 w-4" />, color: 'bg-purple-500' };
    if (stats.completedSessions >= 10) return { level: 'Pro', icon: <Trophy className="h-4 w-4" />, color: 'bg-yellow-500' };
    if (stats.completedSessions >= 5) return { level: 'Active', icon: <Star className="h-4 w-4" />, color: 'bg-blue-500' };
    if (stats.completedSessions >= 1) return { level: 'New', icon: <Target className="h-4 w-4" />, color: 'bg-green-500' };
    return { level: 'Prospect', icon: <Heart className="h-4 w-4" />, color: 'bg-gray-500' };
  };

  const achievement = getAchievementLevel();

  // Color psychology based on fitness level
  const getFitnessLevelColors = () => {
    switch (client.fitnessLevel) {
      case 'beginner':
        return {
          bg: 'bg-gradient-to-br from-green-50 to-blue-50',
          border: 'border-green-200',
          text: 'text-green-700',
          icon: <Target className="h-4 w-4" />
        };
      case 'intermediate':
        return {
          bg: 'bg-gradient-to-br from-blue-50 to-purple-50',
          border: 'border-blue-200',
          text: 'text-blue-700',
          icon: <Activity className="h-4 w-4" />
        };
      case 'advanced':
        return {
          bg: 'bg-gradient-to-br from-purple-50 to-red-50',
          border: 'border-purple-200',
          text: 'text-purple-700',
          icon: <Zap className="h-4 w-4" />
        };
      default:
        return {
          bg: 'bg-gradient-to-br from-gray-50 to-gray-100',
          border: 'border-gray-200',
          text: 'text-gray-700',
          icon: <Heart className="h-4 w-4" />
        };
    }
  };

  const fitnessColors = getFitnessLevelColors();

  // Motivation indicators with error handling
  const getMotivationLevel = () => {
    try {
      const timeDiff = Date.now() - new Date(client.dateJoined).getTime();
      const weeksSinceJoined = Math.max(1, Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 7)));
      const sessionRate = stats.totalSessions / weeksSinceJoined;
      
      if (sessionRate >= 2) return { level: 'High', color: 'bg-green-500', text: 'Very Motivated' };
      if (sessionRate >= 1) return { level: 'Medium', color: 'bg-yellow-500', text: 'Motivated' };
      return { level: 'Low', color: 'bg-red-500', text: 'Needs Motivation' };
    } catch (error) {
      console.error('Error calculating motivation level:', error);
      return { level: 'Low', color: 'bg-gray-500', text: 'Unknown' };
    }
  };

  const motivation = getMotivationLevel();

  // Safe date formatting
  const formatLastSession = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Unknown';
    }
  };

  return (
    <Card 
      className={`${fitnessColors.bg} ${fitnessColors.border} border-2 hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer touch-manipulation`}
      onClick={onClientClick}
    >
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-start justify-between mb-2 sm:mb-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
              <AvatarImage src={client.avatar} />
              <AvatarFallback className="bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold text-xs sm:text-sm">
                {client.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{client.name}</h3>
              <p className="text-xs sm:text-sm text-gray-600 truncate">{client.email}</p>
            </div>
          </div>
          <div className={`${achievement.color} text-white p-1.5 sm:p-2 rounded-full flex-shrink-0`}>
            {achievement.icon}
          </div>
        </div>

        {/* Achievement Badge */}
        <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3 flex-wrap">
          <Badge className={`${achievement.color} text-white text-xs`}>
            {achievement.level}
          </Badge>
          <Badge className={`${motivation.color} text-white text-xs`}>
            {motivation.text}
          </Badge>
        </div>

        {/* Fitness Level Indicator */}
        <div className="flex items-center gap-2 mb-2 sm:mb-3 p-2 bg-white/50 rounded-lg">
          <div className={`${fitnessColors.text} flex-shrink-0`}>
            {fitnessColors.icon}
          </div>
          <span className={`text-xs sm:text-sm font-medium ${fitnessColors.text} truncate`}>
            {client.fitnessLevel.charAt(0).toUpperCase() + client.fitnessLevel.slice(1)}
          </span>
        </div>

        {/* Progress Visualization */}
        <div className="mb-2 sm:mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-600">Progress</span>
            <span className="text-xs text-gray-500">{stats.progressPercentage}%</span>
          </div>
          <Progress value={stats.progressPercentage} className="h-2" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-1 sm:gap-2 text-center">
          <div className="p-1.5 sm:p-2 bg-white/50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Calendar className="h-3 w-3 text-blue-500" />
            </div>
            <p className="text-xs font-semibold text-gray-900">{stats.totalSessions}</p>
            <p className="text-xs text-gray-500">Sessions</p>
          </div>
          
          <div className="p-1.5 sm:p-2 bg-white/50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <CheckCircle className="h-3 w-3 text-green-500" />
            </div>
            <p className="text-xs font-semibold text-gray-900">{stats.completedSessions}</p>
            <p className="text-xs text-gray-500">Completed</p>
          </div>
          
          <div className="p-1.5 sm:p-2 bg-white/50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <DollarSign className="h-3 w-3 text-yellow-500" />
            </div>
            <p className="text-xs font-semibold text-gray-900">${stats.totalSpent}</p>
            <p className="text-xs text-gray-500">Spent</p>
          </div>
        </div>

        {/* Goals Preview */}
        {client.goals && (
          <div className="mt-2 sm:mt-3 p-2 bg-white/50 rounded-lg">
            <p className="text-xs text-gray-600 line-clamp-2">
              <span className="font-medium">Goal:</span> {client.goals}
            </p>
          </div>
        )}

        {/* Last Session Info */}
        {stats.lastSession && (
          <div className="mt-2 text-xs text-gray-500">
            Last session: {formatLastSession(stats.lastSession)}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CreativeClientCard; 