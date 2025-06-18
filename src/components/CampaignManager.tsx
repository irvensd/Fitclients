import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  Plus,
  Play,
  Pause,
  Copy,
  Share2,
  TrendingUp,
  DollarSign,
  Users,
  Target,
  Edit,
  Trash2,
} from "lucide-react";
import { useMarketing } from "@/contexts/MarketingContext";
import { MarketingCampaign } from "@/lib/marketingTypes";

interface CreateCampaignForm {
  title: string;
  description: string;
  type: "referral" | "social" | "email" | "promo";
  targetAudience: string;
  discountType?: "percentage" | "fixed";
  discountValue?: number;
  referralReward?: number;
  budget?: number;
  startDate: string;
  endDate?: string;
}

export const CampaignManager: React.FC = () => {
  const {
    campaigns,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    toggleCampaignStatus,
    copyReferralLink,
  } = useMarketing();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] =
    useState<MarketingCampaign | null>(null);
  const [formData, setFormData] = useState<CreateCampaignForm>({
    title: "",
    description: "",
    type: "referral",
    targetAudience: "",
    startDate: new Date().toISOString().split("T")[0],
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      type: "referral",
      targetAudience: "",
      startDate: new Date().toISOString().split("T")[0],
    });
  };

  const handleCreateCampaign = async () => {
    try {
      await createCampaign({
        ...formData,
        settings: {
          autoShare: true,
          trackingEnabled: true,
          emailReminders: true,
          smsNotifications: false,
          socialPlatforms: ["facebook", "instagram"],
        },
        status: "draft",
      });
      setIsCreateDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Failed to create campaign:", error);
    }
  };

  const handleEditCampaign = async () => {
    if (!editingCampaign) return;

    try {
      await updateCampaign(editingCampaign.id, formData);
      setIsEditDialogOpen(false);
      setEditingCampaign(null);
      resetForm();
    } catch (error) {
      console.error("Failed to update campaign:", error);
    }
  };

  const openEditDialog = (campaign: MarketingCampaign) => {
    setEditingCampaign(campaign);
    setFormData({
      title: campaign.title,
      description: campaign.description,
      type: campaign.type,
      targetAudience: campaign.targetAudience,
      discountType: campaign.discountType,
      discountValue: campaign.discountValue,
      referralReward: campaign.referralReward,
      budget: campaign.budget,
      startDate: campaign.startDate.split("T")[0],
      endDate: campaign.endDate?.split("T")[0],
    });
    setIsEditDialogOpen(true);
  };

  const handleCopyLink = async (campaignId: string) => {
    await copyReferralLink(campaignId);
  };

  const getStatusColor = (status: MarketingCampaign["status"]) => {
    switch (status) {
      case "active":
        return "default";
      case "paused":
        return "secondary";
      case "completed":
        return "outline";
      case "draft":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getStatusIcon = (status: MarketingCampaign["status"]) => {
    return status === "active" ? (
      <Play className="h-3 w-3" />
    ) : (
      <Pause className="h-3 w-3" />
    );
  };

  const calculateProgress = (campaign: MarketingCampaign) => {
    if (!campaign.endDate) return 100;

    const now = new Date();
    const start = new Date(campaign.startDate);
    const end = new Date(campaign.endDate);

    if (now < start) return 0;
    if (now > end) return 100;

    const total = end.getTime() - start.getTime();
    const elapsed = now.getTime() - start.getTime();

    return Math.round((elapsed / total) * 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Marketing Campaigns</h3>
          <p className="text-sm text-muted-foreground">
            Create and manage your marketing campaigns
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Campaign</DialogTitle>
              <DialogDescription>
                Set up a new marketing campaign to grow your business
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Campaign Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="e.g., New Year Transformation"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Campaign Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: any) =>
                      setFormData({ ...formData, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="referral">Referral Program</SelectItem>
                      <SelectItem value="social">Social Media</SelectItem>
                      <SelectItem value="email">Email Campaign</SelectItem>
                      <SelectItem value="promo">Promotional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe your campaign offer..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetAudience">Target Audience</Label>
                <Input
                  id="targetAudience"
                  value={formData.targetAudience}
                  onChange={(e) =>
                    setFormData({ ...formData, targetAudience: e.target.value })
                  }
                  placeholder="e.g., New clients looking for weight loss"
                />
              </div>

              {formData.type === "referral" && (
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="discountType">Discount Type</Label>
                    <Select
                      value={formData.discountType}
                      onValueChange={(value: any) =>
                        setFormData({ ...formData, discountType: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="fixed">Fixed Amount</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discountValue">Discount Value</Label>
                    <Input
                      id="discountValue"
                      type="number"
                      value={formData.discountValue || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          discountValue: Number(e.target.value),
                        })
                      }
                      placeholder={
                        formData.discountType === "percentage" ? "20" : "50"
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="referralReward">Referral Reward ($)</Label>
                    <Input
                      id="referralReward"
                      type="number"
                      value={formData.referralReward || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          referralReward: Number(e.target.value),
                        })
                      }
                      placeholder="50"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date (Optional)</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Budget (Optional)</Label>
                <Input
                  id="budget"
                  type="number"
                  value={formData.budget || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      budget: Number(e.target.value),
                    })
                  }
                  placeholder="500"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateCampaign}>Create Campaign</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Campaign Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Campaign</DialogTitle>
            <DialogDescription>
              Update your campaign settings and details
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Same form fields as create campaign */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Campaign Title</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-type">Campaign Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="referral">Referral Program</SelectItem>
                    <SelectItem value="social">Social Media</SelectItem>
                    <SelectItem value="email">Email Campaign</SelectItem>
                    <SelectItem value="promo">Promotional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleEditCampaign}>Update Campaign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Campaign List */}
      <div className="grid gap-4">
        {campaigns.map((campaign) => (
          <Card key={campaign.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-lg">{campaign.title}</CardTitle>
                  <Badge variant={getStatusColor(campaign.status)}>
                    {getStatusIcon(campaign.status)}
                    <span className="ml-1 capitalize">{campaign.status}</span>
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(campaign)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleCampaignStatus(campaign.id)}
                  >
                    {campaign.status === "active" ? (
                      <Pause className="h-3 w-3" />
                    ) : (
                      <Play className="h-3 w-3" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyLink(campaign.id)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <CardDescription>{campaign.description}</CardDescription>

              {campaign.endDate && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Campaign Progress</span>
                    <span>{calculateProgress(campaign)}%</span>
                  </div>
                  <Progress
                    value={calculateProgress(campaign)}
                    className="h-2"
                  />
                </div>
              )}
            </CardHeader>

            <CardContent className="pt-3">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                    <Users className="h-4 w-4" />
                    <span className="text-sm font-medium">Views</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {campaign.metrics.views}
                  </div>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                    <Target className="h-4 w-4" />
                    <span className="text-sm font-medium">Clicks</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {campaign.metrics.clicks}
                  </div>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-purple-600 mb-1">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm font-medium">Conversions</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {campaign.metrics.conversions}
                  </div>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-orange-600 mb-1">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-sm font-medium">Revenue</span>
                  </div>
                  <div className="text-2xl font-bold">
                    ${campaign.metrics.revenue}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">
                  {campaign.type.charAt(0).toUpperCase() +
                    campaign.type.slice(1)}
                </Badge>
                {campaign.discountType && (
                  <Badge variant="outline">
                    {campaign.discountType === "percentage"
                      ? `${campaign.discountValue}% off`
                      : `$${campaign.discountValue} off`}
                  </Badge>
                )}
                {campaign.referralReward && (
                  <Badge variant="outline">
                    ${campaign.referralReward} referral reward
                  </Badge>
                )}
                <Badge variant="outline">
                  ROI: {campaign.metrics.roi.toFixed(1)}%
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}

        {campaigns.length === 0 && (
          <Card className="border-2 border-dashed border-muted-foreground/25">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">
                <Target className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No campaigns yet</h3>
              <p className="text-muted-foreground text-center mb-6 max-w-md">
                Create your first marketing campaign to start growing your
                business
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Campaign
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
