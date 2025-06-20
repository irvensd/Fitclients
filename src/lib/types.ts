export interface Client {
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

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  businessName?: string;
  website?: string;
  address?: string;
  createdAt: string;
  lastLogin?: string;
}

export interface Session {
  id: string;
  clientId: string;
  date: string;
  startTime: string;
  endTime: string;
  type: "personal-training" | "consultation" | "assessment";
  status: "scheduled" | "completed" | "cancelled" | "no-show";
  notes?: string;
  cost: number;
  recap?: SessionRecap;
  cancelledBy?: "trainer" | "client";
  cancelledAt?: string;
}

export interface SessionRecap {
  id: string;
  sessionId: string;
  clientId: string;
  createdAt: string;
  trainerForm: {
    workoutFocus: string;
    exercisesCompleted: string[];
    clientPerformance: "excellent" | "good" | "average" | "needs-improvement";
    clientMood: "energetic" | "motivated" | "neutral" | "tired" | "stressed";
    achievementsToday: string;
    challengesFaced: string;
    notesForNextSession: string;
    progressObservations: string;
  };
  aiGeneratedContent: {
    workoutSummary: string;
    personalizedEncouragement: string;
    nextStepsRecommendations: string;
    keyAchievements: string[];
    motivationalQuote: string;
    progressHighlight: string;
  };
  sharedWithClient: boolean;
  clientViewed: boolean;
  clientViewedAt?: string;
}

export interface WorkoutPlan {
  id: string;
  clientId: string;
  name: string;
  description: string;
  exercises: Exercise[];
  createdDate: string;
  isActive: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  weight?: string;
  duration?: string;
  notes?: string;
}

export interface Payment {
  id: string;
  clientId: string;
  sessionId?: string;
  amount: number;
  date: string;
  method: "cash" | "card" | "bank-transfer" | "venmo" | "paypal";
  status: "pending" | "completed" | "failed";
  description: string;
}

export interface ProgressEntry {
  id: string;
  clientId: string;
  date: string;
  weight?: number;
  bodyFat?: number;
  measurements?: {
    chest?: number;
    waist?: number;
    hips?: number;
    arms?: number;
    thighs?: number;
  };
  photos?: string[];
  notes?: string;
}

export interface DashboardStats {
  totalClients: number;
  sessionsToday: number;
  sessionsThisWeek: number;
  monthlyRevenue: number;
  activeWorkoutPlans: number;
  pendingPayments: number;
}
