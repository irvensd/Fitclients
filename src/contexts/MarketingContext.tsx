import React, { createContext, useContext, useState, useEffect } from "react";
import {
  MarketingCampaign,
  Lead,
  ReferralLink,
  SocialPost,
  EmailCampaign,
  MarketingAsset,
  Testimonial,
  MarketingMetrics,
} from "@/lib/marketingTypes";
import { marketingService } from "@/lib/firebaseService";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "./AuthContext";

interface MarketingContextType {
  // State
  campaigns: MarketingCampaign[];
  leads: Lead[];
  referralLinks: ReferralLink[];
  socialPosts: SocialPost[];
  emailCampaigns: EmailCampaign[];
  marketingAssets: MarketingAsset[];
  testimonials: Testimonial[];
  metrics: MarketingMetrics;
  loading: boolean;

  // Campaign operations
  createCampaign: (
    campaign: Omit<MarketingCampaign, "id" | "createdAt" | "metrics">,
  ) => Promise<void>;
  updateCampaign: (
    id: string,
    updates: Partial<MarketingCampaign>,
  ) => Promise<void>;
  deleteCampaign: (id: string) => Promise<void>;
  toggleCampaignStatus: (id: string) => Promise<void>;

  // Lead operations
  createLead: (lead: Omit<Lead, "id" | "createdAt" | "notes">) => Promise<void>;
  updateLeadStatus: (id: string, status: Lead["status"]) => Promise<void>;
  addLeadNote: (
    leadId: string,
    note: Omit<Lead["notes"][0], "id" | "createdAt">,
  ) => Promise<void>;
  convertLead: (leadId: string, conversionValue: number) => Promise<void>;

  // Referral operations
  createReferralLink: (
    campaignId: string,
    referrerId?: string,
    maxUses?: number,
  ) => Promise<ReferralLink>;
  trackReferralClick: (code: string) => Promise<boolean>;
  copyReferralLink: (campaignId: string) => Promise<void>;

  // Social media operations
  createSocialPost: (post: Omit<SocialPost, "id" | "metrics">) => Promise<void>;
  publishSocialPost: (id: string) => Promise<void>;
  scheduleSocialPost: (id: string, scheduledFor: string) => Promise<void>;

  // Email operations
  createEmailCampaign: (
    campaign: Omit<EmailCampaign, "id" | "metrics">,
  ) => Promise<void>;
  sendEmailCampaign: (id: string) => Promise<void>;

  // Asset operations
  generateQRCode: (data: string, name: string) => Promise<MarketingAsset>;
  createBookingWidget: (name: string) => Promise<MarketingAsset>;

  // Testimonial operations
  createTestimonial: (
    testimonial: Omit<Testimonial, "id" | "createdAt" | "isApproved">,
  ) => Promise<void>;
  approveTestimonial: (id: string) => Promise<void>;

  // Analytics
  refreshMetrics: () => Promise<void>;
  getMetricsByPeriod: (
    period: "week" | "month" | "quarter" | "year",
  ) => Promise<MarketingMetrics>;
}

const MarketingContext = createContext<MarketingContextType | undefined>(
  undefined,
);

export const useMarketing = () => {
  const context = useContext(MarketingContext);
  if (!context) {
    throw new Error("useMarketing must be used within a MarketingProvider");
  }
  return context;
};

