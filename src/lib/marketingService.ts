import {
  MarketingCampaign,
  Lead,
  ReferralLink,
  SocialPost,
  EmailCampaign,
  MarketingAsset,
  Testimonial,
  MarketingMetrics,
  MarketingAutomation,
} from "./marketingTypes";

// Local storage keys
const STORAGE_KEYS = {
  campaigns: "fitclient_marketing_campaigns",
  leads: "fitclient_marketing_leads",
  referrals: "fitclient_marketing_referrals",
  posts: "fitclient_social_posts",
  emails: "fitclient_email_campaigns",
  assets: "fitclient_marketing_assets",
  testimonials: "fitclient_testimonials",
  automations: "fitclient_marketing_automations",
};

// Utility functions
const generateId = () =>
  Date.now().toString() + Math.random().toString(36).substr(2, 9);
const generateCode = () =>
  Math.random().toString(36).substr(2, 8).toUpperCase();

// Storage helpers
const getStorageData = <T>(key: string, defaultValue: T[] = []): T[] => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const setStorageData = <T>(key: string, data: T[]): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save to localStorage:", error);
  }
};

export class MarketingService {
  // Campaign Management
  static getCampaigns(): MarketingCampaign[] {
    return getStorageData<MarketingCampaign>(STORAGE_KEYS.campaigns, [
      {
        id: "1",
        title: "New Year Transformation",
        description: "Get 20% off first month + free assessment",
        type: "referral",
        status: "active",
        createdAt: new Date().toISOString(),
        startDate: new Date().toISOString(),
        targetAudience: "New clients looking for weight loss",
        discountType: "percentage",
        discountValue: 20,
        referralReward: 50,
        metrics: {
          views: 245,
          clicks: 89,
          conversions: 12,
          shares: 34,
          revenue: 2400,
          cost: 200,
          roi: 1100,
        },
        settings: {
          autoShare: true,
          trackingEnabled: true,
          emailReminders: true,
          smsNotifications: false,
          socialPlatforms: ["facebook", "instagram"],
        },
      },
      {
        id: "2",
        title: "Friend Referral Program",
        description: "Both you and your friend get $50 credit",
        type: "referral",
        status: "active",
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        targetAudience: "Existing clients",
        discountType: "fixed",
        discountValue: 50,
        referralReward: 50,
        metrics: {
          views: 178,
          clicks: 67,
          conversions: 8,
          shares: 23,
          revenue: 1600,
          cost: 150,
          roi: 966,
        },
        settings: {
          autoShare: false,
          trackingEnabled: true,
          emailReminders: true,
          smsNotifications: true,
          socialPlatforms: ["instagram"],
        },
      },
    ]);
  }

  static createCampaign(
    campaign: Omit<MarketingCampaign, "id" | "createdAt" | "metrics">,
  ): MarketingCampaign {
    const newCampaign: MarketingCampaign = {
      ...campaign,
      id: generateId(),
      createdAt: new Date().toISOString(),
      metrics: {
        views: 0,
        clicks: 0,
        conversions: 0,
        shares: 0,
        revenue: 0,
        cost: 0,
        roi: 0,
      },
    };

    const campaigns = this.getCampaigns();
    campaigns.push(newCampaign);
    setStorageData(STORAGE_KEYS.campaigns, campaigns);
    return newCampaign;
  }

  static updateCampaign(id: string, updates: Partial<MarketingCampaign>): void {
    const campaigns = this.getCampaigns();
    const index = campaigns.findIndex((c) => c.id === id);
    if (index !== -1) {
      campaigns[index] = { ...campaigns[index], ...updates };
      setStorageData(STORAGE_KEYS.campaigns, campaigns);
    }
  }

  static deleteCampaign(id: string): void {
    const campaigns = this.getCampaigns().filter((c) => c.id !== id);
    setStorageData(STORAGE_KEYS.campaigns, campaigns);
  }

