import { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Flame,
  Trophy,
  Target,
  Calendar,
  Zap,
  TrendingUp,
  Star,
  ChevronRight,
} from "lucide-react";
import {
  Streak,
  getStreakEmoji,
  getNextStreakMilestone,
} from "@/lib/gamification";

interface StreakTrackerProps {
  streaks: Streak[];
  variant?: "card" | "widget" | "detailed";
  showCelebration?: boolean;
}

export const StreakTracker = ({
  streaks,
  variant = "card",
  showCelebration = false,
}: StreakTrackerProps) => {
  const [selectedStreak, setSelectedStreak] = useState<Streak | null>(null);
  const activeStreaks = streaks.filter((s) => s.isActive);
  const totalStreaks = streaks.length;

  if (variant === "widget") {
    return <StreakWidget activeStreaks={activeStreaks} />;
  }

  if (variant === "detailed") {
    return (
      <StreakDetailedView streaks={streaks} showCelebration={showCelebration} />
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" />
            <CardTitle>Active Streaks</CardTitle>
          </div>
          <Badge className="bg-orange-100 text-orange-800">
            {activeStreaks.length} active
          </Badge>
        </div>
        <CardDescription>
          Keep the momentum going with your current streaks!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeStreaks.length > 0 ? (
          activeStreaks.map((streak) => (
            <StreakCard
              key={streak.id}
              streak={streak}
              onClick={() => setSelectedStreak(streak)}
            />
          ))
        ) : (
          <div className="text-center py-6">
            <Flame className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No active streaks</p>
            <p className="text-sm text-muted-foreground">
              Complete a workout to start your first streak!
            </p>
          </div>
        )}

        {selectedStreak && (
          <StreakDetailDialog
            streak={selectedStreak}
            onClose={() => setSelectedStreak(null)}
          />
        )}
      </CardContent>
    </Card>
  );
};

const StreakWidget = ({ activeStreaks }: { activeStreaks: Streak[] }) => {
  const topStreak = activeStreaks.reduce(
    (max, streak) => (streak.currentCount > max.currentCount ? streak : max),
    activeStreaks[0] || { currentCount: 0, title: "No streaks", icon: "🌱" },
  );

  return (
    <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{topStreak.icon || "🔥"}</div>
            <div>
              <p className="font-semibold">
                {topStreak.currentCount > 0
                  ? `${topStreak.currentCount} Day Streak!`
                  : "Start Your Streak"}
              </p>
              <p className="text-sm text-muted-foreground">
                {topStreak.title || "Complete a workout"}
              </p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );
};

const StreakCard = ({
  streak,
  onClick,
}: {
  streak: Streak;
  onClick: () => void;
}) => {
  const nextMilestone = getNextStreakMilestone(streak.currentCount);
  const progressToNext = Math.min(
    100,
    (streak.currentCount / nextMilestone) * 100,
  );

  return (
    <div
      className="p-4 border rounded-lg cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{getStreakEmoji(streak.currentCount)}</div>
          <div>
            <h4 className="font-medium">{streak.title}</h4>
            <p className="text-sm text-muted-foreground">
              {streak.description}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-orange-600">
            {streak.currentCount}
          </div>
          <p className="text-xs text-muted-foreground">
            Best: {streak.bestCount}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span>Progress to {nextMilestone} days</span>
          <span>
            {streak.currentCount}/{nextMilestone}
          </span>
        </div>
        <Progress value={progressToNext} className="h-2" />
      </div>

      {streak.isActive && (
        <div className="mt-2 flex items-center gap-2">
          <Badge className="bg-green-100 text-green-800" size="sm">
            <Zap className="h-3 w-3 mr-1" />
            Active
          </Badge>
          <span className="text-xs text-muted-foreground">Keep it going!</span>
        </div>
      )}
    </div>
  );
};

