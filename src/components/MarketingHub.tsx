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
import { Progress } from "@/components/ui/progress";
import {
  Share2,
  Mail,
  Users,
  TrendingUp,
  Star,
  Calendar,
  Gift,
  Target,
  Megaphone,
  Link,
  Download,
  Copy,
  QrCode,
  Plus,
} from "lucide-react";

interface MarketingMetrics {
  activeReferrals: number;
  conversionRate: number;
  socialShares: number;
  leadGenerated: number;
  emailSubscribers: number;
  referralRewards: number;
}

const mockMetrics: MarketingMetrics = {
  activeReferrals: 12,
  conversionRate: 23.5,
  socialShares: 47,
  leadGenerated: 18,
  emailSubscribers: 156,
  referralRewards: 450,
};

export const MarketingHub = () => {
  const {
    activeReferrals,
    conversionRate,
    socialShares,
    leadGenerated,
    emailSubscribers,
    referralRewards,
  } = mockMetrics;

  const referralCampaigns = [
    {
      id: "1",
      title: "New Year Transformation",
      description: "Get 20% off first month + free assessment",
      status: "active",
      conversions: 8,
      shares: 23,
    },
    {
      id: "2",
      title: "Friend Referral Program",
      description: "Both you and your friend get $50 credit",
      status: "active",
      conversions: 12,
      shares: 31,
    },
    {
      id: "3",
      title: "Summer Beach Body",
      description: "6-week transformation package",
      status: "paused",
      conversions: 5,
      shares: 18,
    },
  ];

  const handleCopyReferralLink = (campaignId: string) => {
    const link = `https://fitclient.app/ref/${campaignId}`;
    navigator.clipboard.writeText(link);
    // Show toast notification
  };

  const handleCreateSocialPost = (campaign: any) => {
    const postText = `🔥 ${campaign.title}\n\n${campaign.description}\n\nReady to transform your fitness journey? Let's make it happen! 💪\n\n#PersonalTrainer #FitnessTransformation #HealthyLifestyle`;

    // This would integrate with social media APIs
    console.log("Creating social post:", postText);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Marketing Hub</h2>
          <p className="text-muted-foreground">
            Grow your business with automated marketing tools
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      {/* Marketing Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Active Referrals</span>
            </div>
            <div className="text-2xl font-bold">{activeReferrals}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Conversion</span>
            </div>
            <div className="text-2xl font-bold">{conversionRate}%</div>
            <p className="text-xs text-muted-foreground">Lead to client</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Share2 className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">Social Shares</span>
            </div>
            <div className="text-2xl font-bold">{socialShares}</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium">Leads</span>
            </div>
            <div className="text-2xl font-bold">{leadGenerated}</div>
            <p className="text-xs text-muted-foreground">New this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Mail className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium">Subscribers</span>
            </div>
            <div className="text-2xl font-bold">{emailSubscribers}</div>
            <p className="text-xs text-muted-foreground">Email list</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Gift className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium">Rewards</span>
            </div>
            <div className="text-2xl font-bold">${referralRewards}</div>
            <p className="text-xs text-muted-foreground">Given out</p>
          </CardContent>
        </Card>
      </div>

      {/* Marketing Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Referral Campaigns */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-yellow-600" />
              Referral Campaigns
            </CardTitle>
            <CardDescription>
              Automated referral programs to grow your client base
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {referralCampaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="p-4 border rounded-lg space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{campaign.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {campaign.description}
                    </p>
                  </div>
                  <Badge
                    variant={
                      campaign.status === "active" ? "default" : "secondary"
                    }
                  >
                    {campaign.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Conversions:</span>
                    <span className="ml-2 font-medium">
                      {campaign.conversions}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Shares:</span>
                    <span className="ml-2 font-medium">{campaign.shares}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleCopyReferralLink(campaign.id)}
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy Link
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCreateSocialPost(campaign)}
                  >
                    <Share2 className="h-3 w-3 mr-1" />
                    Share
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Social Media Tools */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-blue-600" />
              Social Media Tools
            </CardTitle>
            <CardDescription>
              Promote your services and client success stories
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
              <h4 className="font-medium mb-2">Weekly Success Post</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Showcase your latest client transformations automatically
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-white p-2 rounded border">
                  <p className="text-sm">
                    "Amazing week with my clients! Sarah hit her 25lb weight
                    loss goal 🎉"
                  </p>
                </div>
                <Button size="sm">Post</Button>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border">
              <h4 className="font-medium mb-2">Client Testimonial</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Share client reviews to build credibility
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-3 w-3 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-sm">
                    "Life-changing experience! Highly recommend!"
                  </p>
                </div>
                <Button size="sm" variant="outline">
                  Share
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Quick Actions</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm">
                  <QrCode className="h-3 w-3 mr-1" />
                  QR Code
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-3 w-3 mr-1" />
                  Flyers
                </Button>
                <Button variant="outline" size="sm">
                  <Calendar className="h-3 w-3 mr-1" />
                  Booking Widget
                </Button>
                <Button variant="outline" size="sm">
                  <Link className="h-3 w-3 mr-1" />
                  Website Badge
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lead Generation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-600" />
            Lead Generation Dashboard
          </CardTitle>
          <CardDescription>Track and convert potential clients</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">This Week's Leads</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Website inquiries</span>
                  <span className="font-medium">8</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Social media DMs</span>
                  <span className="font-medium">5</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Referrals</span>
                  <span className="font-medium">3</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Walk-ins</span>
                  <span className="font-medium">2</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Conversion Funnel</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Leads</span>
                    <span>18</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Consultations</span>
                    <span>12</span>
                  </div>
                  <Progress value={67} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Clients</span>
                    <span>4</span>
                  </div>
                  <Progress value={22} className="h-2" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Follow-up Actions</h4>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Mail className="h-3 w-3 mr-2" />
                  Send welcome email (3 pending)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Calendar className="h-3 w-3 mr-2" />
                  Schedule consultations (5 pending)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Users className="h-3 w-3 mr-2" />
                  Follow up on proposals (2 pending)
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
