import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Share2,
  Users,
  TrendingUp,
  Target,
  BarChart3,
  Settings,
} from "lucide-react";
import { CampaignManager } from "./CampaignManager";
import { LeadManager } from "./LeadManager";
import { SocialMediaManager } from "./SocialMediaManager";
import { MarketingAnalytics } from "./MarketingAnalytics";
import { useMarketing } from "@/contexts/MarketingContext";

export const MarketingHub = () => {
  const { metrics, loading } = useMarketing();
  const [activeTab, setActiveTab] = useState("overview");

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Marketing Hub</h2>
          <p className="text-muted-foreground">
            Comprehensive marketing automation and analytics platform
          </p>
        </div>
        <Badge className="bg-purple-100 text-purple-800">Live Data</Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium">Total Leads</span>
          </div>
          <div className="text-2xl font-bold">{metrics.totalLeads}</div>
          <p className="text-xs text-blue-600">This month</p>
        </div>

        <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">Conversion Rate</span>
          </div>
          <div className="text-2xl font-bold">
            {metrics.conversionRate.toFixed(1)}%
          </div>
          <p className="text-xs text-green-600">Lead to client</p>
        </div>

        <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium">Revenue</span>
          </div>
          <div className="text-2xl font-bold">${metrics.totalRevenue}</div>
          <p className="text-xs text-purple-600">From marketing</p>
        </div>

        <div className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-medium">ROI</span>
          </div>
          <div className="text-2xl font-bold">{metrics.roi.toFixed(1)}%</div>
          <p className="text-xs text-orange-600">Return on investment</p>
        </div>
      </div>

      {/* Marketing Management Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Campaigns
          </TabsTrigger>
          <TabsTrigger value="leads" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Leads
          </TabsTrigger>
          <TabsTrigger value="social" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Social Media
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <MarketingAnalytics />
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <CampaignManager />
        </TabsContent>

        <TabsContent value="leads" className="space-y-6">
          <LeadManager />
        </TabsContent>

        <TabsContent value="social" className="space-y-6">
          <SocialMediaManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};