const StreakDetailedView = ({
  streaks,
  showCelebration,
}: {
  streaks: Streak[];
  showCelebration: boolean;
}) => {
  const activeStreaks = streaks.filter((s) => s.isActive);
  const inactiveStreaks = streaks.filter((s) => !s.isActive);
  const bestStreak = streaks.reduce(
    (max, streak) => (streak.bestCount > max.bestCount ? streak : max),
    streaks[0] || { bestCount: 0 },
  );

  return (
    <div className="space-y-6">
      {showCelebration && activeStreaks.length > 0 && (
        <CelebrationCard streak={activeStreaks[0]} />
      )}

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-600" />
              <span className="text-sm font-medium">Active Streaks</span>
            </div>
            <div className="text-2xl font-bold">{activeStreaks.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-600" />
              <span className="text-sm font-medium">Best Streak</span>
            </div>
            <div className="text-2xl font-bold">{bestStreak.bestCount}</div>
            <p className="text-xs text-muted-foreground">{bestStreak.title}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium">Total Streaks</span>
            </div>
            <div className="text-2xl font-bold">{streaks.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Active Streaks */}
      {activeStreaks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-green-600" />
              Active Streaks
            </CardTitle>
            <CardDescription>Keep these going!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeStreaks.map((streak) => (
              <StreakCard key={streak.id} streak={streak} onClick={() => {}} />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Inactive Streaks History */}
      {inactiveStreaks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
              Streak History
            </CardTitle>
            <CardDescription>Your past achievements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {inactiveStreaks.map((streak) => (
                <div
                  key={streak.id}
                  className="flex items-center justify-between p-3 border rounded-lg opacity-75"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-lg">{streak.icon}</div>
                    <div>
                      <h4 className="font-medium">{streak.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        Best: {streak.bestCount} days
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">Completed</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const CelebrationCard = ({ streak }: { streak: Streak }) => {
  return (
    <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-none">
      <CardContent className="pt-6">
        <div className="text-center space-y-3">
          <div className="text-6xl">{getStreakEmoji(streak.currentCount)}</div>
          <h2 className="text-2xl font-bold">
            🎉 {streak.currentCount} Day Streak! 🎉
          </h2>
          <p className="text-orange-100">
            Amazing consistency with your {streak.title.toLowerCase()}!
          </p>
          <div className="flex justify-center gap-2">
            <Badge className="bg-white text-orange-600">
              <Star className="h-3 w-3 mr-1" />
              Streak Master
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const StreakDetailDialog = ({
  streak,
  onClose,
}: {
  streak: Streak;
  onClose: () => void;
}) => {
  const nextMilestone = getNextStreakMilestone(streak.currentCount);
  const daysToNext = nextMilestone - streak.currentCount;

  return (
    <Dialog open={!!streak} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">{streak.icon}</span>
            {streak.title}
          </DialogTitle>
          <DialogDescription>{streak.description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-orange-600 mb-2">
              {streak.currentCount}
            </div>
            <p className="text-muted-foreground">Current Streak</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">{streak.bestCount}</div>
              <p className="text-sm text-muted-foreground">Personal Best</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">{daysToNext}</div>
              <p className="text-sm text-muted-foreground">Days to Next Goal</p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium">Progress to {nextMilestone} days</h4>
            <Progress
              value={(streak.currentCount / nextMilestone) * 100}
              className="h-3"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{streak.currentCount} days</span>
              <span>{nextMilestone} days</span>
            </div>
          </div>

          {streak.isActive && (
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-800">
                  Streak is Active!
                </span>
              </div>
              <p className="text-sm text-green-700">
                Keep going! Complete your next activity to continue this amazing
                streak.
              </p>
            </div>
          )}

          <div className="space-y-2">
            <h4 className="font-medium">Streak Milestones</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {[7, 14, 30, 50, 100].map((milestone) => (
                <div
                  key={milestone}
                  className={`p-2 rounded border text-center ${
                    streak.bestCount >= milestone
                      ? "bg-green-100 text-green-800 border-green-200"
                      : "bg-gray-50 text-gray-600 border-gray-200"
                  }`}
                >
                  <span className="font-medium">{milestone} days</span>
                  {streak.bestCount >= milestone && (
                    <div className="text-xs">✓ Achieved</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
