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
  Sparkles,
  PartyPopper,
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

// Add to Streak type for local UI recovery (not persisted)
type RecoverableStreak = Streak & { canRecover?: boolean };

export const StreakTracker = ({
  streaks,
  variant = "card",
  showCelebration = false,
}: StreakTrackerProps) => {
  const [selectedStreak, setSelectedStreak] = useState<RecoverableStreak | null>(null);
  const [celebratingStreak, setCelebratingStreak] = useState<RecoverableStreak | null>(null);
  const [celebratedMilestones, setCelebratedMilestones] = useState<number[]>([]);
  const [recoveredStreaks, setRecoveredStreaks] = useState<string[]>([]);
  const activeStreaks = streaks.filter((s) => s.isActive);
  const totalStreaks = streaks.length;

  // Add canRecover flag: streak is not active, but last activity was 1 day ago and not already recovered
  const now = new Date();
  const enhancedStreaks: RecoverableStreak[] = streaks.map((s) => {
    if (s.isActive) return s;
    if (recoveredStreaks.includes(s.id)) return { ...s, isActive: true };
    if (!s.lastActivityDate) return s;
    const last = new Date(s.lastActivityDate);
    const daysMissed = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
    return {
      ...s,
      canRecover: !s.isActive && daysMissed === 1 && !recoveredStreaks.includes(s.id),
    };
  });

  // Check for milestone achievements
  useEffect(() => {
    if (showCelebration && activeStreaks.length > 0) {
      const milestoneStreak = activeStreaks.find(streak => {
        const milestones = [7, 14, 30, 60, 100];
        const key = `streak-celebrated-${streak.id}-${streak.currentCount}`;
        return (
          milestones.includes(streak.currentCount) &&
          !celebratedMilestones.includes(streak.currentCount) &&
          !localStorage.getItem(key)
        );
      });
      if (milestoneStreak) {
        setCelebratingStreak(milestoneStreak);
      }
    }
  }, [activeStreaks, showCelebration, celebratedMilestones]);

  const handleMilestoneClose = (count: number) => {
    if (celebratingStreak) {
      const key = `streak-celebrated-${celebratingStreak.id}-${celebratingStreak.currentCount}`;
      localStorage.setItem(key, 'true');
    }
    setCelebratingStreak(null);
    setCelebratedMilestones((prev) => [...prev, count]);
  };

  const handleRecoverStreak = (streakId: string) => {
    setRecoveredStreaks((prev) => [...prev, streakId]);
  };

  if (variant === "widget") {
    return <StreakWidget activeStreaks={activeStreaks} />;
  }

  if (variant === "detailed") {
    return (
      <StreakDetailedView streaks={streaks} showCelebration={showCelebration} />
    );
  }

  return (
    <>
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
          {enhancedStreaks.filter((s) => s.isActive).length > 0 ? (
            enhancedStreaks.filter((s) => s.isActive).map((streak) => (
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
          {/* Show recoverable streaks */}
          {enhancedStreaks.filter((s) => !s.isActive && s.canRecover).map((streak) => (
            <StreakCard
              key={streak.id}
              streak={streak}
              onClick={() => setSelectedStreak(streak)}
              onRecover={() => handleRecoverStreak(streak.id)}
            />
          ))}
          {selectedStreak && (
            <StreakDetailDialog
              streak={selectedStreak}
              onClose={() => setSelectedStreak(null)}
              onRecover={selectedStreak.canRecover ? () => handleRecoverStreak(selectedStreak.id) : undefined}
            />
          )}
        </CardContent>
      </Card>

      {celebratingStreak && (
        <MilestoneCelebration
          streak={celebratingStreak}
          onClose={() => handleMilestoneClose(celebratingStreak.currentCount)}
        />
      )}
    </>
  );
};

function isStreak(obj: any): obj is Streak {
  return obj && typeof obj.title === "string" && typeof obj.currentCount === "number";
}

const StreakWidget = ({ activeStreaks }: { activeStreaks: Streak[] }) => {
  const fallbackStreak: Streak = {
    id: "none",
    type: "session",
    currentCount: 0,
    bestCount: 0,
    isActive: false,
    lastActivityDate: "",
    startDate: "",
    title: "No streaks yet",
    description: "",
    icon: "🌱",
  };
  const topStreak: Streak = activeStreaks.reduce((max, streak) => (streak.currentCount > max.currentCount ? streak : max), fallbackStreak);

  return (
    <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{isStreak(topStreak) ? topStreak.icon : "🔥"}</div>
            <div>
              <p className="font-semibold">
                {isStreak(topStreak) && topStreak.currentCount > 0
                  ? `${topStreak.currentCount} Day Streak!`
                  : "Start Your Streak"}
              </p>
              <p className="text-sm text-muted-foreground">
                {isStreak(topStreak) ? topStreak.title : "No streaks yet"}
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
  onRecover,
}: {
  streak: RecoverableStreak;
  onClick: () => void;
  onRecover?: () => void;
}) => {
  const nextMilestone = getNextStreakMilestone(streak.currentCount);
  const progressToNext = Math.min(
    100,
    (streak.currentCount / nextMilestone) * 100,
  );

  // Flame/emoji grows with streak length
  const flameSize = 32 + Math.min(streak.currentCount * 2, 32); // max 64px
  const flameGlow = streak.currentCount >= 7 ? "animate-pulseGlow" : "animate-fadeInUp";

  return (
    <div
      className="p-4 border rounded-lg cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center justify-center ${flameGlow}`}
            style={{ fontSize: flameSize, filter: streak.currentCount >= 7 ? "drop-shadow(0 0 8px orange)" : undefined }}
          >
            {getStreakEmoji(streak.currentCount)}
          </div>
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
          <Badge className="bg-green-100 text-green-800">
            <Zap className="h-3 w-3 mr-1" />
            Active
          </Badge>
          <span className="text-xs text-muted-foreground">Keep it going!</span>
        </div>
      )}
      {/* Streak Recovery Button */}
      {!streak.isActive && streak.canRecover && onRecover && (
        <div className="mt-3 flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); onRecover(); }}>
            Recover Streak
          </Button>
          <span className="text-xs text-orange-600">Missed a day? Use your 1-day grace!</span>
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
    streaks[0] || { bestCount: 0, title: "" }
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
  onRecover,
}: {
  streak: RecoverableStreak;
  onClose: () => void;
  onRecover?: () => void;
}) => {
  const nextMilestone = getNextStreakMilestone(streak.currentCount);
  const daysToNext = nextMilestone - streak.currentCount;
  const [showRecovery, setShowRecovery] = useState(false);

  const handleRecover = () => {
    setShowRecovery(true);
    if (onRecover) onRecover();
    setTimeout(() => {
      setShowRecovery(false);
      onClose();
    }, 1800);
  };

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
          {/* Recovery Animation */}
          {showRecovery && (
            <div className="flex flex-col items-center gap-2 animate-fadeInUp">
              <div className="text-5xl animate-pulse">🔥</div>
              <div className="text-orange-600 font-bold">Streak Recovered!</div>
              <div className="text-xs text-muted-foreground">Your streak is back on track.</div>
            </div>
          )}
          {/* Recovery Button */}
          {!streak.isActive && streak.canRecover && !showRecovery && (
            <div className="flex flex-col items-center gap-2">
              <Button onClick={handleRecover} variant="outline">
                Recover Streak
              </Button>
              <span className="text-xs text-orange-600">Missed a day? Use your 1-day grace!</span>
            </div>
          )}
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

// Milestone celebration component with confetti
const MilestoneCelebration = ({ 
  streak, 
  onClose 
}: { 
  streak: Streak; 
  onClose: () => void; 
}) => {
  const [showConfetti, setShowConfetti] = useState(true);
  const [confetti, setConfetti] = useState<Array<{id: number; x: number; y: number; color: string}>>([]);

  useEffect(() => {
    // Generate confetti particles
    const particles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10,
      color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'][Math.floor(Math.random() * 7)]
    }));
    setConfetti(particles);

    // Hide confetti after 3 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const getMilestoneMessage = (count: number) => {
    if (count >= 100) return "Century Club! You're a legend! 🏆";
    if (count >= 60) return "Unstoppable! 60 days of pure dedication! 💎";
    if (count >= 30) return "Habit Master! 30 days of consistency! 🔥";
    if (count >= 14) return "Consistent Champion! 14 days strong! ⚡";
    if (count >= 7) return "Week Warrior! 7 days of momentum! 🚀";
    return "Amazing streak! Keep it going! 💪";
  };

  const handleContinue = () => {
    onClose();
  };

  const handleShare = () => {
    // Share achievement logic
    if (navigator.share) {
      navigator.share({
        title: `${streak.currentCount} Day Streak Achievement!`,
        text: `I just achieved a ${streak.currentCount} day streak in ${streak.title}! ${getMilestoneMessage(streak.currentCount)}`,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      const text = `I just achieved a ${streak.currentCount} day streak in ${streak.title}! ${getMilestoneMessage(streak.currentCount)}`;
      navigator.clipboard.writeText(text);
      alert('Achievement copied to clipboard!');
    }
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md text-center p-6">
        <DialogHeader>
          <DialogTitle>{streak.currentCount} Day Streak!</DialogTitle>
          <DialogDescription>
            {streak.title} - {streak.description}
          </DialogDescription>
        </DialogHeader>
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {confetti.map((particle) => (
              <div
                key={particle.id}
                className="absolute w-2 h-2 rounded-full animate-confettiFall"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  backgroundColor: particle.color,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>
        )}
        
        <div className="flex flex-col items-center space-y-4 mt-2">
          <div className="text-6xl animate-pulse">
            {getStreakEmoji(streak.currentCount)}
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-orange-600">
              {streak.currentCount} Day Streak!
            </h2>
            <p className="text-lg font-semibold">
              {getMilestoneMessage(streak.currentCount)}
            </p>
            <p className="text-sm text-muted-foreground">
              {streak.title} - {streak.description}
            </p>
          </div>

          <div className="flex items-center gap-2 text-yellow-600">
            <Sparkles className="h-5 w-5" />
            <span className="font-semibold">+{streak.currentCount * 10} XP Earned!</span>
            <Sparkles className="h-5 w-5" />
          </div>

          <div className="flex gap-2 mt-4">
            <Button onClick={handleContinue} variant="outline">
              Continue
            </Button>
            <Button onClick={handleShare} className="bg-gradient-to-r from-orange-500 to-red-500">
              <PartyPopper className="h-4 w-4 mr-2" />
              Share Achievement
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
