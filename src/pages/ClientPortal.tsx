import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  Clock,
  Dumbbell,
  TrendingUp,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Download,
  Scale,
  Target,
  Activity,
  Zap,
  XCircle,
  Trophy,
  Star,
} from "lucide-react";
import { GamificationDashboard } from "@/components/GamificationDashboard";

// Mock client data - in real app this would come from API based on clientId
const getClientData = (clientId: string) => {
  const clientData = {
    "sarah-johnson": {
      client: {
        id: "1",
        name: "Sarah Johnson",
        email: "sarah.johnson@email.com",
        phone: "(555) 123-4567",
        dateJoined: "2024-01-15",
        fitnessLevel: "intermediate",
        goals: "Weight loss and strength building",
        trainerName: "Alex Johnson",
        avatar: "",
      },
      upcomingSessions: [
        {
          id: "1",
          date: "2024-03-18",
          startTime: "09:00",
          endTime: "10:00",
          type: "Personal Training",
          location: "FitGym Downtown",
          notes: "Focus on upper body strength",
          status: "scheduled",
          cost: 75,
        },
        {
          id: "2",
          date: "2024-03-20",
          startTime: "09:00",
          endTime: "10:00",
          type: "Personal Training",
          location: "FitGym Downtown",
          notes: "Cardio and core work",
          status: "scheduled",
          cost: 75,
        },
        {
          id: "3",
          date: "2024-03-22",
          startTime: "10:00",
          endTime: "11:00",
          type: "Personal Training",
          location: "FitGym Downtown",
          notes: "Lower body focus",
          status: "cancelled",
          cost: 75,
          cancellationReason: "Client cancelled due to schedule conflict",
          cancelledAt: "2024-03-17T10:30:00Z",
          cancelledBy: "client",
        },
      ],
      workoutPlan: {
        id: "1",
        name: "Sarah's Weight Loss Program",
        description: "12-week program focused on fat loss and toning",
        exercises: [
          {
            id: "1",
            name: "Push-ups",
            sets: 3,
            reps: "12-15",
            notes: "Modify on knees if needed",
          },
          {
            id: "2",
            name: "Squats",
            sets: 3,
            reps: "15-20",
            notes: "Focus on proper form",
          },
          {
            id: "3",
            name: "Plank",
            sets: 3,
            reps: "30-60 seconds",
            notes: "Hold steady, don't let hips drop",
          },
          {
            id: "4",
            name: "Mountain Climbers",
            sets: 3,
            reps: "20 each leg",
            notes: "Keep core tight",
          },
        ],
        createdDate: "2024-03-01",
      },
      progress: [
        {
          id: "1",
          date: "2024-03-15",
          weight: 165,
          bodyFat: 18.5,
          measurements: {
            chest: 38,
            waist: 32,
            hips: 36,
            arms: 13,
            thighs: 22,
          },
          notes: "Great progress! Down 3 lbs this month.",
        },
        {
          id: "2",
          date: "2024-03-01",
          weight: 168,
          bodyFat: 19.2,
          measurements: {
            chest: 38.5,
            waist: 33,
            hips: 36.5,
            arms: 12.5,
            thighs: 22.5,
          },
          notes: "Starting to see muscle definition improvements.",
        },
      ],
      payments: [
        {
          id: "1",
          date: "2024-03-15",
          amount: 300,
          description: "4-Session Package",
          status: "paid",
          dueDate: "2024-03-15",
        },
        {
          id: "2",
          date: "2024-04-01",
          amount: 300,
          description: "4-Session Package",
          status: "pending",
          dueDate: "2024-04-01",
        },
      ],
    },
    "mike-chen": {
      client: {
        id: "2",
        name: "Mike Chen",
        email: "mike.chen@email.com",
        phone: "(555) 234-5678",
        dateJoined: "2024-02-03",
        fitnessLevel: "beginner",
        goals: "Build muscle mass and improve endurance",
        trainerName: "Alex Johnson",
        avatar: "",
      },
      upcomingSessions: [
        {
          id: "1",
          date: "2024-03-19",
          startTime: "14:00",
          endTime: "15:00",
          type: "Personal Training",
          location: "FitGym Downtown",
          notes: "Focus on compound movements",
          status: "scheduled",
          cost: 75,
        },
      ],
      workoutPlan: {
        id: "2",
        name: "Mike's Muscle Building Program",
        description: "8-week beginner muscle building program",
        exercises: [
          {
            id: "1",
            name: "Bench Press",
            sets: 3,
            reps: "8-10",
            notes: "Start light, focus on form",
          },
          {
            id: "2",
            name: "Deadlifts",
            sets: 3,
            reps: "5-8",
            notes: "Keep back straight",
          },
          {
            id: "3",
            name: "Squats",
            sets: 3,
            reps: "10-12",
            notes: "Full range of motion",
          },
        ],
        createdDate: "2024-02-03",
      },
      progress: [
        {
          id: "1",
          date: "2024-03-15",
          weight: 180,
          bodyFat: 15.2,
          measurements: {
            chest: 42,
            waist: 34,
            hips: 38,
            arms: 15,
            thighs: 24,
          },
          notes: "Good progress on strength gains!",
        },
      ],
      payments: [
        {
          id: "1",
          date: "2024-03-15",
          amount: 300,
          description: "4-Session Package",
          status: "paid",
          dueDate: "2024-03-15",
        },
      ],
    },
    "emily-davis": {
      client: {
        id: "3",
        name: "Emily Davis",
        email: "emily.davis@email.com",
        phone: "(555) 345-6789",
        dateJoined: "2024-01-28",
        fitnessLevel: "advanced",
        goals: "Marathon training and performance optimization",
        trainerName: "Alex Johnson",
        avatar: "",
      },
      upcomingSessions: [
        {
          id: "1",
          date: "2024-03-21",
          startTime: "07:00",
          endTime: "08:00",
          type: "Personal Training",
          location: "Track Field",
          notes: "Speed work and intervals",
          status: "scheduled",
          cost: 75,
        },
      ],
      workoutPlan: {
        id: "3",
        name: "Emily's Marathon Training",
        description: "16-week marathon training program",
        exercises: [
          {
            id: "1",
            name: "Long Run",
            sets: 1,
            reps: "60-90 min",
            notes: "Conversational pace",
          },
          {
            id: "2",
            name: "Tempo Run",
            sets: 1,
            reps: "30 min",
            notes: "Comfortably hard effort",
          },
          {
            id: "3",
            name: "Core Strengthening",
            sets: 3,
            reps: "15 each",
            notes: "Focus on stability",
          },
        ],
        createdDate: "2024-01-28",
      },
      progress: [
        {
          id: "1",
          date: "2024-03-15",
          weight: 125,
          bodyFat: 12.8,
          measurements: {
            chest: 34,
            waist: 26,
            hips: 36,
            arms: 11,
            thighs: 20,
          },
          notes: "Excellent endurance improvements!",
        },
      ],
      payments: [
        {
          id: "1",
          date: "2024-03-15",
          amount: 400,
          description: "8-Session Package",
          status: "paid",
          dueDate: "2024-03-15",
        },
      ],
    },
    "james-wilson": {
      client: {
        id: "4",
        name: "James Wilson",
        email: "james.wilson@email.com",
        phone: "(555) 456-7890",
        dateJoined: "2024-02-10",
        fitnessLevel: "intermediate",
        goals: "Functional fitness and injury prevention",
        trainerName: "Alex Johnson",
        avatar: "",
      },
      upcomingSessions: [
        {
          id: "1",
          date: "2024-03-20",
          startTime: "15:30",
          endTime: "16:30",
          type: "Consultation",
          location: "FitGym Downtown",
          notes: "Discuss injury prevention strategies",
          status: "scheduled",
          cost: 60,
        },
      ],
      workoutPlan: {
        id: "4",
        name: "James's Functional Fitness",
        description: "12-week functional movement program",
        exercises: [
          {
            id: "1",
            name: "Turkish Get-ups",
            sets: 3,
            reps: "5 each side",
            notes: "Slow and controlled",
          },
          {
            id: "2",
            name: "Farmer's Walks",
            sets: 3,
            reps: "40 yards",
            notes: "Heavy weight, good posture",
          },
          {
            id: "3",
            name: "Single Leg RDL",
            sets: 3,
            reps: "10 each leg",
            notes: "Focus on balance",
          },
        ],
        createdDate: "2024-02-10",
      },
      progress: [
        {
          id: "1",
          date: "2024-03-15",
          weight: 195,
          bodyFat: 18.5,
          measurements: {
            chest: 44,
            waist: 36,
            hips: 40,
            arms: 16,
            thighs: 26,
          },
          notes: "Great improvement in mobility and stability!",
        },
      ],
      payments: [
        {
          id: "1",
          date: "2024-03-15",
          amount: 250,
          description: "Individual Sessions",
          status: "pending",
          dueDate: "2024-03-20",
        },
      ],
    },
  };

  return clientData[clientId as keyof typeof clientData] || null;
};

