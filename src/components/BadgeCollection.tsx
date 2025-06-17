import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge as UIBadge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Trophy,
  Award,
  Star,
  Lock,
  Unlock,
  Target,
  Calendar,
  TrendingUp,
  Zap,
  Crown,
} from "lucide-react";
import { Badge, Achievement } from "@/lib/gamification";

interface BadgeCollectionProps {
  badges: Badge[];
  recentAchievements?: Achievement[];
  variant?: "card" | "grid" | "showcase";
  showProgress?: boolean;
}

export const BadgeCollection = ({
  badges,
  recentAchievements = [],
  variant = "card",
  showProgress = true,
}: BadgeCollectionProps) => {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  const unlockedBadges = badges.filter((b) => b.isUnlocked);
  const lockedBadges = badges.filter((b) => !b.isUnlocked);
  const categorizedBadges = groupBadgesByCategory(badges);

  if (variant === "showcase") {
    return (
      <BadgeShowcase badges={badges} recentAchievements={recentAchievements} />
    );
  }

  if (variant === "grid") {
    return (
      <BadgeGrid
        badges={badges}
        onBadgeClick={setSelectedBadge}
        showProgress={showProgress}
      />
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-600" />
            <CardTitle>Achievement Badges</CardTitle>
          </div>
          <UIBadge className="bg-yellow-100 text-yellow-800">
            {unlockedBadges.length}/{badges.length}
          </UIBadge>
        </div>
        <CardDescription>
          Your fitness achievements and milestones
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Recent Achievements */}
        {recentAchievements.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              Recent Achievements
            </h4>
            <div className="space-y-2">
              {recentAchievements.slice(0, 3).map((achievement) => (
                <RecentAchievementCard
                  key={achievement.id}
                  achievement={achievement}
                />
              ))}
            </div>
          </div>
        )}

        {/* Badge Categories */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unlocked">Earned</TabsTrigger>
            <TabsTrigger value="locked">Locked</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <BadgeGrid
              badges={badges}
              onBadgeClick={setSelectedBadge}
              showProgress={showProgress}
            />
          </TabsContent>

          <TabsContent value="unlocked" className="space-y-4">
            {unlockedBadges.length > 0 ? (
              <BadgeGrid
                badges={unlockedBadges}
                onBadgeClick={setSelectedBadge}
                showProgress={false}
              />
            ) : (
              <div className="text-center py-8">
                <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No badges earned yet</p>
                <p className="text-sm text-muted-foreground">
                  Keep working out to earn your first badge!
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="locked" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {lockedBadges.map((badge) => (
                <LockedBadgeCard
                  key={badge.id}
                  badge={badge}
                  onClick={() => setSelectedBadge(badge)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="progress" className="space-y-4">
            <div className="space-y-4">
              {badges
                .filter((b) => !b.isUnlocked && (b.progress || 0) > 0)
                .map((badge) => (
                  <ProgressBadgeCard
                    key={badge.id}
                    badge={badge}
                    onClick={() => setSelectedBadge(badge)}
                  />
                ))}
            </div>
          </TabsContent>
        </Tabs>

        {selectedBadge && (
          <BadgeDetailDialog
            badge={selectedBadge}
            onClose={() => setSelectedBadge(null)}
          />
        )}
      </CardContent>
    </Card>
  );
};

const BadgeShowcase = ({
  badges,
  recentAchievements,
}: {
  badges: Badge[];
  recentAchievements: Achievement[];
}) => {
  const unlockedBadges = badges.filter((b) => b.isUnlocked);
  const featuredBadges = unlockedBadges.slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Hero Achievement */}
      {recentAchievements.length > 0 && (
        <Card className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-none">
          <CardContent className="pt-6">
            <div className="text-center space-y-3">
              <div className="text-4xl">{recentAchievements[0].icon}</div>
              <h2 className="text-xl font-bold">
                🎉 New Achievement Unlocked! 🎉
              </h2>
              <p className="text-yellow-100">{recentAchievements[0].title}</p>
              <UIBadge className="bg-white text-orange-600">
                +{recentAchievements[0].xpEarned} XP
              </UIBadge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Featured Badges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-600" />
            Badge Collection
          </CardTitle>
          <CardDescription>
            {unlockedBadges.length} of {badges.length} badges earned
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {featuredBadges.map((badge) => (
              <div key={badge.id} className="text-center">
                <div className="text-3xl mb-2">{badge.icon}</div>
                <p className="text-xs font-medium">{badge.name}</p>
              </div>
            ))}
          </div>
          {unlockedBadges.length > 6 && (
            <div className="text-center mt-4">
              <Button variant="outline" size="sm">
                View All {unlockedBadges.length} Badges
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const BadgeGrid = ({
  badges,
  onBadgeClick,
  showProgress,
}: {
  badges: Badge[];
  onBadgeClick: (badge: Badge) => void;
  showProgress: boolean;
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {badges.map((badge) => (
        <div
          key={badge.id}
          className={`p-4 border rounded-lg cursor-pointer transition-all ${
            badge.isUnlocked
              ? "hover:shadow-md border-green-200 bg-green-50"
              : "opacity-60 hover:opacity-80"
          }`}
          onClick={() => onBadgeClick(badge)}
        >
          <div className="text-center space-y-2">
            <div className="text-3xl">{badge.icon}</div>
            <h4 className="font-medium text-sm">{badge.name}</h4>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {badge.description}
            </p>

            {badge.isUnlocked ? (
              <UIBadge className="text-xs bg-green-100 text-green-800">
                <Unlock className="h-3 w-3 mr-1" />
                Unlocked
              </UIBadge>
            ) : showProgress && (badge.progress || 0) > 0 ? (
              <div className="space-y-1">
                <Progress value={badge.progress} className="h-1" />
                <p className="text-xs text-muted-foreground">
                  {Math.round(badge.progress || 0)}% complete
                </p>
              </div>
            ) : (
              <UIBadge variant="outline" className="text-xs">
                <Lock className="h-3 w-3 mr-1" />
                Locked
              </UIBadge>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const LockedBadgeCard = ({
  badge,
  onClick,
}: {
  badge: Badge;
  onClick: () => void;
}) => {
  return (
    <div
      className="p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
      onClick={onClick}
    >
      <div className="text-center space-y-2 opacity-60">
        <div className="text-2xl filter grayscale">{badge.icon}</div>
        <h4 className="font-medium text-sm">{badge.name}</h4>
        <p className="text-xs text-muted-foreground">{badge.requirement}</p>
        <UIBadge variant="outline" className="text-xs">
          <Lock className="h-3 w-3 mr-1" />
          Locked
        </UIBadge>
      </div>
    </div>
  );
};

const ProgressBadgeCard = ({
  badge,
  onClick,
}: {
  badge: Badge;
  onClick: () => void;
}) => {
  return (
    <div
      className="p-4 border rounded-lg cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <div className="text-2xl">{badge.icon}</div>
        <div className="flex-1">
          <h4 className="font-medium">{badge.name}</h4>
          <p className="text-sm text-muted-foreground mb-2">
            {badge.description}
          </p>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Progress</span>
              <span>{Math.round(badge.progress || 0)}%</span>
            </div>
            <Progress value={badge.progress} className="h-2" />
          </div>
          {badge.nextMilestone && (
            <p className="text-xs text-muted-foreground mt-1">
              Next: {badge.nextMilestone}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const RecentAchievementCard = ({
  achievement,
}: {
  achievement: Achievement;
}) => {
  return (
    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
      <div className="text-xl">{achievement.icon}</div>
      <div className="flex-1">
        <h4 className="font-medium text-sm">{achievement.title}</h4>
        <p className="text-xs text-muted-foreground">
          {achievement.description}
        </p>
      </div>
      <div className="text-right">
        <UIBadge className="bg-yellow-100 text-yellow-800 text-xs">
          +{achievement.xpEarned} XP
        </UIBadge>
        {achievement.isNew && (
          <p className="text-xs text-orange-600 font-medium">NEW!</p>
        )}
      </div>
    </div>
  );
};

const BadgeDetailDialog = ({
  badge,
  onClose,
}: {
  badge: Badge;
  onClose: () => void;
}) => {
  return (
    <Dialog open={!!badge} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="text-3xl">{badge.icon}</span>
            <div>
              <div>{badge.name}</div>
              <UIBadge className={badge.color} size="sm">
                {badge.category.replace("_", " ")}
              </UIBadge>
            </div>
          </DialogTitle>
          <DialogDescription>{badge.description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="text-center">
            {badge.isUnlocked ? (
              <div className="space-y-2">
                <UIBadge className="bg-green-100 text-green-800">
                  <Unlock className="h-3 w-3 mr-1" />
                  Unlocked
                </UIBadge>
                {badge.achievedDate && (
                  <p className="text-sm text-muted-foreground">
                    Earned on{" "}
                    {new Date(badge.achievedDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <UIBadge variant="outline">
                  <Lock className="h-3 w-3 mr-1" />
                  Locked
                </UIBadge>
                <p className="text-sm text-muted-foreground">
                  Requirement: {badge.requirement}
                </p>
              </div>
            )}
          </div>

          {!badge.isUnlocked && (badge.progress || 0) > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium">Progress</h4>
              <div className="space-y-2">
                <Progress value={badge.progress} className="h-3" />
                <p className="text-sm text-muted-foreground">
                  {Math.round(badge.progress || 0)}% complete
                </p>
              </div>
              {badge.nextMilestone && (
                <p className="text-sm text-muted-foreground">
                  {badge.nextMilestone}
                </p>
              )}
            </div>
          )}

          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">How to Unlock</h4>
            <p className="text-sm text-muted-foreground">
              {getBadgeUnlockInstructions(badge)}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Utility functions
const groupBadgesByCategory = (badges: Badge[]) => {
  return badges.reduce(
    (acc, badge) => {
      if (!acc[badge.category]) {
        acc[badge.category] = [];
      }
      acc[badge.category].push(badge);
      return acc;
    },
    {} as Record<string, Badge[]>,
  );
};

const getBadgeUnlockInstructions = (badge: Badge): string => {
  switch (badge.category) {
    case "sessions":
      return `Complete ${badge.requirement} to unlock this badge. Each completed workout session counts toward this goal.`;
    case "weight_loss":
      return `Lose ${badge.requirement} to earn this achievement. Track your progress regularly to see your improvement.`;
    case "consistency":
      return `Maintain a ${badge.requirement} to unlock this badge. Don't miss any days to keep your streak alive!`;
    case "progress":
      return `Log your progress for ${badge.requirement} to earn this badge. Regular tracking helps you stay motivated.`;
    case "milestones":
      return `Achieve the specific milestone: ${badge.requirement}. This is a special achievement for reaching important goals.`;
    default:
      return `Meet the requirement: ${badge.requirement} to unlock this badge.`;
  }
};
