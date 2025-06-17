import { Client, Session, ProgressEntry } from "./types";

export interface Streak {
  id: string;
  type: "session" | "progress_log" | "goal_hit";
  currentCount: number;
  bestCount: number;
  isActive: boolean;
  lastActivityDate: string;
  startDate: string;
  title: string;
  description: string;
  icon: string;
}

export interface Badge {
  id: string;
  category:
    | "weight_loss"
    | "sessions"
    | "consistency"
    | "progress"
    | "milestones";
  name: string;
  description: string;
  icon: string;
  color: string;
  requirement: string;
  achievedDate?: string;
  isUnlocked: boolean;
  progress?: number; // 0-100 for partial progress
  nextMilestone?: string;
}

export interface GamificationData {
  clientId: string;
  clientName: string;
  level: number;
  totalXP: number;
  currentStreaks: Streak[];
  badges: Badge[];
  recentAchievements: Achievement[];
  stats: GamificationStats;
}

export interface Achievement {
  id: string;
  type: "streak" | "badge" | "milestone";
  title: string;
  description: string;
  icon: string;
  xpEarned: number;
  achievedDate: string;
  isNew: boolean;
}

export interface GamificationStats {
  totalSessions: number;
  totalWeightLoss: number;
  totalDaysTracked: number;
  longestStreak: number;
  badgesEarned: number;
  currentLevel: number;
}

// Predefined badge definitions
export const BADGE_DEFINITIONS: Omit<
  Badge,
  "id" | "achievedDate" | "isUnlocked" | "progress"
>[] = [
  // Session Milestones
  {
    category: "sessions",
    name: "First Step",
    description: "Complete your first workout session",
    icon: "🎯",
    color: "bg-blue-100 text-blue-800",
    requirement: "1 session",
    nextMilestone: "5 sessions for Momentum Builder",
  },
  {
    category: "sessions",
    name: "Momentum Builder",
    description: "Complete 5 workout sessions",
    icon: "🚀",
    color: "bg-purple-100 text-purple-800",
    requirement: "5 sessions",
    nextMilestone: "10 sessions for Committed",
  },
  {
    category: "sessions",
    name: "Committed",
    description: "Complete 10 workout sessions",
    icon: "💪",
    color: "bg-green-100 text-green-800",
    requirement: "10 sessions",
    nextMilestone: "25 sessions for Dedicated",
  },
  {
    category: "sessions",
    name: "Dedicated",
    description: "Complete 25 workout sessions",
    icon: "🏆",
    color: "bg-yellow-100 text-yellow-800",
    requirement: "25 sessions",
    nextMilestone: "50 sessions for Warrior",
  },
  {
    category: "sessions",
    name: "Fitness Warrior",
    description: "Complete 50 workout sessions",
    icon: "⚡",
    color: "bg-orange-100 text-orange-800",
    requirement: "50 sessions",
    nextMilestone: "100 sessions for Legend",
  },
  {
    category: "sessions",
    name: "Fitness Legend",
    description: "Complete 100 workout sessions",
    icon: "👑",
    color: "bg-red-100 text-red-800",
    requirement: "100 sessions",
    nextMilestone: "You're a legend!",
  },

  // Weight Loss Milestones
  {
    category: "weight_loss",
    name: "First Pounds",
    description: "Lose your first 2 pounds",
    icon: "📉",
    color: "bg-green-100 text-green-800",
    requirement: "2 lbs lost",
    nextMilestone: "5 lbs for Getting Lighter",
  },
  {
    category: "weight_loss",
    name: "Getting Lighter",
    description: "Lose 5 pounds",
    icon: "🎈",
    color: "bg-blue-100 text-blue-800",
    requirement: "5 lbs lost",
    nextMilestone: "10 lbs for Transformation",
  },
  {
    category: "weight_loss",
    name: "Transformation",
    description: "Lose 10 pounds",
    icon: "🔥",
    color: "bg-orange-100 text-orange-800",
    requirement: "10 lbs lost",
    nextMilestone: "20 lbs for Major Change",
  },
  {
    category: "weight_loss",
    name: "Major Change",
    description: "Lose 20 pounds",
    icon: "⭐",
    color: "bg-yellow-100 text-yellow-800",
    requirement: "20 lbs lost",
    nextMilestone: "30 lbs for Incredible",
  },
  {
    category: "weight_loss",
    name: "Incredible Journey",
    description: "Lose 30+ pounds",
    icon: "🌟",
    color: "bg-purple-100 text-purple-800",
    requirement: "30+ lbs lost",
    nextMilestone: "Amazing achievement!",
  },

  // Consistency Badges
  {
    category: "consistency",
    name: "Week Warrior",
    description: "Complete 7 days in a row",
    icon: "📅",
    color: "bg-green-100 text-green-800",
    requirement: "7-day streak",
    nextMilestone: "14 days for Consistent Champion",
  },
  {
    category: "consistency",
    name: "Consistent Champion",
    description: "Maintain a 14-day streak",
    icon: "🔥",
    color: "bg-orange-100 text-orange-800",
    requirement: "14-day streak",
    nextMilestone: "30 days for Habit Master",
  },
  {
    category: "consistency",
    name: "Habit Master",
    description: "Maintain a 30-day streak",
    icon: "💎",
    color: "bg-blue-100 text-blue-800",
    requirement: "30-day streak",
    nextMilestone: "60 days for Unstoppable",
  },
  {
    category: "consistency",
    name: "Unstoppable Force",
    description: "Maintain a 60-day streak",
    icon: "⚡",
    color: "bg-purple-100 text-purple-800",
    requirement: "60-day streak",
    nextMilestone: "100 days for Legend status",
  },

  // Progress Tracking
  {
    category: "progress",
    name: "Progress Tracker",
    description: "Log progress for 7 days",
    icon: "📊",
    color: "bg-blue-100 text-blue-800",
    requirement: "7 progress logs",
    nextMilestone: "30 days for Data Lover",
  },
  {
    category: "progress",
    name: "Data Lover",
    description: "Track progress for 30 days",
    icon: "📈",
    color: "bg-green-100 text-green-800",
    requirement: "30 progress logs",
    nextMilestone: "100 days for Analytics Pro",
  },
  {
    category: "progress",
    name: "Analytics Pro",
    description: "Track progress for 100 days",
    icon: "🎯",
    color: "bg-purple-100 text-purple-800",
    requirement: "100 progress logs",
    nextMilestone: "Keep tracking!",
  },

  // Special Milestones
  {
    category: "milestones",
    name: "Goal Crusher",
    description: "Reach your weight goal",
    icon: "🎯",
    color: "bg-gold-100 text-gold-800",
    requirement: "Reach target weight",
    nextMilestone: "Set a new goal!",
  },
  {
    category: "milestones",
    name: "Early Bird",
    description: "Complete 5 morning workouts",
    icon: "🌅",
    color: "bg-yellow-100 text-yellow-800",
    requirement: "5 AM sessions",
    nextMilestone: "10 AM sessions for Dawn Warrior",
  },
  {
    category: "milestones",
    name: "Night Owl",
    description: "Complete 5 evening workouts",
    icon: "🌙",
    color: "bg-indigo-100 text-indigo-800",
    requirement: "5 PM sessions",
    nextMilestone: "10 PM sessions for Night Warrior",
  },
];

