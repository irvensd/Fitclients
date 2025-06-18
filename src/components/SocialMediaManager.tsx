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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Share2,
  Calendar,
  Image,
  Video,
  Heart,
  MessageCircle,
  BarChart3,
  Plus,
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useMarketing } from "@/contexts/MarketingContext";
import { useData } from "@/contexts/DataContext";
import { SocialPost } from "@/lib/marketingTypes";

interface CreatePostForm {
  content: string;
  platforms: ("facebook" | "instagram" | "twitter" | "linkedin")[];
  scheduledFor?: string;
  mediaUrls: string[];
  campaignId?: string;
}

const PLATFORM_ICONS = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  linkedin: Linkedin,
};

const PLATFORM_COLORS = {
  facebook: "text-blue-600",
  instagram: "text-purple-600",
  twitter: "text-sky-500",
  linkedin: "text-blue-700",
};

export const SocialMediaManager: React.FC = () => {
  const {
    socialPosts,
    campaigns,
    createSocialPost,
    publishSocialPost,
    scheduleSocialPost,
  } = useMarketing();
  const { clients } = useData();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState<CreatePostForm>({
    content: "",
    platforms: [],
    mediaUrls: [],
  });

  const resetForm = () => {
    setFormData({
      content: "",
      platforms: [],
      mediaUrls: [],
    });
  };

  const handleCreatePost = async () => {
    try {
      await createSocialPost({
        ...formData,
        status: formData.scheduledFor ? "scheduled" : "draft",
      });
      setIsCreateDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  const handlePublishPost = async (postId: string) => {
    await publishSocialPost(postId);
  };

  const handleSchedulePost = async (postId: string, scheduledFor: string) => {
    await scheduleSocialPost(postId, scheduledFor);
  };

  const togglePlatform = (platform: CreatePostForm["platforms"][0]) => {
    setFormData((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter((p) => p !== platform)
        : [...prev.platforms, platform],
    }));
  };

  const generateSuccessStoryPost = (clientName?: string) => {
    const achievements = [
      "lost 25 pounds",
      "gained 10 pounds of muscle",
      "completed their first 5K",
      "achieved their strength goals",
      "transformed their lifestyle",
      "increased their confidence",
    ];

    const randomAchievement =
      achievements[Math.floor(Math.random() * achievements.length)];
    const name = clientName || "one of my amazing clients";

    return `🔥 Incredible transformation alert! 🔥

${name} just ${randomAchievement} and I couldn't be more proud! 💪

Their dedication and hard work have truly paid off. This is why I love what I do - seeing real results and life-changing transformations!

Ready to start your own journey? DM me to get started! 

#PersonalTrainer #FitnessTransformation #Results #Motivation #HealthyLifestyle #FitnesSuccess`;
  };

  const generateMotivationalPost = () => {
    const quotes = [
      "Your only limit is your mind. Push through and discover what you're truly capable of! 💪",
      "Every workout is a step closer to the person you want to become. Keep going! 🚀",
      "Consistency beats perfection every time. Show up, even when you don't feel like it! 🎯",
      "The hardest part is getting started. Once you begin, momentum will carry you forward! ⚡",
      "Your body can do it. It's your mind you need to convince! 🧠💪",
    ];

    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

    return `Monday Motivation! 🌟

${randomQuote}

Remember: Every champion was once a beginner who refused to give up. What's your why? Share it in the comments below! 👇

#MondayMotivation #FitnessMotivation #PersonalTrainer #NeverGiveUp #FitnessJourney`;
  };

  const generateTipPost = () => {
    const tips = [
      {
        tip: "Drink water before your workout",
        detail:
          "Proper hydration improves performance and reduces fatigue. Aim for 16-20oz 2-3 hours before exercising!",
      },
      {
        tip: "Focus on compound movements",
        detail:
          "Exercises like squats, deadlifts, and push-ups work multiple muscle groups and give you more bang for your buck!",
      },
      {
        tip: "Recovery is just as important as training",
        detail:
          "Your muscles grow during rest, not during workouts. Aim for 7-9 hours of sleep and take rest days seriously!",
      },
      {
        tip: "Track your progress beyond the scale",
        detail:
          "Take photos, measure your waist, track your energy levels. The scale doesn't tell the whole story!",
      },
    ];

    const randomTip = tips[Math.floor(Math.random() * tips.length)];

    return `💡 Fitness Tip Tuesday! 

${randomTip.tip} 🎯

${randomTip.detail}

What's your favorite fitness tip? Share it below and help others on their journey! 👇

#FitnessTips #PersonalTrainer #HealthyLiving #FitnessEducation #WorkoutTips`;
  };

  const getStatusIcon = (status: SocialPost["status"]) => {
    switch (status) {
      case "published":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "scheduled":
        return <Clock className="h-4 w-4 text-orange-600" />;
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Send className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Quick post templates
  const quickTemplates = [
    {
      title: "Success Story",
      description: "Share a client transformation",
      action: () =>
        setFormData({
          ...formData,
          content: generateSuccessStoryPost(),
        }),
    },
    {
      title: "Motivation Monday",
      description: "Inspirational post for Monday",
      action: () =>
        setFormData({
          ...formData,
          content: generateMotivationalPost(),
        }),
    },
    {
      title: "Fitness Tip",
      description: "Educational content",
      action: () =>
        setFormData({
          ...formData,
          content: generateTipPost(),
        }),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Social Media Manager</h3>
          <p className="text-sm text-muted-foreground">
            Create and schedule social media content
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Post
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create Social Media Post</DialogTitle>
              <DialogDescription>
                Create engaging content for your social media channels
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {/* Quick Templates */}
              <div className="space-y-2">
                <Label>Quick Templates</Label>
                <div className="grid grid-cols-3 gap-2">
                  {quickTemplates.map((template, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={template.action}
                    >
                      {template.title}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="content">Post Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  placeholder="What's happening? Share your thoughts..."
                  rows={6}
                />
                <div className="text-sm text-muted-foreground">
                  {formData.content.length}/280 characters
                </div>
              </div>

              {/* Platforms */}
              <div className="space-y-2">
                <Label>Platforms</Label>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(PLATFORM_ICONS).map(([platform, Icon]) => (
                    <div key={platform} className="flex items-center space-x-2">
                      <Checkbox
                        id={platform}
                        checked={formData.platforms.includes(platform as any)}
                        onCheckedChange={() => togglePlatform(platform as any)}
                      />
                      <Label
                        htmlFor={platform}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Icon
                          className={`h-4 w-4 ${PLATFORM_COLORS[platform as keyof typeof PLATFORM_COLORS]}`}
                        />
                        <span className="capitalize">{platform}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Campaign Association */}
              <div className="space-y-2">
                <Label htmlFor="campaign">
                  Associate with Campaign (Optional)
                </Label>
                <Select
                  value={formData.campaignId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, campaignId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a campaign" />
                  </SelectTrigger>
                  <SelectContent>
                    {campaigns.map((campaign) => (
                      <SelectItem key={campaign.id} value={campaign.id}>
                        {campaign.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Schedule */}
              <div className="space-y-2">
                <Label htmlFor="scheduledFor">Schedule Post (Optional)</Label>
                <Input
                  id="scheduledFor"
                  type="datetime-local"
                  value={formData.scheduledFor}
                  onChange={(e) =>
                    setFormData({ ...formData, scheduledFor: e.target.value })
                  }
                  min={new Date().toISOString().slice(0, 16)}
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
              <Button onClick={handleCreatePost}>
                {formData.scheduledFor ? "Schedule Post" : "Save as Draft"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Social Media Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Share2 className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Total Posts</span>
            </div>
            <div className="text-2xl font-bold">{socialPosts.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium">Total Likes</span>
            </div>
            <div className="text-2xl font-bold">
              {socialPosts.reduce((sum, post) => sum + post.metrics.likes, 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Total Comments</span>
            </div>
            <div className="text-2xl font-bold">
              {socialPosts.reduce(
                (sum, post) => sum + post.metrics.comments,
                0,
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">Avg. Engagement</span>
            </div>
            <div className="text-2xl font-bold">
              {socialPosts.length > 0
                ? Math.round(
                    socialPosts.reduce(
                      (sum, post) => sum + post.metrics.engagement,
                      0,
                    ) / socialPosts.length,
                  )
                : 0}
              %
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Posts List */}
      <div className="grid gap-4">
        {socialPosts.map((post) => (
          <Card key={post.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(post.status)}
                    <Badge
                      variant={
                        post.status === "published"
                          ? "default"
                          : post.status === "scheduled"
                            ? "secondary"
                            : post.status === "failed"
                              ? "destructive"
                              : "outline"
                      }
                    >
                      {post.status.charAt(0).toUpperCase() +
                        post.status.slice(1)}
                    </Badge>
                    {post.scheduledFor && (
                      <span className="text-sm text-muted-foreground">
                        {formatDate(post.scheduledFor)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {post.platforms.map((platform) => {
                      const Icon = PLATFORM_ICONS[platform];
                      return (
                        <Icon
                          key={platform}
                          className={`h-4 w-4 ${PLATFORM_COLORS[platform]}`}
                        />
                      );
                    })}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {post.status === "draft" && (
                    <Button
                      size="sm"
                      onClick={() => handlePublishPost(post.id)}
                    >
                      <Send className="h-3 w-3 mr-1" />
                      Publish Now
                    </Button>
                  )}
                  {post.status === "scheduled" && (
                    <Button size="sm" variant="outline">
                      <Calendar className="h-3 w-3 mr-1" />
                      Scheduled
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm whitespace-pre-wrap">{post.content}</p>
                </div>

                {post.status === "published" && (
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="flex items-center justify-center gap-1 text-red-600 mb-1">
                        <Heart className="h-3 w-3" />
                        <span className="text-xs font-medium">Likes</span>
                      </div>
                      <div className="text-lg font-bold">
                        {post.metrics.likes}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                        <MessageCircle className="h-3 w-3" />
                        <span className="text-xs font-medium">Comments</span>
                      </div>
                      <div className="text-lg font-bold">
                        {post.metrics.comments}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                        <Share2 className="h-3 w-3" />
                        <span className="text-xs font-medium">Shares</span>
                      </div>
                      <div className="text-lg font-bold">
                        {post.metrics.shares}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-center gap-1 text-purple-600 mb-1">
                        <BarChart3 className="h-3 w-3" />
                        <span className="text-xs font-medium">Reach</span>
                      </div>
                      <div className="text-lg font-bold">
                        {post.metrics.reach}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {socialPosts.length === 0 && (
          <Card className="border-2 border-dashed border-muted-foreground/25">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">
                <Share2 className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
              <p className="text-muted-foreground text-center mb-6 max-w-md">
                Start creating engaging social media content to grow your online
                presence
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Post
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
