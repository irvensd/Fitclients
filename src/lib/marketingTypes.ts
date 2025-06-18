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