// Calculate client's gamification data
export const calculateGamificationData = (
  client: Client,
  sessions: Session[],
  progressEntries: ProgressEntry[],
): GamificationData => {
  const stats = calculateStats(sessions, progressEntries);
  const currentStreaks = calculateStreaks(sessions, progressEntries);
  const badges = calculateBadges(stats, currentStreaks);
  const recentAchievements = getRecentAchievements(badges, currentStreaks);
  const level = calculateLevel(
    stats.totalSessions,
    badges.filter((b) => b.isUnlocked).length,
  );

  return {
    clientId: client.id,
    clientName: client.name,
    level,
    totalXP: calculateTotalXP(stats, badges),
    currentStreaks,
    badges,
    recentAchievements,
    stats,
  };
};

const calculateStats = (
  sessions: Session[],
  progressEntries: ProgressEntry[],
): GamificationStats => {
  const completedSessions = sessions.filter((s) => s.status === "completed");

  // Calculate weight loss (assuming weight loss is the goal)
  const weights = progressEntries
    .map((p) => p.weight)
    .filter((w) => w != null) as number[];
  const totalWeightLoss =
    weights.length >= 2
      ? Math.max(0, weights[weights.length - 1] - weights[0])
      : 0;

  return {
    totalSessions: completedSessions.length,
    totalWeightLoss,
    totalDaysTracked: progressEntries.length,
    longestStreak: 0, // Will be calculated by streak function
    badgesEarned: 0, // Will be updated after badge calculation
    currentLevel: 1,
  };
};