const CancelSessionDialog = ({
  session,
  onCancel,
}: {
  session: any;
  onCancel: (sessionId: string, reason: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCancel = async () => {
    if (!reason.trim()) {
      alert("Please provide a reason for cancellation");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    onCancel(session.id, reason);
    setOpen(false);
    setReason("");
    setIsSubmitting(false);
  };

  const isWithin24Hours = () => {
    const sessionDateTime = new Date(`${session.date}T${session.startTime}`);
    const now = new Date();
    const hoursUntilSession =
      (sessionDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursUntilSession <= 24;
  };

  // Don't show cancel button for sessions in the past or already cancelled
  const sessionDateTime = new Date(`${session.date}T${session.startTime}`);
  const now = new Date();
  const isPastSession = sessionDateTime < now;
  const isCancelled = session.status === "cancelled";

  if (isPastSession || isCancelled) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-red-600 border-red-200 hover:bg-red-50"
        >
          <XCircle className="h-4 w-4 mr-1" />
          Cancel Session
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-600" />
            Cancel Session
          </DialogTitle>
          <DialogDescription>
            Cancel your {session.type} session on{" "}
            {new Date(session.date).toLocaleDateString()} at {session.startTime}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {isWithin24Hours() && (
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-orange-800">
                    Late Cancellation Notice
                  </p>
                  <p className="text-orange-700 mt-1">
                    This session is within 24 hours. Cancellation policies may
                    apply. Please contact your trainer if this is an emergency.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="reason">Reason for cancellation</Label>
            <Textarea
              id="reason"
              placeholder="Please let your trainer know why you need to cancel..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[100px]"
              required
            />
          </div>

          <div className="text-sm text-muted-foreground">
            Your trainer will be notified immediately about this cancellation.
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isSubmitting}
          >
            Keep Session
          </Button>
          <Button
            variant="destructive"
            onClick={handleCancel}
            disabled={isSubmitting || !reason.trim()}
          >
            {isSubmitting ? "Cancelling..." : "Cancel Session"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ClientPortal = () => {
  const { clientId } = useParams();
  const [clientData, setClientData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const data = getClientData(clientId || "");
      setClientData(data);
      setLoading(false);
    }, 500);
  }, [clientId]);

  const handleCancelSession = (sessionId: string, reason: string) => {
    if (!clientData) return;

    const updatedSessions = clientData.upcomingSessions.map((session: any) => {
      if (session.id === sessionId) {
        return {
          ...session,
          status: "cancelled",
          cancellationReason: reason,
          cancelledAt: new Date().toISOString(),
          cancelledBy: "client",
        };
      }
      return session;
    });

    setClientData({
      ...clientData,
      upcomingSessions: updatedSessions,
    });

    // Show success message
    alert("Session cancelled successfully! Your trainer has been notified.");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            Loading your fitness portal...
          </p>
        </div>
      </div>
    );
  }

  if (!clientData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Portal Not Found</h2>
            <p className="text-muted-foreground">
              This client portal link is invalid or has expired.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { client, upcomingSessions, workoutPlan, progress, payments } =
    clientData;
  const latestProgress = progress[0];
  const progressChange =
    progress.length > 1 ? progress[0].weight - progress[1].weight : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Clock className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Zap className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">FitClient Portal</h1>
              <p className="text-muted-foreground">
                Your Personal Fitness Dashboard
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Client Welcome */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={client.avatar} />
                <AvatarFallback className="text-lg">
                  {client.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-2xl font-bold">Welcome, {client.name}!</h2>
                <p className="text-muted-foreground">
                  Trainer: {client.trainerName} • Member since{" "}
                  {new Date(client.dateJoined).toLocaleDateString()}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline">{client.fitnessLevel}</Badge>
                  <Badge variant="secondary">
                    <Target className="h-3 w-3 mr-1" />
                    {client.goals}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="workout">Workout</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Next Session</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {upcomingSessions.length > 0
                      ? new Date(upcomingSessions[0].date).toLocaleDateString()
                      : "None"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {upcomingSessions.length > 0
                      ? upcomingSessions[0].startTime
                      : "scheduled"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <Scale className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Current Weight</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {latestProgress?.weight || "N/A"} lbs
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {progressChange !== 0 && (
                      <span
                        className={
                          progressChange < 0
                            ? "text-green-600"
                            : "text-orange-600"
                        }
                      >
                        {progressChange > 0 ? "+" : ""}
                        {progressChange} lbs
                      </span>
                    )}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium">Body Fat</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {latestProgress?.bodyFat || "N/A"}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Latest reading
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-medium">Payment Status</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {payments.filter((p: any) => p.status === "pending").length}
                  </div>
                  <p className="text-xs text-muted-foreground">pending</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                  Recent Achievements
                </CardTitle>
                <CardDescription>
                  Your latest fitness milestones and badges
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-700">
                        🏆
                      </div>
                      <p className="text-sm font-medium">5 Badges</p>
                      <p className="text-xs text-muted-foreground">Earned</p>
                    </div>
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="text-2xl font-bold text-blue-700">🔥</div>
                      <p className="text-sm font-medium">7 Days</p>
                      <p className="text-xs text-muted-foreground">
                        Current Streak
                      </p>
                    </div>
                  </div>
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-lg">🎯</div>
                      <p className="text-sm font-medium">Latest Achievement</p>
                    </div>
                    <p className="text-sm text-green-800">
                      Week Warrior - 7 consecutive days!
                    </p>
                  </div>
                </div>
                <div className="pt-3 border-t">
                  <Button variant="outline" size="sm" className="w-full">
                    <Star className="h-4 w-4 mr-2" />
                    View All Achievements
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Upcoming Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {upcomingSessions.slice(0, 3).map((session: any) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{session.type}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(session.date).toLocaleDateString()} at{" "}
                          {session.startTime}
                        </p>
                        {session.status === "cancelled" &&
                          session.cancellationReason && (
                            <p className="text-xs text-red-600 mt-1">
                              Cancelled: {session.cancellationReason}
                            </p>
                          )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(session.status)}>
                          {getStatusIcon(session.status)}
                          <span className="ml-1 capitalize">
                            {session.status}
                          </span>
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {upcomingSessions.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">
                      No upcoming sessions scheduled
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Latest Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {latestProgress ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium">Weight</p>
                          <p className="text-2xl font-bold">
                            {latestProgress.weight} lbs
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Body Fat</p>
                          <p className="text-2xl font-bold">
                            {latestProgress.bodyFat}%
                          </p>
                        </div>
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm">{latestProgress.notes}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-4">
                      No progress recorded yet
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sessions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Your Sessions</CardTitle>
                <CardDescription>
                  All your training sessions - upcoming, completed, and
                  cancelled
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingSessions.map((session: any) => (
                    <Card key={session.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-3">
                            <h4 className="font-semibold">{session.type}</h4>
                            <Badge className={getStatusColor(session.status)}>
                              {getStatusIcon(session.status)}
                              <span className="ml-1 capitalize">
                                {session.status}
                              </span>
                            </Badge>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(session.date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {session.startTime} - {session.endTime}
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />${session.cost}
                            </div>
                          </div>

                          <p className="text-sm">📍 {session.location}</p>

                          {session.status === "cancelled" && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                              <p className="text-sm text-red-800">
                                <strong>Cancelled:</strong>{" "}
                                {session.cancellationReason}
                              </p>
                              {session.cancelledAt && (
                                <p className="text-xs text-red-600 mt-1">
                                  Cancelled on{" "}
                                  {new Date(
                                    session.cancelledAt,
                                  ).toLocaleString()}
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="ml-4">
                          <CancelSessionDialog
                            session={session}
                            onCancel={handleCancelSession}
                          />
                        </div>
                      </div>

                      {session.notes && session.status !== "cancelled" && (
                        <div className="mt-3 p-3 bg-muted rounded-lg">
                          <p className="text-sm">
                            <strong>Session Notes:</strong> {session.notes}
                          </p>
                        </div>
                      )}
                    </Card>
                  ))}

                  {upcomingSessions.length === 0 && (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        No sessions scheduled yet. Your trainer will schedule
                        sessions for you.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workout" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Dumbbell className="h-5 w-5" />
                      {workoutPlan.name}
                    </CardTitle>
                    <CardDescription>{workoutPlan.description}</CardDescription>
                  </div>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {workoutPlan.exercises.map((exercise: any, index: number) => (
                    <div
                      key={exercise.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-medium">{exercise.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {exercise.sets} sets × {exercise.reps}
                          </p>
                          {exercise.notes && (
                            <p className="text-xs text-muted-foreground mt-1">
                              💡 {exercise.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Your Progress Journey
                </CardTitle>
                <CardDescription>
                  Track your fitness improvements over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {progress.map((entry: any) => (
                    <Card key={entry.id} className="p-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">
                            {new Date(entry.date).toLocaleDateString()}
                          </h4>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                          <div>
                            <p className="font-medium">Weight</p>
                            <p className="text-lg">{entry.weight} lbs</p>
                          </div>
                          <div>
                            <p className="font-medium">Body Fat</p>
                            <p className="text-lg">{entry.bodyFat}%</p>
                          </div>
                          <div>
                            <p className="font-medium">Chest</p>
                            <p className="text-lg">
                              {entry.measurements.chest}"
                            </p>
                          </div>
                          <div>
                            <p className="font-medium">Waist</p>
                            <p className="text-lg">
                              {entry.measurements.waist}"
                            </p>
                          </div>
                          <div>
                            <p className="font-medium">Arms</p>
                            <p className="text-lg">
                              {entry.measurements.arms}"
                            </p>
                          </div>
                        </div>
                        {entry.notes && (
                          <div className="p-3 bg-muted rounded-lg">
                            <p className="text-sm">{entry.notes}</p>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                  Your Achievements & Streaks
                </CardTitle>
                <CardDescription>
                  Track your fitness milestones, badges, and consistency streaks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GamificationDashboard
                  client={client}
                  variant="full"
                  showCelebrations={false}
                  isClientView={true}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Payment History
                </CardTitle>
                <CardDescription>
                  Your payment status and billing information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {payments.map((payment: any) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium">{payment.description}</h4>
                        <p className="text-sm text-muted-foreground">
                          Due: {new Date(payment.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold">${payment.amount}</span>
                        <Badge
                          className={
                            payment.status === "paid"
                              ? "bg-green-100 text-green-800"
                              : "bg-orange-100 text-orange-800"
                          }
                        >
                          {payment.status === "paid" ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <Clock className="h-3 w-3 mr-1" />
                          )}
                          {payment.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ClientPortal;