export const MarketingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [referralLinks, setReferralLinks] = useState<ReferralLink[]>([]);
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([]);
  const [emailCampaigns, setEmailCampaigns] = useState<EmailCampaign[]>([]);
  const [marketingAssets, setMarketingAssets] = useState<MarketingAsset[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [metrics, setMetrics] = useState<MarketingMetrics>({
    period: "month",
    totalLeads: 0,
    convertedLeads: 0,
    conversionRate: 0,
    averageLeadValue: 0,
    totalRevenue: 0,
    marketingCost: 0,
    roi: 0,
    topSources: [],
    campaignPerformance: [],
  });
  const [loading, setLoading] = useState(true);

  const { toast } = useToast();

  // Get trainer ID from user
  const getTrainerId = () => {
    if (!user) throw new Error("User not authenticated");
    return user.uid || user.email || "demo-trainer";
  };

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const trainerId = getTrainerId();
        console.log('Loading marketing data for trainer:', trainerId);
        
        const [
          campaignsData,
          leadsData,
          referralLinksData,
          socialPostsData,
          emailCampaignsData,
          marketingAssetsData,
          testimonialsData,
          metricsData,
        ] = await Promise.all([
          marketingService.getCampaigns(trainerId),
          marketingService.getLeads(trainerId),
          marketingService.getReferralLinks(trainerId),
          marketingService.getSocialPosts(trainerId),
          marketingService.getEmailCampaigns(trainerId),
          marketingService.getMarketingAssets(trainerId),
          marketingService.getTestimonials(trainerId),
          marketingService.getMarketingMetrics(trainerId),
        ]);

        console.log('Data loaded:', {
          campaigns: campaignsData,
          leads: leadsData,
          metrics: metricsData
        });

        setCampaigns(campaignsData as MarketingCampaign[]);
        setLeads(leadsData as Lead[]);
        setReferralLinks(referralLinksData as ReferralLink[]);
        setSocialPosts(socialPostsData as SocialPost[]);
        setEmailCampaigns(emailCampaignsData as EmailCampaign[]);
        setMarketingAssets(marketingAssetsData as MarketingAsset[]);
        setTestimonials(testimonialsData as Testimonial[]);
        setMetrics(metricsData as MarketingMetrics);
      } catch (error) {
        console.error("Failed to load marketing data:", error);
        toast({
          title: "Error",
          description: "Failed to load marketing data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, toast]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return;

    const trainerId = getTrainerId();
    
    const unsubscribeCampaigns = marketingService.subscribeToCampaigns(
      trainerId,
      (campaignsData) => setCampaigns(campaignsData)
    );

    const unsubscribeLeads = marketingService.subscribeToLeads(
      trainerId,
      (leadsData) => setLeads(leadsData)
    );

    const unsubscribeSocialPosts = marketingService.subscribeToSocialPosts(
      trainerId,
      (postsData) => setSocialPosts(postsData)
    );

    return () => {
      unsubscribeCampaigns();
      unsubscribeLeads();
      unsubscribeSocialPosts();
    };
  }, [user]);

  // Campaign operations
  const createCampaign = async (
    campaignData: Omit<MarketingCampaign, "id" | "createdAt" | "metrics">,
  ) => {
    try {
      const trainerId = getTrainerId();
      await marketingService.createCampaign(trainerId, campaignData);
      toast({
        title: "Success",
        description: "Campaign created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create campaign",
        variant: "destructive",
      });
    }
  };

  const updateCampaign = async (
    id: string,
    updates: Partial<MarketingCampaign>,
  ) => {
    try {
      const trainerId = getTrainerId();
      await marketingService.updateCampaign(trainerId, id, updates);
      toast({
        title: "Success",
        description: "Campaign updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update campaign",
        variant: "destructive",
      });
    }
  };

  const deleteCampaign = async (id: string) => {
    try {
      const trainerId = getTrainerId();
      await marketingService.deleteCampaign(trainerId, id);
      toast({
        title: "Success",
        description: "Campaign deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete campaign",
        variant: "destructive",
      });
    }
  };

  const toggleCampaignStatus = async (id: string) => {
    try {
      const campaign = campaigns.find(c => c.id === id);
      if (!campaign) return;

      const newStatus = campaign.status === "active" ? "paused" : "active";
      const trainerId = getTrainerId();
      await marketingService.updateCampaign(trainerId, id, { status: newStatus });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to toggle campaign status",
        variant: "destructive",
      });
    }
  };

  // Lead operations
  const createLead = async (
    leadData: Omit<Lead, "id" | "createdAt" | "notes">,
  ) => {
    try {
      const trainerId = getTrainerId();
      await marketingService.createLead(trainerId, leadData);
      toast({
        title: "Success",
        description: "Lead created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create lead",
        variant: "destructive",
      });
    }
  };

  const updateLeadStatus = async (id: string, status: Lead["status"]) => {
    try {
      const trainerId = getTrainerId();
      await marketingService.updateLead(trainerId, id, { status });
      toast({
        title: "Success",
        description: "Lead status updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update lead status",
        variant: "destructive",
      });
    }
  };

  const addLeadNote = async (
    leadId: string,
    note: Omit<Lead["notes"][0], "id" | "createdAt">,
  ) => {
    try {
      const trainerId = getTrainerId();
      await marketingService.addLeadNote(trainerId, leadId, note);
      toast({
        title: "Success",
        description: "Note added to lead",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add note",
        variant: "destructive",
      });
    }
  };

  const convertLead = async (leadId: string, conversionValue: number) => {
    try {
      const trainerId = getTrainerId();
      await marketingService.updateLead(trainerId, leadId, {
        status: "converted",
        conversionDate: new Date().toISOString(),
        conversionValue,
      });
      toast({
        title: "Success",
        description: "Lead converted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to convert lead",
        variant: "destructive",
      });
    }
  };

  // Referral operations
  const createReferralLink = async (
    campaignId: string,
    referrerId?: string,
    maxUses?: number,
  ): Promise<ReferralLink> => {
    try {
      const trainerId = getTrainerId();
      const referralLink = await marketingService.createReferralLink(trainerId, campaignId, referrerId, maxUses);
      toast({
        title: "Success",
        description: "Referral link created",
      });
      return referralLink as ReferralLink;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create referral link",
        variant: "destructive",
      });
      throw error;
    }
  };

  const trackReferralClick = async (code: string): Promise<boolean> => {
    try {
      const trainerId = getTrainerId();
      return await marketingService.trackReferralClick(trainerId, code);
    } catch (error) {
      console.error("Failed to track referral click:", error);
      return false;
    }
  };

  const copyReferralLink = async (campaignId: string) => {
    try {
      const referralLink = referralLinks.find(r => r.campaignId === campaignId);
      if (referralLink) {
        await navigator.clipboard.writeText(referralLink.url);
        toast({
          title: "Success",
          description: "Referral link copied to clipboard",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy referral link",
        variant: "destructive",
      });
    }
  };

  // Social media operations
  const createSocialPost = async (
    postData: Omit<SocialPost, "id" | "metrics">,
  ) => {
    try {
      const trainerId = getTrainerId();
      await marketingService.createSocialPost(trainerId, postData);
      toast({
        title: "Success",
        description: "Social post created",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create social post",
        variant: "destructive",
      });
    }
  };

  const publishSocialPost = async (id: string) => {
    try {
      const trainerId = getTrainerId();
      await marketingService.updateSocialPost(trainerId, id, {
        status: "published",
        publishedAt: new Date().toISOString(),
      });
      toast({
        title: "Success",
        description: "Social post published",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to publish social post",
        variant: "destructive",
      });
    }
  };

  const scheduleSocialPost = async (id: string, scheduledFor: string) => {
    try {
      const trainerId = getTrainerId();
      await marketingService.updateSocialPost(trainerId, id, {
        status: "scheduled",
        scheduledFor,
      });
      toast({
        title: "Success",
        description: "Social post scheduled",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to schedule social post",
        variant: "destructive",
      });
    }
  };

  // Email operations
  const createEmailCampaign = async (
    campaignData: Omit<EmailCampaign, "id" | "metrics">,
  ) => {
    try {
      const trainerId = getTrainerId();
      await marketingService.createEmailCampaign(trainerId, campaignData);
      toast({
        title: "Success",
        description: "Email campaign created",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create email campaign",
        variant: "destructive",
      });
    }
  };

  const sendEmailCampaign = async (id: string) => {
    try {
      const trainerId = getTrainerId();
      // This would integrate with a real email service like SendGrid
      toast({
        title: "Success",
        description: "Email campaign sent",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send email campaign",
        variant: "destructive",
      });
    }
  };

  // Asset operations
  const generateQRCode = async (data: string, name: string): Promise<MarketingAsset> => {
    try {
      const trainerId = getTrainerId();
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data)}`;
      
      const asset = await marketingService.createMarketingAsset(trainerId, {
        name,
        type: "qr_code",
        url: qrCodeUrl,
        downloadUrl: qrCodeUrl,
      });
      
      toast({
        title: "Success",
        description: "QR code generated",
      });
      
      return asset as MarketingAsset;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate QR code",
        variant: "destructive",
      });
      throw error;
    }
  };

  const createBookingWidget = async (name: string): Promise<MarketingAsset> => {
    try {
      const trainerId = getTrainerId();
      const widgetUrl = "https://fitclient.app/widget/book";
      
      const asset = await marketingService.createMarketingAsset(trainerId, {
        name,
        type: "booking_widget",
        url: widgetUrl,
        downloadUrl: `<iframe src="${widgetUrl}" width="100%" height="400"></iframe>`,
      });
      
      toast({
        title: "Success",
        description: "Booking widget created",
      });
      
      return asset as MarketingAsset;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create booking widget",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Testimonial operations
  const createTestimonial = async (
    testimonialData: Omit<Testimonial, "id" | "createdAt" | "isApproved">,
  ) => {
    try {
      const trainerId = getTrainerId();
      await marketingService.createTestimonial(trainerId, testimonialData);
      toast({
        title: "Success",
        description: "Testimonial created",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create testimonial",
        variant: "destructive",
      });
    }
  };

  const approveTestimonial = async (id: string) => {
    try {
      const trainerId = getTrainerId();
      await marketingService.approveTestimonial(trainerId, id);
      toast({
        title: "Success",
        description: "Testimonial approved",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve testimonial",
        variant: "destructive",
      });
    }
  };

  // Analytics
  const refreshMetrics = async () => {
    try {
      const trainerId = getTrainerId();
      console.log('Refreshing metrics for trainer:', trainerId);
      const metricsData = await marketingService.getMarketingMetrics(trainerId);
      console.log('Metrics data received:', metricsData);
      setMetrics(metricsData as MarketingMetrics);
    } catch (error) {
      console.error('Error refreshing metrics:', error);
      toast({
        title: "Error",
        description: "Failed to refresh metrics",
        variant: "destructive",
      });
    }
  };

  const getMetricsByPeriod = async (
    period: "week" | "month" | "quarter" | "year",
  ): Promise<MarketingMetrics> => {
    try {
      const trainerId = getTrainerId();
      const metricsData = await marketingService.getMarketingMetrics(trainerId, period);
      return metricsData as MarketingMetrics;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get metrics",
        variant: "destructive",
      });
      throw error;
    }
  };

  const value: MarketingContextType = {
    campaigns,
    leads,
    referralLinks,
    socialPosts,
    emailCampaigns,
    marketingAssets,
    testimonials,
    metrics,
    loading,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    toggleCampaignStatus,
    createLead,
    updateLeadStatus,
    addLeadNote,
    convertLead,
    createReferralLink,
    trackReferralClick,
    copyReferralLink,
    createSocialPost,
    publishSocialPost,
    scheduleSocialPost,
    createEmailCampaign,
    sendEmailCampaign,
    generateQRCode,
    createBookingWidget,
    createTestimonial,
    approveTestimonial,
    refreshMetrics,
    getMetricsByPeriod,
  };

  return (
    <MarketingContext.Provider value={value}>
      {children}
    </MarketingContext.Provider>
  );
};
