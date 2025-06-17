import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Trophy,
  Star,
  Zap,
  TrendingUp,
  Target,
  Award,
  Crown,
  Sparkles,
  MessageSquare,
} from "lucide-react";
import { StreakTracker } from "./StreakTracker";
import { BadgeCollection } from "./BadgeCollection";
import {
  calculateGamificationData,
  generateCelebrationMessage,
  type GamificationData,
} from "@/lib/gamification";
import { Client } from "@/lib/types";

interface GamificationDashboardProps {
  client: Client;
  variant?: "full" | "summary" | "widget";
  showCelebrations?: boolean;
  onSendCelebration?: (message: string) => void;
}

export const GamificationDashboard = ({
  client,
  variant = "full",
  showCelebrations = true,
  onSendCelebration,
}: GamificationDashboardProps) => {
  const [gamificationData, setGamificationData] =
    useState<GamificationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to get gamification data
    setTimeout(() => {
      const data = calculateGamificationData(client, [], []);
      setGamificationData(data);
      setLoading(false);
    }, 500);
  }, [client]);

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <p className="text-sm">Loading gamification data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!gamificationData) {
    return null;
  }

  if (variant === "widget") {
    return <GamificationWidget data={gamificationData} />;
  }

  if (variant === "summary") {
    return (
      <GamificationSummary
        data={gamificationData}
        showCelebrations={showCelebrations}
        onSendCelebration={onSendCelebration}
      />
    );
  }

  return (
    <GamificationFullDashboard
      data={gamificationData}
      showCelebrations={showCelebrations}
      onSendCelebration={onSendCelebration}
    />
  );
};

