import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Star,
  Trophy,
  TrendingUp,
  Calendar,
  Share2,
  Camera,
  Plus,
  Download,
  MessageSquare,
} from "lucide-react";

interface SuccessStory {
  id: string;
  clientName: string;
  clientAvatar?: string;
  achievement: string;
  description: string;
  beforePhoto?: string;
  afterPhoto?: string;
  stats: {
    weightLoss?: number;
    muscleGain?: number;
    timeframe: string;
    sessionsCompleted: number;
  };
  testimonial: string;
  rating: number;
  dateAchieved: string;
  isPublic: boolean;
}

const mockSuccessStories: SuccessStory[] = [
  {
    id: "1",
    clientName: "Sarah Johnson",
    clientAvatar: "/api/placeholder/150/150",
    achievement: "Lost 25 lbs & Built Confidence",
    description:
      "Transformed from couch to 5K runner while building sustainable healthy habits",
    beforePhoto: "/api/placeholder/200/300",
    afterPhoto: "/api/placeholder/200/300",
    stats: {
      weightLoss: 25,
      timeframe: "4 months",
      sessionsCompleted: 48,
    },
    testimonial:
      "Working with Alex has been life-changing! Not only did I lose weight, but I gained so much confidence and energy. The personalized workouts and constant support made all the difference.",
    rating: 5,
    dateAchieved: "2024-01-15",
    isPublic: true,
  },
  {
    id: "2",
    clientName: "Mike Chen",
    clientAvatar: "/api/placeholder/150/150",
    achievement: "Gained 15 lbs Muscle",
    description:
      "Built impressive strength and muscle mass while maintaining lean physique",
    beforePhoto: "/api/placeholder/200/300",
    afterPhoto: "/api/placeholder/200/300",
    stats: {
      muscleGain: 15,
      timeframe: "6 months",
      sessionsCompleted: 72,
    },
    testimonial:
      "The structured approach and progressive overload system helped me achieve gains I never thought possible. Alex's expertise in nutrition and training is unmatched.",
    rating: 5,
    dateAchieved: "2024-01-08",
    isPublic: true,
  },
  {
    id: "3",
    clientName: "Emma Rodriguez",
    clientAvatar: "/api/placeholder/150/150",
    achievement: "Marathon Finisher",
    description:
      "From beginner runner to completing first marathon in under 4 hours",
    beforePhoto: "/api/placeholder/200/300",
    afterPhoto: "/api/placeholder/200/300",
    stats: {
      timeframe: "8 months",
      sessionsCompleted: 96,
    },
    testimonial:
      "Alex's training plan was perfectly structured to build my endurance gradually. Crossing that marathon finish line was the proudest moment of my life!",
    rating: 5,
    dateAchieved: "2023-12-20",
    isPublic: true,
  },
];

export const ClientSuccessStories = () => {
  const [selectedStory, setSelectedStory] = useState<SuccessStory | null>(null);

  const handleShare = (story: SuccessStory) => {
    const shareText = `🏆 Client Success Story: ${story.clientName} - ${story.achievement}! ${story.description}`;

    if (navigator.share) {
      navigator.share({
        title: "Client Success Story",
        text: shareText,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      // Show toast notification
    }
  };

  const generateReport = (story: SuccessStory) => {
    // This would generate a PDF report or social media post
    // Generating success story report
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Client Success Stories</h2>
          <p className="text-muted-foreground">
            Showcase your clients' achievements and build social proof
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Success Story
        </Button>
      </div>

      {/* Success Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockSuccessStories.map((story) => (
          <Card
            key={story.id}
            className="overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative">
              {story.afterPhoto && (
                <div className="aspect-[4/3] bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center">
                  <Camera className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
              <Badge className="absolute top-2 right-2 bg-yellow-100 text-yellow-800">
                <Trophy className="h-3 w-3 mr-1" />
                Success
              </Badge>
            </div>

            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={story.clientAvatar} />
                  <AvatarFallback>
                    {story.clientName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-sm">{story.clientName}</h3>
                  <div className="flex items-center gap-1">
                    {[...Array(story.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-3 w-3 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                </div>
              </div>

              <h4 className="font-semibold mb-2">{story.achievement}</h4>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {story.description}
              </p>

              <div className="space-y-2 mb-4">
                {story.stats.weightLoss && (
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span>Lost {story.stats.weightLoss} lbs</span>
                  </div>
                )}
                {story.stats.muscleGain && (
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    <span>Gained {story.stats.muscleGain} lbs muscle</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {story.stats.timeframe} • {story.stats.sessionsCompleted}{" "}
                    sessions
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-1">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      View Story
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-yellow-600" />
                        {story.achievement}
                      </DialogTitle>
                      <DialogDescription>
                        Client Success Story - {story.clientName}
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6">
                      {/* Before/After Photos */}
                      {story.beforePhoto && story.afterPhoto && (
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center">
                            <div className="aspect-[3/4] bg-gray-100 rounded-lg mb-2 flex items-center justify-center">
                              <Camera className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <p className="text-sm font-medium">Before</p>
                          </div>
                          <div className="text-center">
                            <div className="aspect-[3/4] bg-gray-100 rounded-lg mb-2 flex items-center justify-center">
                              <Camera className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <p className="text-sm font-medium">After</p>
                          </div>
                        </div>
                      )}

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-primary">
                            {story.stats.weightLoss ||
                              story.stats.muscleGain ||
                              0}
                            <span className="text-sm text-muted-foreground ml-1">
                              lbs
                            </span>
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {story.stats.weightLoss ? "Lost" : "Gained"}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-primary">
                            {story.stats.sessionsCompleted}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Sessions
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-primary">
                            {story.stats.timeframe}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Duration
                          </p>
                        </div>
                      </div>

                      {/* Testimonial */}
                      <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                        <p className="text-sm italic mb-2">
                          "{story.testimonial}"
                        </p>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={story.clientAvatar} />
                            <AvatarFallback className="text-xs">
                              {story.clientName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">
                            - {story.clientName}
                          </span>
                          <div className="flex items-center gap-1 ml-auto">
                            {[...Array(story.rating)].map((_, i) => (
                              <Star
                                key={i}
                                className="h-3 w-3 fill-yellow-400 text-yellow-400"
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleShare(story)}
                          className="flex-1"
                        >
                          <Share2 className="h-4 w-4 mr-2" />
                          Share Story
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => generateReport(story)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare(story)}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-600" />
            Success Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {mockSuccessStories.length}
              </p>
              <p className="text-sm text-muted-foreground">Success Stories</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">4.9</p>
              <p className="text-sm text-muted-foreground">Avg Rating</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">93%</p>
              <p className="text-sm text-muted-foreground">Goal Achievement</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">127</p>
              <p className="text-sm text-muted-foreground">
                Total Transformations
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
