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

// === MARKETING TYPES ===
export interface MarketingCampaign {
  id: string;
  title: string;
  description: string;
  type: "referral" | "social" | "email" | "promo";
  status: "active" | "paused" | "completed" | "draft";
  createdAt: string;
  startDate: string;
  endDate?: string;
  targetAudience: string;
  budget?: number;
  discountType?: "percentage" | "fixed";
  discountValue?: number;
  referralReward?: number;
  metrics: CampaignMetrics;
  settings: CampaignSettings;
}

export interface CampaignMetrics {
  views: number;
  clicks: number;
  conversions: number;
  shares: number;
  revenue: number;
  cost: number;
  roi: number;
}

export interface CampaignSettings {
  autoShare: boolean;
  trackingEnabled: boolean;
  emailReminders: boolean;
  smsNotifications: boolean;
  socialPlatforms: string[];
}

export interface ReferralLink {
  id: string;
  campaignId: string;
  referrerId?: string; // Client who is referring
  code: string;
  url: string;
  createdAt: string;
  expiresAt?: string;
  uses: number;
  maxUses?: number;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  source: "website" | "social" | "referral" | "walkin" | "google" | "facebook";
  sourceDetails?: string; // Campaign ID, referrer name, etc.
  status: "new" | "contacted" | "consultation_scheduled" | "converted" | "lost";
  createdAt: string;
  lastContactAt?: string;
  notes: LeadNote[];
  interests: string[];
  budget?: string;
  preferredTime?: string;
  conversionDate?: string;
  conversionValue?: number;
}

export interface LeadNote {
  id: string;
  content: string;
  createdAt: string;
  type: "call" | "email" | "meeting" | "sms" | "general";
}

export interface SocialPost {
  id: string;
  content: string;
  mediaUrls: string[];
  platforms: ("facebook" | "instagram" | "twitter" | "linkedin")[];
  scheduledFor?: string;
  publishedAt?: string;
  status: "draft" | "scheduled" | "published" | "failed";
  campaignId?: string;
  metrics: SocialPostMetrics;
}

export interface SocialPostMetrics {
  likes: number;
  comments: number;
  shares: number;
  reach: number;
  engagement: number;
}

export interface EmailCampaign {
  id: string;
  subject: string;
  content: string;
  recipients: string[];
  scheduledFor?: string;
  sentAt?: string;
  status: "draft" | "scheduled" | "sent" | "failed";
  metrics: EmailMetrics;
}

export interface EmailMetrics {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  unsubscribed: number;
}

export interface MarketingAutomation {
  id: string;
  name: string;
  trigger: AutomationTrigger;
  actions: AutomationAction[];
  isActive: boolean;
  createdAt: string;
  lastTriggered?: string;
  totalExecutions: number;
}

export interface AutomationTrigger {
  type:
    | "new_lead"
    | "session_completed"
    | "payment_received"
    | "client_milestone"
    | "date_based";
  conditions: Record<string, any>;
}

export interface AutomationAction {
  type:
    | "send_email"
    | "send_sms"
    | "create_task"
    | "add_tag"
    | "schedule_followup";
  data: Record<string, any>;
  delay?: number; // in hours
}

export interface MarketingAsset {
  id: string;
  name: string;
  type: "qr_code" | "flyer" | "business_card" | "booking_widget" | "banner";
  url: string;
  downloadUrl?: string;
  createdAt: string;
  lastUsed?: string;
  useCount: number;
}

export interface Testimonial {
  id: string;
  clientId: string;
  rating: number;
  content: string;
  isPublic: boolean;
  isApproved: boolean;
  createdAt: string;
  approvedAt?: string;
  mediaUrls: string[];
  tags: string[];
}

export interface MarketingMetrics {
  period: "week" | "month" | "quarter" | "year";
  totalLeads: number;
  convertedLeads: number;
  conversionRate: number;
  averageLeadValue: number;
  totalRevenue: number;
  marketingCost: number;
  roi: number;
  topSources: Array<{
    source: string;
    leads: number;
    conversions: number;
    revenue: number;
  }>;
  campaignPerformance: Array<{
    campaignId: string;
    name: string;
    clicks: number;
    conversions: number;
    cost: number;
    revenue: number;
    roi: number;
  }>;
}