const GamificationWidget = ({ data }: { data: GamificationData }) => {
  const activeStreaks = data.currentStreaks.filter((s) => s.isActive);
  const recentBadges = data.badges.filter((b) => b.isUnlocked).slice(0, 3);

  return (
    <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Trophy className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="font-medium">Level {data.level}</p>
              <p className="text-sm text-muted-foreground">
                {activeStreaks.length} active streaks
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-yellow-100 text-yellow-800">
              {data.stats.badgesEarned} badges
            </Badge>
            <div className="flex -space-x-1">
              {recentBadges.map((badge) => (
                <div
                  key={badge.id}
                  className="w-6 h-6 bg-white rounded-full border-2 border-white flex items-center justify-center text-xs"
                >
                  {badge.icon}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const GamificationSummary = ({
  data,
  showCelebrations,
  onSendCelebration,
}: {
  data: GamificationData;
  showCelebrations: boolean;
  onSendCelebration?: (message: string) => void;
}) => {
  return (
    <div className="space-y-6">
      {/* Level & XP Overview */}
      <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-none">
        <CardContent className="pt-6">
          <div className="text-center space-y-3">
            <Crown className="h-12 w-12 mx-auto" />
            <div>
              <h2 className="text-2xl font-bold">Level {data.level}</h2>
              <p className="text-indigo-100">{data.totalXP} Total XP</p>
            </div>
            <div className="flex justify-center gap-4">
              <div className="text-center">
                <div className="text-xl font-bold">
                  {data.currentStreaks.filter((s) => s.isActive).length}
                </div>
                <p className="text-xs text-indigo-200">Active Streaks</p>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold">
                  {data.badges.filter((b) => b.isUnlocked).length}
                </div>
                <p className="text-xs text-indigo-200">Badges Earned</p>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold">
                  {data.stats.totalSessions}
                </div>
                <p className="text-xs text-indigo-200">Total Sessions</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Achievements with Celebration */}
      {showCelebrations && data.recentAchievements.length > 0 && (
        <CelebrationCard
          achievements={data.recentAchievements}
          onSendCelebration={onSendCelebration}
        />
      )}

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<Zap className="h-5 w-5 text-orange-600" />}
          title="Longest Streak"
          value={data.stats.longestStreak}
          suffix="days"
        />
        <StatCard
          icon={<Target className="h-5 w-5 text-blue-600" />}
          title="Sessions"
          value={data.stats.totalSessions}
          suffix="completed"
        />
        <StatCard
          icon={<TrendingUp className="h-5 w-5 text-green-600" />}
          title="Weight Lost"
          value={data.stats.totalWeightLoss}
          suffix="lbs"
        />
        <StatCard
          icon={<Award className="h-5 w-5 text-purple-600" />}
          title="Badges"
          value={data.stats.badgesEarned}
          suffix="earned"
        />
      </div>

      {/* Streaks & Badges Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StreakTracker streaks={data.currentStreaks} variant="card" />
        <BadgeCollection
          badges={data.badges}
          recentAchievements={data.recentAchievements}
          variant="card"
        />
      </div>
    </div>
  );
};

const GamificationFullDashboard = ({
  data,
  showCelebrations,
  onSendCelebration,
}: {
  data: GamificationData;
  showCelebrations: boolean;
  onSendCelebration?: (message: string) => void;
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-none">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Crown className="h-12 w-12" />
              <div>
                <h2 className="text-2xl font-bold">
                  {data.clientName} - Level {data.level}
                </h2>
                <p className="text-indigo-100">
                  {data.totalXP} XP • Fitness Journey Progress
                </p>
              </div>
            </div>
            <Badge className="bg-white text-indigo-600">
              <Sparkles className="h-3 w-3 mr-1" />
              Gamified Experience
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Celebrations */}
      {showCelebrations && data.recentAchievements.length > 0 && (
        <CelebrationCard
          achievements={data.recentAchievements}
          onSendCelebration={onSendCelebration}
        />
      )}

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard
          icon={<Trophy className="h-5 w-5 text-yellow-600" />}
          title="Level"
          value={data.level}
          suffix=""
        />
        <StatCard
          icon={<Zap className="h-5 w-5 text-orange-600" />}
          title="Longest Streak"
          value={data.stats.longestStreak}
          suffix="days"
        />
        <StatCard
          icon={<Target className="h-5 w-5 text-blue-600" />}
          title="Sessions"
          value={data.stats.totalSessions}
          suffix=""
        />
        <StatCard
          icon={<TrendingUp className="h-5 w-5 text-green-600" />}
          title="Weight Lost"
          value={data.stats.totalWeightLoss}
          suffix="lbs"
        />
        <StatCard
          icon={<Award className="h-5 w-5 text-purple-600" />}
          title="Badges"
          value={data.stats.badgesEarned}
          suffix=""
        />
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="streaks">Streaks</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <StreakTracker
              streaks={data.currentStreaks}
              variant="detailed"
              showCelebration={showCelebrations}
            />
            <BadgeCollection
              badges={data.badges}
              recentAchievements={data.recentAchievements}
              variant="showcase"
            />
          </div>
        </TabsContent>

        <TabsContent value="streaks" className="space-y-6">
          <StreakTracker
            streaks={data.currentStreaks}
            variant="detailed"
            showCelebration={showCelebrations}
          />
        </TabsContent>

        <TabsContent value="badges" className="space-y-6">
          <BadgeCollection
            badges={data.badges}
            recentAchievements={data.recentAchievements}
            variant="grid"
            showProgress={true}
          />
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <AchievementHistory achievements={data.recentAchievements} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const StatCard = ({
  icon,
  title,
  value,
  suffix,
}: {
  icon: React.ReactNode;
  title: string;
  value: number;
  suffix: string;
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-2">
          {icon}
          <span className="text-sm font-medium">{title}</span>
        </div>
        <div className="text-2xl font-bold">{value}</div>
        {suffix && <p className="text-xs text-muted-foreground">{suffix}</p>}
      </CardContent>
    </Card>
  );
};

const CelebrationCard = ({
  achievements,
  onSendCelebration,
}: {
  achievements: any[];
  onSendCelebration?: (message: string) => void;
}) => {
  const latestAchievement = achievements[0];

  const handleSendCelebration = () => {
    const message = generateCelebrationMessage(latestAchievement);
    onSendCelebration?.(message);
  };

  return (
    <Card className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-none">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-4xl">{latestAchievement.icon}</div>
            <div>
              <h3 className="text-xl font-bold">
                🎉 {latestAchievement.title} 🎉
              </h3>
              <p className="text-yellow-100">{latestAchievement.description}</p>
              <Badge className="bg-white text-orange-600 mt-2">
                +{latestAchievement.xpEarned} XP Earned
              </Badge>
            </div>
          </div>
          {onSendCelebration && (
            <Button
              onClick={handleSendCelebration}
              variant="secondary"
              className="bg-white text-orange-600 hover:bg-orange-50"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Send Celebration
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const AchievementHistory = ({ achievements }: { achievements: any[] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          Achievement History
        </CardTitle>
        <CardDescription>Your recent accomplishments</CardDescription>
      </CardHeader>
      <CardContent>
        {achievements.length > 0 ? (
          <div className="space-y-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className="flex items-center gap-4 p-4 border rounded-lg"
              >
                <div className="text-2xl">{achievement.icon}</div>
                <div className="flex-1">
                  <h4 className="font-medium">{achievement.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {achievement.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(achievement.achievedDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <Badge className="bg-yellow-100 text-yellow-800">
                    +{achievement.xpEarned} XP
                  </Badge>
                  {achievement.isNew && (
                    <p className="text-xs text-orange-600 font-medium mt-1">
                      NEW!
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No achievements yet</p>
            <p className="text-sm text-muted-foreground">
              Keep working out to earn your first achievement!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
