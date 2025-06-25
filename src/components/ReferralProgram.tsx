import { useState, useEffect } from "react";
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
import {
  Share2,
  Copy,
  Users,
  DollarSign,
  CheckCircle,
  Clock,
  Gift,
  TrendingUp,
  Link as LinkIcon,
  ExternalLink,
  Calendar,
  UserPlus,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { referralService } from "@/lib/firebaseService";
import { ReferralStats, ReferralData } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export const ReferralProgram = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [referrals, setReferrals] = useState<ReferralData[]>([]);
  const [loading, setLoading] = useState(true);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;

    const loadReferralData = async () => {
      try {
        setLoading(true);
        
        // Load referral stats
        const referralStats = await referralService.getReferralStats(user.uid);
        setStats(referralStats);

        // Subscribe to referrals
        const unsubscribe = referralService.subscribeToReferrals(
          user.uid,
          (referralsData) => {
            setReferrals(referralsData);
            setLoading(false);
          },
          (error) => {
            console.error("Error loading referrals:", error);
            setLoading(false);
          }
        );

        return unsubscribe;
      } catch (error) {
        console.error("Error loading referral data:", error);
        setLoading(false);
      }
    };

    loadReferralData();
  }, [user?.uid]);

  const copyReferralLink = async () => {
    if (!stats?.referralLink) return;

    try {
      await navigator.clipboard.writeText(stats.referralLink);
      setCopied(true);
      toast({
        title: "Referral link copied!",
        description: "Share this link with other trainers to earn rewards.",
      });
      
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
      toast({
        title: "Failed to copy link",
        description: "Please copy the link manually.",
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
          text: "I'm using FitClient to manage my personal training business. Use my referral link to get a free month when you subscribe!",
          url: stats.referralLink,
        });
      } catch (error) {
        console.error("Error sharing:", error);
        copyReferralLink();
      }
    } else {
      copyReferralLink();
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case "completed":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>;
      case "rewarded":
        return <Badge variant="secondary" className="bg-green-100 text-green-800"><Gift className="h-3 w-3 mr-1" />Rewarded</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Referral Program</h2>
          <p className="text-muted-foreground">
            Invite other trainers and earn rewards together
          </p>
        </div>
        <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Share Referral Link
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Share Your Referral Link</DialogTitle>
              <DialogDescription>
                Share this link with other personal trainers. When they sign up and subscribe, you both get a free month!
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Your Referral Link</Label>
                <div className="flex gap-2">
                  <Input
                    value={stats?.referralLink || ""}
                    readOnly
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    onClick={copyReferralLink}
                    className={copied ? "bg-green-100 text-green-800" : ""}
                  >
                    {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
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
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Referrals</p>
                <p className="text-2xl font-bold">{stats?.totalReferrals || 0}</p>
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
                <p className="text-2xl font-bold">{stats?.completedReferrals || 0}</p>
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
                <p className="text-2xl font-bold">{stats?.pendingReferrals || 0}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Earnings</p>
                <p className="text-2xl font-bold">${stats?.totalEarnings || 0}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Referral Link Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5" />
            Your Referral Link
          </CardTitle>
          <CardDescription>
            Share this link with other trainers. When they subscribe, you both get a free month!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              value={stats?.referralLink || ""}
              readOnly
              className="flex-1"
            />
            <Button onClick={copyReferralLink} variant="outline">
              <Copy className="h-4 w-4" />
            </Button>
            <Button onClick={shareReferralLink}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Referral Code: <span className="font-mono font-medium">{stats?.referralCode}</span>
          </p>
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
          <CardDescription>
            Simple "Give a month, get a month" referral program
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Share2 className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">1. Share Your Link</h3>
              <p className="text-sm text-muted-foreground">
                Share your unique referral link with other personal trainers
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <UserPlus className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">2. They Sign Up</h3>
              <p className="text-sm text-muted-foreground">
                They use your link to create an account and subscribe to a plan
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Gift className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">3. Both Get Rewards</h3>
              <p className="text-sm text-muted-foreground">
                You both get a free month added to your subscription
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referral History */}
      <Card>
        <CardHeader>
          <CardTitle>Referral History</CardTitle>
          <CardDescription>
            Track your referrals and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {referrals.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No referrals yet</h3>
              <p className="text-gray-500 mb-4">
                Share your referral link to start earning rewards
              </p>
              <Button onClick={() => setShareDialogOpen(true)}>
                <Share2 className="h-4 w-4 mr-2" />
                Share Referral Link
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Referred Trainer</TableHead>
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
                        <p className="font-medium">{referral.referredUserEmail}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(referral.createdAt)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(referral.createdAt)}</TableCell>
                    <TableCell>{getStatusBadge(referral.status)}</TableCell>
                    <TableCell>
                      {referral.planSubscribed ? (
                        <Badge variant="outline" className="capitalize">
                          {referral.planSubscribed}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {referral.rewardAmount ? (
                        <span className="font-medium text-green-600">
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}; 