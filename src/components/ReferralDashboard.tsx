import React, { useState, useEffect } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Share2,
  Copy,
  ExternalLink,
  Users,
  DollarSign,
  TrendingUp,
  CheckCircle,
  Clock,
  Gift,
  Crown,
  Star,
  Zap,
  Target,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { referralService } from "@/lib/firebaseService";
import { subscriptionExtensionService } from "@/lib/subscriptionExtension";
import { ReferralStats, ReferralData } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface ReferralDashboardProps {
  className?: string;
}

export const ReferralDashboard: React.FC<ReferralDashboardProps> = ({
  className,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [referrals, setReferrals] = useState<ReferralData[]>([]);
  const [loading, setLoading] = useState(true);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [freeMonthsRemaining, setFreeMonthsRemaining] = useState(0);

  useEffect(() => {
    if (user) {
      loadReferralData();
    }
  }, [user]);

  const loadReferralData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Load referral stats
      const referralStats = await referralService.getReferralStats(user.uid);
      setStats(referralStats);
      
      // Load referral list
      const referralsSnapshot = await referralService.getUserReferrals(user.uid);
      const referralsData = referralsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ReferralData[];
      setReferrals(referralsData);
      
      // Load free months remaining
      const extensions = await subscriptionExtensionService.getUserExtensions(user.uid);
      setFreeMonthsRemaining(extensions?.freeMonthsRemaining || 0);
    } catch (error) {
      console.error("Error loading referral data:", error);
      toast({
        title: "Error",
        description: "Failed to load referral data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = async () => {
    if (!stats?.referralLink) return;
    
    try {
      await navigator.clipboard.writeText(stats.referralLink);
      setCopied(true);
      toast({
        title: "Link Copied!",
        description: "Your referral link has been copied to clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link. Please try again.",
        variant: "destructive",
      });
    }
  };

  const shareReferralLink = async () => {
    if (!stats?.referralLink) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join FitClient - Get a Free Month!",
          text: "I'm using FitClient to manage my fitness business. Use my referral link to get a free month when you subscribe!",
          url: stats.referralLink,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      copyReferralLink();
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
      case "rewarded":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getPlanIcon = (plan?: string) => {
    switch (plan) {
      case "lifetime":
        return <Crown className="h-4 w-4 text-yellow-600" />;
      case "pro":
        return <Star className="h-4 w-4 text-blue-600" />;
      case "starter":
        return <Target className="h-4 w-4 text-green-600" />;
      default:
        return <Zap className="h-4 w-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Referral Program</h2>
          <p className="text-muted-foreground">
            Invite trainers and both get a free month when they subscribe
          </p>
        </div>
        <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
              <Share2 className="h-4 w-4 mr-2" />
              Share Referral Link
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Share Your Referral Link</DialogTitle>
              <DialogDescription>
                Share this link with other trainers. When they sign up and subscribe, you both get a free month!
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Your Referral Link</Label>
                <div className="flex gap-2">
                  <Input
                    value={stats?.referralLink || ""}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={copyReferralLink}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={shareReferralLink} className="flex-1">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.open(stats?.referralLink, "_blank")}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Referrals</p>
                  <p className="text-2xl font-bold">{stats.totalReferrals}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{stats.completedReferrals}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pendingReferrals}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Free Months Remaining</p>
                  <p className="text-2xl font-bold text-green-600">{freeMonthsRemaining}</p>
                </div>
                <Gift className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Referral Code */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5" />
              Your Referral Code
            </CardTitle>
            <CardDescription>
              Share this code with other trainers to earn rewards
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Label>Referral Code</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    value={stats.referralCode}
                    readOnly
                    className="font-mono text-lg font-bold"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      navigator.clipboard.writeText(stats.referralCode);
                      toast({
                        title: "Code Copied!",
                        description: "Your referral code has been copied to clipboard.",
                      });
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{freeMonthsRemaining}</div>
                <div className="text-sm text-muted-foreground">Free Months</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle>How the Referral Program Works</CardTitle>
          <CardDescription>
            "Give a Month, Get a Month" - Both trainers benefit!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Share2 className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold mb-2">1. Share Your Link</h4>
              <p className="text-sm text-muted-foreground">
                Share your unique referral link with other trainers
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold mb-2">2. They Subscribe</h4>
              <p className="text-sm text-muted-foreground">
                When they sign up and subscribe to a paid plan
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="h-6 w-6 text-purple-600" />
              </div>
                                <h4 className="font-semibold mb-2">3. Both Get Free Months</h4>
                  <p className="text-sm text-muted-foreground">
                    You both automatically get a free month added to your subscription
                  </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reward Structure */}
      <Card>
        <CardHeader>
          <CardTitle>Free Month Rewards</CardTitle>
          <CardDescription>
            Both users get 1 free month regardless of the plan subscribed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg text-center">
              <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-semibold">Starter Plan</h4>
              <p className="text-2xl font-bold text-green-600">1 Month</p>
              <p className="text-sm text-muted-foreground">Free month credit</p>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <Star className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-semibold">Pro Plan</h4>
              <p className="text-2xl font-bold text-blue-600">1 Month</p>
              <p className="text-sm text-muted-foreground">Free month credit</p>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <Crown className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <h4 className="font-semibold">Pro Lifetime</h4>
              <p className="text-2xl font-bold text-yellow-600">1 Month</p>
              <p className="text-sm text-muted-foreground">Free month credit</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referrals List */}
      {referrals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Referrals</CardTitle>
            <CardDescription>
              Track the status of your referrals and earnings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Referred User</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Reward</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {referrals.map((referral) => (
                  <TableRow key={referral.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{referral.referredUserEmail}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(referral.createdAt)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(referral.createdAt)}</TableCell>
                    <TableCell>{getStatusBadge(referral.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getPlanIcon(referral.planSubscribed)}
                        <span className="capitalize">
                          {referral.planSubscribed || "Pending"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {referral.rewardType === "free_month" ? (
                        <Badge className="bg-green-100 text-green-800">
                          <Gift className="h-3 w-3 mr-1" />
                          Free Month
                        </Badge>
                      ) : referral.rewardAmount ? (
                        <span className="font-semibold text-green-600">
                          ${referral.rewardAmount}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {referrals.length === 0 && !loading && (
        <Card>
          <CardContent className="text-center py-12">
            <Share2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Referrals Yet</h3>
            <p className="text-muted-foreground mb-4">
              Start sharing your referral link to earn rewards when other trainers subscribe!
            </p>
            <Button onClick={() => setShareDialogOpen(true)}>
              <Share2 className="h-4 w-4 mr-2" />
              Share Your Link
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 