  // Lead Management
  static getLeads(): Lead[] {
    return getStorageData<Lead>(STORAGE_KEYS.leads, [
      {
        id: "1",
        name: "Sarah Johnson",
        email: "sarah.j@email.com",
        phone: "(555) 123-4567",
        source: "referral",
        sourceDetails: "Friend Referral Program",
        status: "consultation_scheduled",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        lastContactAt: new Date(
          Date.now() - 1 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        notes: [
          {
            id: "1",
            content: "Interested in weight loss. Prefers morning sessions.",
            createdAt: new Date(
              Date.now() - 1 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            type: "call",
          },
        ],
        interests: ["weight loss", "strength training"],
        budget: "$150-200/month",
        preferredTime: "Morning",
      },
      {
        id: "2",
        name: "Mike Chen",
        email: "mike.chen@email.com",
        phone: "(555) 987-6543",
        source: "website",
        sourceDetails: "Contact form",
        status: "new",
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        notes: [],
        interests: ["muscle building", "nutrition"],
        budget: "$200-300/month",
        preferredTime: "Evening",
      },
      {
        id: "3",
        name: "Lisa Rodriguez",
        email: "lisa.r@email.com",
        source: "social",
        sourceDetails: "Instagram ad",
        status: "contacted",
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        lastContactAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        notes: [
          {
            id: "2",
            content: "Responded to DM. Wants to know about group sessions.",
            createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
            type: "sms",
          },
        ],
        interests: ["group fitness", "cardio"],
        budget: "$100-150/month",
      },
    ]);
  }

  static createLead(lead: Omit<Lead, "id" | "createdAt" | "notes">): Lead {
    const newLead: Lead = {
      ...lead,
      id: generateId(),
      createdAt: new Date().toISOString(),
      notes: [],
    };

    const leads = this.getLeads();
    leads.push(newLead);
    setStorageData(STORAGE_KEYS.leads, leads);
    return newLead;
  }

  static updateLead(id: string, updates: Partial<Lead>): void {
    const leads = this.getLeads();
    const index = leads.findIndex((l) => l.id === id);
    if (index !== -1) {
      leads[index] = { ...leads[index], ...updates };
      setStorageData(STORAGE_KEYS.leads, leads);
    }
  }

  static addLeadNote(
    leadId: string,
    note: Omit<Lead["notes"][0], "id" | "createdAt">,
  ): void {
    const leads = this.getLeads();
    const lead = leads.find((l) => l.id === leadId);
    if (lead) {
      const newNote = {
        ...note,
        id: generateId(),
        createdAt: new Date().toISOString(),
      };
      lead.notes.push(newNote);
      lead.lastContactAt = new Date().toISOString();
      setStorageData(STORAGE_KEYS.leads, leads);
    }
  }

  // Referral Links
  static getReferralLinks(): ReferralLink[] {
    return getStorageData<ReferralLink>(STORAGE_KEYS.referrals, []);
  }

  static createReferralLink(
    campaignId: string,
    referrerId?: string,
    maxUses?: number,
  ): ReferralLink {
    const code = generateCode();
    const link: ReferralLink = {
      id: generateId(),
      campaignId,
      referrerId,
      code,
      url: `https://fitclient.app/ref/${code}`,
      createdAt: new Date().toISOString(),
      uses: 0,
      maxUses,
    };

    const links = this.getReferralLinks();
    links.push(link);
    setStorageData(STORAGE_KEYS.referrals, links);
    return link;
  }

  static trackReferralClick(code: string): boolean {
    const links = this.getReferralLinks();
    const link = links.find((l) => l.code === code);
    if (link && (!link.maxUses || link.uses < link.maxUses)) {
      link.uses++;
      setStorageData(STORAGE_KEYS.referrals, links);
      return true;
    }
    return false;
  }

  // Social Media
  static getSocialPosts(): SocialPost[] {
    return getStorageData<SocialPost>(STORAGE_KEYS.posts, []);
  }

  static createSocialPost(
    post: Omit<SocialPost, "id" | "metrics">,
  ): SocialPost {
    const newPost: SocialPost = {
      ...post,
      id: generateId(),
      metrics: {
        likes: 0,
        comments: 0,
        shares: 0,
        reach: 0,
        engagement: 0,
      },
    };

    const posts = this.getSocialPosts();
    posts.push(newPost);
    setStorageData(STORAGE_KEYS.posts, posts);
    return newPost;
  }

  static publishSocialPost(id: string): void {
    const posts = this.getSocialPosts();
    const post = posts.find((p) => p.id === id);
    if (post) {
      post.status = "published";
      post.publishedAt = new Date().toISOString();
      setStorageData(STORAGE_KEYS.posts, posts);
    }
  }

  // Marketing Assets
  static getMarketingAssets(): MarketingAsset[] {
    return getStorageData<MarketingAsset>(STORAGE_KEYS.assets, [
      {
        id: "1",
        name: "QR Code - Free Consultation",
        type: "qr_code",
        url: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://fitclient.app/book",
        downloadUrl:
          "https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=https://fitclient.app/book",
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        lastUsed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        useCount: 15,
      },
      {
        id: "2",
        name: "Booking Widget Embed",
        type: "booking_widget",
        url: '<iframe src="https://fitclient.app/widget/book" width="100%" height="400"></iframe>',
        createdAt: new Date(
          Date.now() - 14 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        lastUsed: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        useCount: 8,
      },
    ]);
  }

  static createMarketingAsset(
    asset: Omit<MarketingAsset, "id" | "createdAt" | "useCount">,
  ): MarketingAsset {
    const newAsset: MarketingAsset = {
      ...asset,
      id: generateId(),
      createdAt: new Date().toISOString(),
      useCount: 0,
    };

    const assets = this.getMarketingAssets();
    assets.push(newAsset);
    setStorageData(STORAGE_KEYS.assets, assets);
    return newAsset;
  }

  // Generate QR Code
  static generateQRCode(data: string, size: number = 200): string {
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}`;
  }

  // Analytics
  static getMarketingMetrics(
    period: "week" | "month" | "quarter" | "year" = "month",
  ): MarketingMetrics {
    const campaigns = this.getCampaigns();
    const leads = this.getLeads();

    // Filter data based on period
    const now = new Date();
    const periodStart = new Date();
    switch (period) {
      case "week":
        periodStart.setDate(now.getDate() - 7);
        break;
      case "month":
        periodStart.setMonth(now.getMonth() - 1);
        break;
      case "quarter":
        periodStart.setMonth(now.getMonth() - 3);
        break;
      case "year":
        periodStart.setFullYear(now.getFullYear() - 1);
        break;
    }

    const periodLeads = leads.filter(
      (lead) => new Date(lead.createdAt) >= periodStart,
    );
    const convertedLeads = periodLeads.filter(
      (lead) => lead.status === "converted",
    );

    const totalRevenue = campaigns.reduce(
      (sum, campaign) => sum + campaign.metrics.revenue,
      0,
    );
    const totalCost = campaigns.reduce(
      (sum, campaign) => sum + campaign.metrics.cost,
      0,
    );

    // Calculate source performance
    const sourceMap = new Map();
    periodLeads.forEach((lead) => {
      const source = sourceMap.get(lead.source) || {
        leads: 0,
        conversions: 0,
        revenue: 0,
      };
      source.leads++;
      if (lead.status === "converted") {
        source.conversions++;
        source.revenue += lead.conversionValue || 0;
      }
      sourceMap.set(lead.source, source);
    });

    const topSources = Array.from(sourceMap.entries()).map(
      ([source, data]) => ({
        source,
        ...data,
      }),
    );

    return {
      period,
      totalLeads: periodLeads.length,
      convertedLeads: convertedLeads.length,
      conversionRate:
        periodLeads.length > 0
          ? (convertedLeads.length / periodLeads.length) * 100
          : 0,
      averageLeadValue:
        convertedLeads.length > 0
          ? convertedLeads.reduce(
              (sum, lead) => sum + (lead.conversionValue || 0),
              0,
            ) / convertedLeads.length
          : 0,
      totalRevenue,
      marketingCost: totalCost,
      roi: totalCost > 0 ? ((totalRevenue - totalCost) / totalCost) * 100 : 0,
      topSources,
      campaignPerformance: campaigns.map((campaign) => ({
        campaignId: campaign.id,
        name: campaign.title,
        clicks: campaign.metrics.clicks,
        conversions: campaign.metrics.conversions,
        cost: campaign.metrics.cost,
        revenue: campaign.metrics.revenue,
        roi: campaign.metrics.roi,
      })),
    };
  }

  // Email campaigns
  static getEmailCampaigns(): EmailCampaign[] {
    return getStorageData<EmailCampaign>(STORAGE_KEYS.emails, []);
  }

  static createEmailCampaign(
    campaign: Omit<EmailCampaign, "id" | "metrics">,
  ): EmailCampaign {
    const newCampaign: EmailCampaign = {
      ...campaign,
      id: generateId(),
      metrics: {
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        bounced: 0,
        unsubscribed: 0,
      },
    };

    const campaigns = this.getEmailCampaigns();
    campaigns.push(newCampaign);
    setStorageData(STORAGE_KEYS.emails, campaigns);
    return newCampaign;
  }

  // Testimonials
  static getTestimonials(): Testimonial[] {
    return getStorageData<Testimonial>(STORAGE_KEYS.testimonials, []);
  }

  static createTestimonial(
    testimonial: Omit<Testimonial, "id" | "createdAt" | "isApproved">,
  ): Testimonial {
    const newTestimonial: Testimonial = {
      ...testimonial,
      id: generateId(),
      createdAt: new Date().toISOString(),
      isApproved: false,
    };

    const testimonials = this.getTestimonials();
    testimonials.push(newTestimonial);
    setStorageData(STORAGE_KEYS.testimonials, testimonials);
    return newTestimonial;
  }

  static approveTestimonial(id: string): void {
    const testimonials = this.getTestimonials();
    const testimonial = testimonials.find((t) => t.id === id);
    if (testimonial) {
      testimonial.isApproved = true;
      testimonial.approvedAt = new Date().toISOString();
      setStorageData(STORAGE_KEYS.testimonials, testimonials);
    }
  }
}