const calculateStreaks = (
  sessions: Session[],
  progressEntries: ProgressEntry[],
): Streak[] => {
  const streaks: Streak[] = [];

  // Session streak
  const sessionStreak = calculateSessionStreak(sessions);
  streaks.push(sessionStreak);

  // Progress logging streak
  const progressStreak = calculateProgressStreak(progressEntries);
  streaks.push(progressStreak);

  return streaks;
};

const calculateSessionStreak = (sessions: Session[]): Streak => {
  const completedSessions = sessions
    .filter((s) => s.status === "completed")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  let currentStreak = 0;
  let bestStreak = 0;
  let lastDate: Date | null = null;
  let isActive = false;

  for (const session of completedSessions) {
    const sessionDate = new Date(session.date);

    if (lastDate) {
      const daysDiff = Math.floor(
        (sessionDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (daysDiff <= 7) {
        // Within a week counts as continuing streak
        currentStreak++;
      } else {
        bestStreak = Math.max(bestStreak, currentStreak);
        currentStreak = 1;
      }
    } else {
      currentStreak = 1;
    }

    lastDate = sessionDate;
  }

  bestStreak = Math.max(bestStreak, currentStreak);

  // Check if streak is still active (last session within 7 days)
  if (lastDate) {
    const daysSinceLastSession = Math.floor(
      (Date.now() - lastDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    isActive = daysSinceLastSession <= 7;
  }

  return {
    id: "session-streak",
    type: "session",
    currentCount: isActive ? currentStreak : 0,
    bestCount: bestStreak,
    isActive,
    lastActivityDate: lastDate?.toISOString() || "",
    startDate: lastDate?.toISOString() || "",
    title: "Workout Streak",
    description: "Consecutive workout sessions",
    icon: "🔥",
  };
};

const calculateProgressStreak = (progressEntries: ProgressEntry[]): Streak => {
  const sortedEntries = progressEntries.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  let currentStreak = 0;
  let bestStreak = 0;
  let lastDate: Date | null = null;
  let isActive = false;

  for (const entry of sortedEntries) {
    const entryDate = new Date(entry.date);

    if (lastDate) {
      const daysDiff = Math.floor(
        (entryDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (daysDiff <= 3) {
        // Within 3 days counts as continuing streak
        currentStreak++;
      } else {
        bestStreak = Math.max(bestStreak, currentStreak);
        currentStreak = 1;
      }
    } else {
      currentStreak = 1;
    }

    lastDate = entryDate;
  }

  bestStreak = Math.max(bestStreak, currentStreak);

  if (lastDate) {
    const daysSinceLastEntry = Math.floor(
      (Date.now() - lastDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    isActive = daysSinceLastEntry <= 3;
  }

  return {
    id: "progress-streak",
    type: "progress_log",
    currentCount: isActive ? currentStreak : 0,
    bestCount: bestStreak,
    isActive,
    lastActivityDate: lastDate?.toISOString() || "",
    startDate: lastDate?.toISOString() || "",
    title: "Progress Tracking",
    description: "Consecutive days logging progress",
    icon: "📊",
  };
};

const calculateBadges = (
  stats: GamificationStats,
  streaks: Streak[],
): Badge[] => {
  const badges: Badge[] = [];

  BADGE_DEFINITIONS.forEach((badgeTemplate) => {
    const badge: Badge = {
      ...badgeTemplate,
      id: `${badgeTemplate.category}-${badgeTemplate.name.toLowerCase().replace(/\s+/g, "-")}`,
      isUnlocked: false,
      progress: 0,
    };

    // Check if badge is unlocked based on stats
    switch (badgeTemplate.category) {
      case "sessions":
        const sessionRequirement = parseInt(badgeTemplate.requirement);
        badge.isUnlocked = stats.totalSessions >= sessionRequirement;
        badge.progress = Math.min(
          100,
          (stats.totalSessions / sessionRequirement) * 100,
        );
        if (badge.isUnlocked) {
          badge.achievedDate = new Date().toISOString();
        }
        break;

      case "weight_loss":
        const weightRequirement = parseInt(badgeTemplate.requirement);
        badge.isUnlocked = stats.totalWeightLoss >= weightRequirement;
        badge.progress = Math.min(
          100,
          (stats.totalWeightLoss / weightRequirement) * 100,
        );
        if (badge.isUnlocked) {
          badge.achievedDate = new Date().toISOString();
        }
        break;

      case "consistency":
        const streakRequirement = parseInt(badgeTemplate.requirement);
        const maxStreak = Math.max(...streaks.map((s) => s.bestCount));
        badge.isUnlocked = maxStreak >= streakRequirement;
        badge.progress = Math.min(100, (maxStreak / streakRequirement) * 100);
        if (badge.isUnlocked) {
          badge.achievedDate = new Date().toISOString();
        }
        break;

      case "progress":
        const progressRequirement = parseInt(badgeTemplate.requirement);
        badge.isUnlocked = stats.totalDaysTracked >= progressRequirement;
        badge.progress = Math.min(
          100,
          (stats.totalDaysTracked / progressRequirement) * 100,
        );
        if (badge.isUnlocked) {
          badge.achievedDate = new Date().toISOString();
        }
        break;

      case "milestones":
        // Special milestone logic would go here
        badge.isUnlocked = false;
        break;
    }

    badges.push(badge);
  });

  return badges;
};

const getRecentAchievements = (
  badges: Badge[],
  streaks: Streak[],
): Achievement[] => {
  const achievements: Achievement[] = [];

  // Add recently unlocked badges
  badges
    .filter((b) => b.isUnlocked && b.achievedDate)
    .forEach((badge) => {
      const daysSinceAchieved = Math.floor(
        (Date.now() - new Date(badge.achievedDate!).getTime()) /
          (1000 * 60 * 60 * 24),
      );

      if (daysSinceAchieved <= 7) {
        achievements.push({
          id: `badge-${badge.id}`,
          type: "badge",
          title: badge.name,
          description: badge.description,
          icon: badge.icon,
          xpEarned: calculateBadgeXP(badge),
          achievedDate: badge.achievedDate!,
          isNew: daysSinceAchieved <= 1,
        });
      }
    });

  // Add streak milestones
  streaks.forEach((streak) => {
    if (
      streak.isActive &&
      [5, 10, 15, 20, 30, 50, 100].includes(streak.currentCount)
    ) {
      achievements.push({
        id: `streak-${streak.id}-${streak.currentCount}`,
        type: "streak",
        title: `${streak.currentCount} Day Streak!`,
        description: `Amazing ${streak.title.toLowerCase()} streak`,
        icon: streak.icon,
        xpEarned: streak.currentCount * 10,
        achievedDate: new Date().toISOString(),
        isNew: true,
      });
    }
  });

  return achievements.sort(
    (a, b) =>
      new Date(b.achievedDate).getTime() - new Date(a.achievedDate).getTime(),
  );
};

const calculateLevel = (
  totalSessions: number,
  badgesEarned: number,
): number => {
  const baseXP = totalSessions * 100;
  const badgeXP = badgesEarned * 500;
  const totalXP = baseXP + badgeXP;

  return Math.floor(totalXP / 1000) + 1;
};

const calculateTotalXP = (
  stats: GamificationStats,
  badges: Badge[],
): number => {
  const sessionXP = stats.totalSessions * 100;
  const badgeXP = badges.filter((b) => b.isUnlocked).length * 500;
  const streakXP = stats.longestStreak * 50;

  return sessionXP + badgeXP + streakXP;
};

const calculateBadgeXP = (badge: Badge): number => {
  const baseXP = 500;
  const rarityMultiplier = badge.category === "milestones" ? 2 : 1;
  return baseXP * rarityMultiplier;
};

// Utility functions for UI
export const getStreakEmoji = (count: number): string => {
  if (count >= 100) return "👑";
  if (count >= 50) return "⚡";
  if (count >= 30) return "🔥";
  if (count >= 14) return "💪";
  if (count >= 7) return "🎯";
  if (count >= 3) return "📈";
  return "🌱";
};

export const getNextStreakMilestone = (currentCount: number): number => {
  const milestones = [3, 7, 14, 30, 50, 100];
  return milestones.find((m) => m > currentCount) || currentCount + 10;
};

export const generateCelebrationMessage = (
  achievement: Achievement,
): string => {
  const messages = {
    badge: [
      `🎉 Congratulations! You've earned the "${achievement.title}" badge!`,
      `Amazing work! You've unlocked: ${achievement.title}`,
      `🏆 Badge Unlocked: ${achievement.title}! Keep crushing it!`,
    ],
    streak: [
      `🔥 You're on fire! ${achievement.title}`,
      `Incredible consistency! ${achievement.title}`,
      `🎯 Streak Master! ${achievement.title}`,
    ],
    milestone: [
      `🌟 Milestone reached: ${achievement.title}!`,
      `You did it! ${achievement.title} achieved!`,
      `🎊 Major achievement unlocked: ${achievement.title}`,
    ],
  };

  const categoryMessages = messages[achievement.type];
  return categoryMessages[Math.floor(Math.random() * categoryMessages.length)];
};
