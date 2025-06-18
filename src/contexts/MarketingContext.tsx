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
import { MarketingService } from "@/lib/marketingService";
import { useToast } from "@/hooks/use-toast";

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

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setCampaigns(MarketingService.getCampaigns());
        setLeads(MarketingService.getLeads());
        setReferralLinks(MarketingService.getReferralLinks());
        setSocialPosts(MarketingService.getSocialPosts());
        setEmailCampaigns(MarketingService.getEmailCampaigns());
        setMarketingAssets(MarketingService.getMarketingAssets());
        setTestimonials(MarketingService.getTestimonials());
        setMetrics(MarketingService.getMarketingMetrics());
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
  }, [toast]);

  // Campaign operations
  const createCampaign = async (
    campaignData: Omit<MarketingCampaign, "id" | "createdAt" | "metrics">,
  ) => {
    try {
      const newCampaign = MarketingService.createCampaign(campaignData);
      setCampaigns((prev) => [...prev, newCampaign]);
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
      MarketingService.updateCampaign(id, updates);
      setCampaigns((prev) =>
        prev.map((campaign) =>
          campaign.id === id ? { ...campaign, ...updates } : campaign,
        ),
      );
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
      MarketingService.deleteCampaign(id);
      setCampaigns((prev) => prev.filter((campaign) => campaign.id !== id));
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
    const campaign = campaigns.find((c) => c.id === id);
    if (campaign) {
      const newStatus = campaign.status === "active" ? "paused" : "active";
      await updateCampaign(id, { status: newStatus });
    }
  };

  // Lead operations
  const createLead = async (
    leadData: Omit<Lead, "id" | "createdAt" | "notes">,
  ) => {
    try {
      const newLead = MarketingService.createLead(leadData);
      setLeads((prev) => [...prev, newLead]);

      // Auto-track campaign metrics if from referral
      if (leadData.source === "referral" && leadData.sourceDetails) {
        const campaign = campaigns.find(
          (c) => c.title === leadData.sourceDetails,
        );
        if (campaign) {
          await updateCampaign(campaign.id, {
            metrics: {
              ...campaign.metrics,
              conversions: campaign.metrics.conversions + 1,
            },
          });
        }
      }

      toast({
        title: "Success",
        description: "New lead added successfully",
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
      MarketingService.updateLead(id, { status });
      setLeads((prev) =>
        prev.map((lead) => (lead.id === id ? { ...lead, status } : lead)),
      );
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
      MarketingService.addLeadNote(leadId, note);
      const updatedLeads = MarketingService.getLeads();
      setLeads(updatedLeads);
      toast({
        title: "Success",
        description: "Note added successfully",
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
      MarketingService.updateLead(leadId, {
        status: "converted",
        conversionDate: new Date().toISOString(),
        conversionValue,
      });
      setLeads((prev) =>
        prev.map((lead) =>
          lead.id === leadId
            ? {
                ...lead,
                status: "converted" as const,
                conversionDate: new Date().toISOString(),
                conversionValue,
              }
            : lead,
        ),
      );
      refreshMetrics();
      toast({
        title: "Success",
        description: "Lead converted successfully!",
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
    const newLink = MarketingService.createReferralLink(
      campaignId,
      referrerId,
      maxUses,
    );
    setReferralLinks((prev) => [...prev, newLink]);
    return newLink;
  };

  const trackReferralClick = async (code: string): Promise<boolean> => {
    const success = MarketingService.trackReferralClick(code);
    if (success) {
      setReferralLinks(MarketingService.getReferralLinks());
    }
    return success;
  };

  const copyReferralLink = async (campaignId: string) => {
    try {
      let existingLink = referralLinks.find(
        (link) => link.campaignId === campaignId,
      );

      if (!existingLink) {
        existingLink = await createReferralLink(campaignId);
      }

      await navigator.clipboard.writeText(existingLink.url);
      toast({
        title: "Success",
        description: "Referral link copied to clipboard!",
      });
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
      const newPost = MarketingService.createSocialPost(postData);
      setSocialPosts((prev) => [...prev, newPost]);
      toast({
        title: "Success",
        description: "Social post created successfully",
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
      MarketingService.publishSocialPost(id);
      setSocialPosts((prev) =>
        prev.map((post) =>
          post.id === id
            ? {
                ...post,
                status: "published" as const,
                publishedAt: new Date().toISOString(),
              }
            : post,
        ),
      );
      toast({
        title: "Success",
        description: "Post published successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to publish post",
        variant: "destructive",
      });
    }
  };

  const scheduleSocialPost = async (id: string, scheduledFor: string) => {
    try {
      const updates = { scheduledFor, status: "scheduled" as const };
      setSocialPosts((prev) =>
        prev.map((post) => (post.id === id ? { ...post, ...updates } : post)),
      );
      toast({
        title: "Success",
        description: "Post scheduled successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to schedule post",
        variant: "destructive",
      });
    }
  };

  // Email operations
  const createEmailCampaign = async (
    campaignData: Omit<EmailCampaign, "id" | "metrics">,
  ) => {
    try {
      const newCampaign = MarketingService.createEmailCampaign(campaignData);
      setEmailCampaigns((prev) => [...prev, newCampaign]);
      toast({
        title: "Success",
        description: "Email campaign created successfully",
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
      // Simulate sending email
      setEmailCampaigns((prev) =>
        prev.map((campaign) =>
          campaign.id === id
            ? {
                ...campaign,
                status: "sent" as const,
                sentAt: new Date().toISOString(),
                metrics: {
                  ...campaign.metrics,
                  sent: campaign.recipients.length,
                  delivered: Math.floor(campaign.recipients.length * 0.95),
                  opened: Math.floor(campaign.recipients.length * 0.25),
                  clicked: Math.floor(campaign.recipients.length * 0.05),
                },
              }
            : campaign,
        ),
      );
      toast({
        title: "Success",
        description: "Email campaign sent successfully!",
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
  const generateQRCode = async (
    data: string,
    name: string,
  ): Promise<MarketingAsset> => {
    const qrUrl = MarketingService.generateQRCode(data);
    const asset = MarketingService.createMarketingAsset({
      name,
      type: "qr_code",
      url: qrUrl,
      downloadUrl: MarketingService.generateQRCode(data, 400),
    });
    setMarketingAssets((prev) => [...prev, asset]);
    toast({
      title: "Success",
      description: "QR code generated successfully",
    });
    return asset;
  };

  const createBookingWidget = async (name: string): Promise<MarketingAsset> => {
    const widgetCode = `<iframe src="https://fitclient.app/widget/book" width="100%" height="400" frameborder="0"></iframe>`;
    const asset = MarketingService.createMarketingAsset({
      name,
      type: "booking_widget",
      url: widgetCode,
    });
    setMarketingAssets((prev) => [...prev, asset]);
    toast({
      title: "Success",
      description: "Booking widget created successfully",
    });
    return asset;
  };

  // Testimonial operations
  const createTestimonial = async (
    testimonialData: Omit<Testimonial, "id" | "createdAt" | "isApproved">,
  ) => {
    try {
      const newTestimonial =
        MarketingService.createTestimonial(testimonialData);
      setTestimonials((prev) => [...prev, newTestimonial]);
      toast({
        title: "Success",
        description: "Testimonial created successfully",
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
      MarketingService.approveTestimonial(id);
      setTestimonials((prev) =>
        prev.map((testimonial) =>
          testimonial.id === id
            ? {
                ...testimonial,
                isApproved: true,
                approvedAt: new Date().toISOString(),
              }
            : testimonial,
        ),
      );
      toast({
        title: "Success",
        description: "Testimonial approved successfully",
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
      const newMetrics = MarketingService.getMarketingMetrics();
      setMetrics(newMetrics);
    } catch (error) {
      console.error("Failed to refresh metrics:", error);
    }
  };

  const getMetricsByPeriod = async (
    period: "week" | "month" | "quarter" | "year",
  ): Promise<MarketingMetrics> => {
    const newMetrics = MarketingService.getMarketingMetrics(period);
    setMetrics(newMetrics);
    return newMetrics;
  };

  const value: MarketingContextType = {
    // State
    campaigns,
    leads,
    referralLinks,
    socialPosts,
    emailCampaigns,
    marketingAssets,
    testimonials,
    metrics,
    loading,

    // Campaign operations
    createCampaign,
    updateCampaign,
    deleteCampaign,
    toggleCampaignStatus,

    // Lead operations
    createLead,
    updateLeadStatus,
    addLeadNote,
    convertLead,

    // Referral operations
    createReferralLink,
    trackReferralClick,
    copyReferralLink,

    // Social media operations
    createSocialPost,
    publishSocialPost,
    scheduleSocialPost,

    // Email operations
    createEmailCampaign,
    sendEmailCampaign,

    // Asset operations
    generateQRCode,
    createBookingWidget,

    // Testimonial operations
    createTestimonial,
    approveTestimonial,

    // Analytics
    refreshMetrics,
    getMetricsByPeriod,
  };

  return (
    <MarketingContext.Provider value={value}>
      {children}
    </MarketingContext.Provider>
  );
};
