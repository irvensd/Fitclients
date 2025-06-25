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

export interface OperatingHours {
  day: string;
  isOpen: boolean;
  startTime: string;
  endTime: string;
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
  operatingHours?: OperatingHours[];
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    youtube?: string;
  };
  referralCode?: string;
  referredBy?: string;
  referralRewardGranted?: boolean;
  referralRewardGrantedAt?: string;
  totalReferrals?: number;
  referralEarnings?: number;
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
  cancellationReason?: string;
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
  aiNotes?: string[];
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

export interface BillingHistory {
  id: string;
  date: string;
  amount: number;
  status: "paid" | "pending" | "failed" | "refunded";
  description: string;
  invoiceUrl?: string;
  subscriptionId?: string;
  planId?: string;
  planName?: string;
  customerId?: string;
  paymentMethod?: string;
  currency?: string;
  createdAt: string;
}

export interface ReferralData {
  id: string;
  referrerId: string;
  referredUserId: string;
  referrerEmail: string;
  referredUserEmail: string;
  status: "pending" | "completed" | "rewarded";
  createdAt: string;
  completedAt?: string;
  rewardGrantedAt?: string;
  rewardAmount?: number;
  planSubscribed?: string;
}

export interface ReferralStats {
  totalReferrals: number;
  completedReferrals: number;
  pendingReferrals: number;
  totalEarnings: number;
  referralCode: string;
  referralLink: string;
}
