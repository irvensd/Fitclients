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
  Sparkles,
} from "lucide-react";
import { GamificationDashboard } from "@/components/GamificationDashboard";
import { useData } from "@/contexts/DataContext";
import { calculateGamificationData } from "@/lib/gamification";

// Mock client data - in real app this would come from API based on clientId
const getClientData = (clientId: string) => {
  const clientData = {
    "1": {
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
          date: "2025-01-20",
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
          date: "2025-01-22",
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
        {
          id: "4",
          date: "2024-03-15",
          startTime: "09:00",
          endTime: "10:00",
          type: "Personal Training",
          location: "FitGym Downtown",
          notes: "Completed successfully",
          status: "completed",
          cost: 75,
        },
      ],
      workoutPlan: {
        id: "wp1",
        name: "Fat Loss Circuit Training",
        description:
          "High-intensity circuit training focused on calorie burn and weight loss",
        exercises: [
          {
            name: "Burpees",
            sets: 3,
            reps: "10",
            notes: "Rest 30s between sets",
          },
          {
            name: "Mountain Climbers",
            sets: 3,
            reps: "20",
            notes: "Keep core tight",
          },
          { name: "Jump Squats", sets: 3, reps: "15", notes: "Land softly" },
          {
            name: "Push-ups",
            sets: 3,
            reps: "8-12",
            notes: "Modify on knees if needed",
          },
          {
            name: "Plank",
            sets: 3,
            reps: "45s",
            notes: "Hold steady position",
          },
        ],
        lastUpdated: "2024-01-15",
      },
      progress: [
        {
          id: "1",
          date: "2024-03-15",
          weight: 159,
          bodyFat: 19.5,
          measurements: {
            chest: 35,
            waist: 28,
            hips: 37,
            arms: 12.5,
            thighs: 23,
          },
          notes: "Excellent progress - lost 6 lbs!",
        },
        {
          id: "2",
          date: "2024-02-29",
          weight: 162,
          bodyFat: 21,
          measurements: {
            chest: 35.5,
            waist: 29,
            hips: 37.5,
            arms: 12.2,
            thighs: 23.5,
          },
          notes: "Great progress after 2 weeks!",
        },
        {
          id: "3",
          date: "2024-01-15",
          weight: 165,
          bodyFat: 22,
          measurements: {
            chest: 36,
            waist: 30,
            hips: 38,
            arms: 12,
            thighs: 24,
          },
          notes: "Initial measurements",
        },
      ],
      payments: [
        {
          id: "1",
          amount: 75,
          date: "2024-03-15",
          status: "completed",
          description: "Personal Training Session",
          method: "card",
        },
        {
          id: "2",
          amount: 75,
          date: "2024-03-18",
          status: "pending",
          description: "Upcoming Session Payment",
          method: "bank-transfer",
        },
        {
          id: "3",
          amount: 225,
          date: "2024-03-01",
          status: "completed",
          description: "Monthly Package (3 sessions)",
          method: "bank-transfer",
        },
      ],
    },
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
          date: "2025-01-20",
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
          date: "2025-01-22",
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
        {
          id: "4",
          date: "2024-03-15",
          startTime: "09:00",
          endTime: "10:00",
          type: "Personal Training",
          location: "FitGym Downtown",
          notes: "Great session on upper body!",
          status: "completed",
          cost: 75,
          recap: {
            id: "recap-1",
            sessionId: "4",
            clientId: "1",
            createdAt: "2024-03-15T11:00:00Z",
            trainerForm: {
              workoutFocus: "Upper body strength",
              exercisesCompleted: [
                "Push-ups",
                "Bench Press",
                "Pull-ups",
                "Shoulder Press",
              ],
              clientPerformance: "excellent",
              clientMood: "energetic",
              achievementsToday: "First unassisted pull-up!",
              challengesFaced: "",
              notesForNextSession: "Ready to increase weights",
              progressObservations:
                "Significant improvement in upper body strength",
            },
            aiGeneratedContent: {
              workoutSummary:
                "Today's personal training session focused on upper body strength. Sarah completed push-ups, bench press, pull-ups, and shoulder press with excellent form and technique. Significant improvement in upper body strength was observed.",
              personalizedEncouragement:
                "Sarah, your energy today was contagious! 🔋 You're really hitting your stride. The progress is undeniable! Your consistency is paying off, and today's achievements of \"First unassisted pull-up!\" prove you're on the right track toward your goal of weight loss and strength building.",
              nextStepsRecommendations:
                "For next session: Ready to increase weights; Continue building on today's momentum with consistent progression.",
              keyAchievements: [
                "First unassisted pull-up!",
                "Completed 4 exercises",
                "Excellent performance rating",
              ],
              motivationalQuote:
                "\"Strength doesn't come from what you can do. It comes from overcoming the things you once thought you couldn't.\" - Rikki Rogers",
              progressHighlight:
                "Sarah is showing consistent improvement in upper body strength",
            },
            sharedWithClient: true,
            clientViewed: true,
            clientViewedAt: "2024-03-15T15:30:00Z",
          },
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
          date: "2025-01-21",
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
          date: "2025-01-23",
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
          date: "2025-01-24",
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
    },
    "2": {
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
          date: "2025-01-21",
          startTime: "14:00",
          endTime: "15:00",
          type: "Personal Training",
          location: "FitGym Downtown",
          notes: "Upper body strength training",
          status: "scheduled",
          cost: 75,
        },
      ],
      workoutPlan: {
        id: "wp2",
        name: "Upper Body Strength Builder",
        description:
          "Compound movements for building muscle mass in the upper body",
        exercises: [
          {
            name: "Bench Press",
            sets: 4,
            reps: "8-10",
            notes: "Rest 2-3 min between sets",
          },
          {
            name: "Pull-ups",
            sets: 4,
            reps: "6-8",
            notes: "Use assistance if needed",
          },
          {
            name: "Overhead Press",
            sets: 3,
            reps: "8-10",
            notes: "Keep core engaged",
          },
          {
            name: "Barbell Rows",
            sets: 3,
            reps: "10-12",
            notes: "Squeeze shoulder blades",
          },
        ],
        lastUpdated: "2024-02-03",
      },
      progress: [
        {
          id: "1",
          date: "2024-03-15",
          weight: 183,
          bodyFat: 15.5,
          measurements: {
            chest: 43,
            waist: 32.5,
            hips: 40.5,
            arms: 15.5,
            thighs: 26.5,
          },
          notes: "Good muscle gain, staying lean",
        },
        {
          id: "2",
          date: "2024-02-03",
          weight: 180,
          bodyFat: 15,
          measurements: {
            chest: 42,
            waist: 32,
            hips: 40,
            arms: 15,
            thighs: 26,
          },
          notes: "Starting bulk phase",
        },
      ],
      payments: [
        {
          id: "1",
          amount: 75,
          date: "2024-03-15",
          status: "completed",
          description: "Personal Training Session",
          method: "card",
        },
        {
          id: "2",
          amount: 300,
          date: "2024-04-01",
          status: "pending",
          description: "Monthly Package (4 sessions)",
          method: "bank-transfer",
        },
      ],
    },
    "3": {
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
          date: "2025-01-23",
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
        id: "wp3",
        name: "Marathon Base Training",
        description: "Endurance and strength training for marathon preparation",
        exercises: [
          {
            name: "Easy Run",
            sets: 1,
            reps: "45 min",
            notes: "Maintain conversational pace",
          },
          {
            name: "Lunges",
            sets: 3,
            reps: "12 each leg",
            notes: "Focus on form over speed",
          },
          {
            name: "Single Leg Deadlifts",
            sets: 3,
            reps: "10 each",
            notes: "Balance and control",
          },
          {
            name: "Calf Raises",
            sets: 3,
            reps: "20",
            notes: "Full range of motion",
          },
        ],
        lastUpdated: "2024-01-28",
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
        {
          id: "2",
          date: "2024-01-28",
          weight: 135,
          bodyFat: 18,
          measurements: {
            chest: 34,
            waist: 26,
            hips: 36,
            arms: 10.5,
            thighs: 21,
          },
          notes: "Marathon training baseline",
        },
      ],
      payments: [
        {
          id: "1",
          amount: 400,
          date: "2024-03-15",
          status: "completed",
          description: "8-Session Package",
          method: "bank-transfer",
        },
      ],
    },
  };

  return clientData[clientId] || null;
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

  // Debug logging
  console.log(
    "Session:",
    session.id,
    "Date:",
    session.date,
    "Status:",
    session.status,
  );
  console.log("Session DateTime:", sessionDateTime);
  console.log("Current Time:", now);
  console.log("Is Past Session:", isPastSession);
  console.log("Is Cancelled:", isCancelled);

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
  const { clients, sessions, getClientProgressEntries, loading: dataLoading } = useData();
  const [clientData, setClientData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!dataLoading && clientId) {
      // Find the actual client from DataContext
      const client = clients.find(c => c.id === clientId);
      
      if (client) {
        // Get client's sessions
        const clientSessions = sessions.filter(s => s.clientId === clientId);
        
        // Get client's progress entries
        const progressEntries = getClientProgressEntries(clientId);
        
        // Structure the data like the mock data format
        const data = {
          client: {
            ...client,
            trainerName: "Your Trainer", // You can get this from auth context or settings
          },
          upcomingSessions: clientSessions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
          workoutPlan: {
            id: "1",
            name: `${client.name}'s Fitness Program`,
            description: "Personalized fitness program designed for your goals",
            exercises: [], // You could expand this with actual workout data
            createdDate: client.dateJoined,
          },
          progress: progressEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
          payments: [] // You could add payment data here if available
        };
        
        setClientData(data);
        setLoading(false);
      } else if (clients.length > 0) {
        // Only set to null if we have clients loaded but this ID wasn't found
        setClientData(null);
        setLoading(false);
      }
      // If clients.length === 0, keep loading until clients are loaded
    }
  }, [clientId, clients, sessions, dataLoading, getClientProgressEntries]);

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

  if (loading || dataLoading) {
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
        <div className="max-w-6xl mx-auto px-4 py-4 sm:py-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Zap className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">
                FitClient Portal
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Your Personal Fitness Dashboard
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-4 sm:py-8 space-y-4 sm:space-y-8">
        {/* Client Welcome */}
        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <Avatar className="h-16 w-16 sm:h-16 sm:w-16">
                <AvatarImage src={client.avatar} />
                <AvatarFallback className="text-lg">
                  {client.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-xl sm:text-2xl font-bold">
                  Welcome, {client.name}!
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Trainer: {client.trainerName} • Member since{" "}
                  {new Date(client.dateJoined).toLocaleDateString()}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-2 mt-2">
                  <Badge variant="outline" className="text-xs sm:text-sm">
                    {client.fitnessLevel}
                  </Badge>
                  <Badge variant="secondary" className="text-xs sm:text-sm">
                    <Target className="h-3 w-3 mr-1" />
                    <span className="truncate max-w-[200px]">
                      {client.goals}
                    </span>
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <div className="overflow-x-auto">
            <TabsList className="grid w-full grid-cols-6 min-w-[600px] sm:min-w-0">
              <TabsTrigger
                value="overview"
                className="text-xs sm:text-sm px-2 sm:px-4"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="sessions"
                className="text-xs sm:text-sm px-2 sm:px-4"
              >
                Sessions
              </TabsTrigger>
              <TabsTrigger
                value="workout"
                className="text-xs sm:text-sm px-2 sm:px-4"
              >
                Workout
              </TabsTrigger>
              <TabsTrigger
                value="progress"
                className="text-xs sm:text-sm px-2 sm:px-4"
              >
                Progress
              </TabsTrigger>
              <TabsTrigger
                value="achievements"
                className="text-xs sm:text-sm px-2 sm:px-4"
              >
                Achievements
              </TabsTrigger>
              <TabsTrigger
                value="payments"
                className="text-xs sm:text-sm px-2 sm:px-4"
              >
                Payments
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-4 sm:space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <Card>
                <CardContent className="pt-4 sm:pt-6">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                    <span className="text-xs sm:text-sm font-medium">
                      Next Session
                    </span>
                  </div>
                  <div className="text-lg sm:text-2xl font-bold mt-1">
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
                <CardContent className="pt-4 sm:pt-6">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Scale className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                    <span className="text-xs sm:text-sm font-medium">
                      Current Weight
                    </span>
                  </div>
                  <div className="text-lg sm:text-2xl font-bold mt-1">
                    {latestProgress?.weight ? `${latestProgress.weight} lbs` : "Not recorded"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {progressChange !== 0 && latestProgress?.weight && (
                      <span
                        className={
                          progressChange < 0
                            ? "text-green-600"
                            : "text-orange-600"
                        }
                      >
                        {progressChange > 0 ? "+" : ""}
                        {progressChange} lbs from last entry
                      </span>
                    )}
                    {!progressChange && latestProgress?.weight && (
                      <span className="text-muted-foreground">
                        Last recorded: {new Date(latestProgress.date).toLocaleDateString()}
                      </span>
                    )}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4 sm:pt-6">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Activity className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
                    <span className="text-xs sm:text-sm font-medium">
                      Body Fat
                    </span>
                  </div>
                  <div className="text-lg sm:text-2xl font-bold mt-1">
                    {latestProgress?.bodyFat ? `${latestProgress.bodyFat}%` : "Not recorded"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {latestProgress?.bodyFat && (
                      <span>Last recorded: {new Date(latestProgress.date).toLocaleDateString()}</span>
                    )}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4 sm:pt-6">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                    <span className="text-xs sm:text-sm font-medium">
                      Progress Entries
                    </span>
                  </div>
                  <div className="text-lg sm:text-2xl font-bold mt-1">
                    {progress.length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {progress.length > 0 
                      ? `Latest: ${new Date(progress[0].date).toLocaleDateString()}`
                      : "Start tracking today"
                    }
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Current Measurements */}
            {latestProgress && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scale className="h-5 w-5 text-primary" />
                    Current Measurements
                  </CardTitle>
                  <CardDescription>
                    Your most recent body measurements from {new Date(latestProgress.date).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                                     <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                     {latestProgress.weight && (
                       <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                         <div className="text-xl font-bold text-green-700 dark:text-green-300">
                           {latestProgress.weight}
                         </div>
                         <div className="text-xs text-green-600 dark:text-green-400">
                           Weight (lbs)
                         </div>
                       </div>
                     )}

                     {latestProgress.height && (
                       <div className="text-center p-3 bg-cyan-50 dark:bg-cyan-950/20 rounded-lg border border-cyan-200 dark:border-cyan-800">
                         <div className="text-xl font-bold text-cyan-700 dark:text-cyan-300">
                           {latestProgress.height}"
                         </div>
                         <div className="text-xs text-cyan-600 dark:text-cyan-400">
                           Height
                         </div>
                       </div>
                     )}
                     
                     {latestProgress.bodyFat && (
                       <div className="text-center p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                         <div className="text-xl font-bold text-purple-700 dark:text-purple-300">
                           {latestProgress.bodyFat}%
                         </div>
                         <div className="text-xs text-purple-600 dark:text-purple-400">
                           Body Fat
                         </div>
                       </div>
                     )}

                    {latestProgress.measurements?.chest && (
                      <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="text-xl font-bold text-blue-700 dark:text-blue-300">
                          {latestProgress.measurements.chest}"
                        </div>
                        <div className="text-xs text-blue-600 dark:text-blue-400">
                          Chest
                        </div>
                      </div>
                    )}

                    {latestProgress.measurements?.waist && (
                      <div className="text-center p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                        <div className="text-xl font-bold text-orange-700 dark:text-orange-300">
                          {latestProgress.measurements.waist}"
                        </div>
                        <div className="text-xs text-orange-600 dark:text-orange-400">
                          Waist
                        </div>
                      </div>
                    )}

                    {latestProgress.measurements?.hips && (
                      <div className="text-center p-3 bg-pink-50 dark:bg-pink-950/20 rounded-lg border border-pink-200 dark:border-pink-800">
                        <div className="text-xl font-bold text-pink-700 dark:text-pink-300">
                          {latestProgress.measurements.hips}"
                        </div>
                        <div className="text-xs text-pink-600 dark:text-pink-400">
                          Hips
                        </div>
                      </div>
                    )}

                    {latestProgress.measurements?.arms && (
                      <div className="text-center p-3 bg-indigo-50 dark:bg-indigo-950/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
                        <div className="text-xl font-bold text-indigo-700 dark:text-indigo-300">
                          {latestProgress.measurements.arms}"
                        </div>
                        <div className="text-xs text-indigo-600 dark:text-indigo-400">
                          Arms
                        </div>
                      </div>
                    )}

                    {latestProgress.measurements?.thighs && (
                      <div className="text-center p-3 bg-teal-50 dark:bg-teal-950/20 rounded-lg border border-teal-200 dark:border-teal-800">
                        <div className="text-xl font-bold text-teal-700 dark:text-teal-300">
                          {latestProgress.measurements.thighs}"
                        </div>
                        <div className="text-xs text-teal-600 dark:text-teal-400">
                          Thighs
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {latestProgress.notes && (
                    <div className="mt-4 p-3 bg-muted rounded-lg">
                      <h5 className="font-medium text-sm mb-1">Notes from your trainer:</h5>
                      <p className="text-sm text-muted-foreground">{latestProgress.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Recent Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                  Your Achievements
                </CardTitle>
                <CardDescription>
                  Your fitness milestones, badges, and current streaks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(() => {
                    // Calculate real gamification data
                    const gamificationData = calculateGamificationData(client, upcomingSessions, progress);
                    
                    const unlockedBadges = gamificationData.badges.filter(b => b.isUnlocked);
                    const activeStreaks = gamificationData.currentStreaks.filter(s => s.isActive);
                    const latestAchievement = gamificationData.recentAchievements[0];
                    
                    return (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-center">
                          <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                            <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                              🏆
                            </div>
                            <p className="text-sm font-medium">{unlockedBadges.length} Badges</p>
                            <p className="text-xs text-muted-foreground">
                              {unlockedBadges.length === 0 ? "Start your journey!" : "Earned"}
                            </p>
                          </div>
                          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                              ⚡
                            </div>
                            <p className="text-sm font-medium">
                              {activeStreaks.length > 0 ? activeStreaks[0].currentCount : 0} Days
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {activeStreaks.length > 0 ? "Current Streak" : "No active streak"}
                            </p>
                          </div>
                        </div>
                        
                        {latestAchievement ? (
                          <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="text-lg">{latestAchievement.icon}</div>
                              <p className="text-sm font-medium">Latest Achievement</p>
                            </div>
                            <p className="text-sm text-green-800 dark:text-green-300">
                              {latestAchievement.title} - {latestAchievement.description}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              +{latestAchievement.xpEarned} XP earned
                            </p>
                          </div>
                        ) : (
                          <div className="p-3 bg-muted/50 border border-border rounded-lg text-center">
                            <div className="text-lg mb-2">🎯</div>
                            <p className="text-sm font-medium">Ready to earn your first achievement?</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Complete your first session to unlock "First Step" badge!
                            </p>
                          </div>
                        )}
                        
                        {/* Progress toward next badges */}
                        {(() => {
                          const nextBadges = gamificationData.badges
                            .filter(b => !b.isUnlocked && b.progress && b.progress > 0)
                            .slice(0, 2);
                          
                          return nextBadges.length > 0 && (
                            <div className="pt-3 border-t">
                              <h5 className="text-sm font-medium mb-2">Progress toward next badges:</h5>
                              <div className="space-y-2">
                                {nextBadges.map(badge => (
                                  <div key={badge.id} className="space-y-1">
                                    <div className="flex justify-between text-xs">
                                      <span className="flex items-center gap-1">
                                        <span>{badge.icon}</span>
                                        <span>{badge.name}</span>
                                      </span>
                                      <span>{Math.round(badge.progress || 0)}%</span>
                                    </div>
                                    <Progress value={badge.progress || 0} className="h-1" />
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })()}
                      </>
                    );
                  })()}
                </div>
                                  <div className="pt-3 border-t">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => {
                        // Navigate to achievements tab using state
                        setActiveTab("achievements");
                        // Scroll to top of the content
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
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
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {latestProgress.weight && (
                          <div>
                            <p className="text-sm font-medium">Weight</p>
                            <p className="text-2xl font-bold">
                              {latestProgress.weight} lbs
                            </p>
                          </div>
                        )}
                        {latestProgress.height && (
                          <div>
                            <p className="text-sm font-medium">Height</p>
                            <p className="text-2xl font-bold">
                              {latestProgress.height}"
                            </p>
                          </div>
                        )}
                        {latestProgress.bodyFat && (
                          <div>
                            <p className="text-sm font-medium">Body Fat</p>
                            <p className="text-2xl font-bold">
                              {latestProgress.bodyFat}%
                            </p>
                          </div>
                        )}
                      </div>
                      {latestProgress.notes && (
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="text-sm">{latestProgress.notes}</p>
                        </div>
                      )}
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

                      {/* Session Recap for completed sessions */}
                      {session.status === "completed" && session.recap && (
                        <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
                          <div className="flex items-center gap-2 mb-3">
                            <Sparkles className="h-5 w-5 text-purple-600" />
                            <h4 className="font-semibold text-purple-800">
                              Your Personal Session Recap
                            </h4>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <h5 className="font-medium text-sm mb-1">
                                💪 How You Did
                              </h5>
                              <p className="text-sm text-gray-700">
                                {
                                  session.recap.aiGeneratedContent
                                    .personalizedEncouragement
                                }
                              </p>
                            </div>

                            <div>
                              <h5 className="font-medium text-sm mb-1">
                                🏆 Today's Wins
                              </h5>
                              <ul className="text-sm space-y-1">
                                {session.recap.aiGeneratedContent.keyAchievements.map(
                                  (achievement, idx) => (
                                    <li
                                      key={idx}
                                      className="flex items-center gap-2"
                                    >
                                      <CheckCircle className="h-3 w-3 text-green-600" />
                                      {achievement}
                                    </li>
                                  ),
                                )}
                              </ul>
                            </div>

                            <div>
                              <h5 className="font-medium text-sm mb-1">
                                🎯 What's Next
                              </h5>
                              <p className="text-sm text-gray-700">
                                {
                                  session.recap.aiGeneratedContent
                                    .nextStepsRecommendations
                                }
                              </p>
                            </div>

                            <div className="pt-2 border-t border-purple-200">
                              <p className="text-xs italic text-purple-700">
                                {
                                  session.recap.aiGeneratedContent
                                    .motivationalQuote
                                }
                              </p>
                            </div>
                          </div>
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
                  {workoutPlan.exercises.length > 0 ? workoutPlan.exercises.map((exercise: any, index: number) => (
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
                  )) : (
                    <div className="text-center py-8">
                      <Dumbbell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Your personalized workout plan will appear here once created by your trainer.
                      </p>
                    </div>
                  )}
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
                  {progress.length > 0 ? progress.map((entry: any) => (
                    <Card key={entry.id} className="p-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">
                            {new Date(entry.date).toLocaleDateString()}
                          </h4>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 text-sm">
                          {entry.weight && (
                            <div>
                              <p className="font-medium text-green-700 dark:text-green-300">Weight</p>
                              <p className="text-lg font-semibold">{entry.weight} lbs</p>
                            </div>
                          )}
                          {entry.height && (
                            <div>
                              <p className="font-medium text-blue-700 dark:text-blue-300">Height</p>
                              <p className="text-lg font-semibold">{entry.height}"</p>
                            </div>
                          )}
                          {entry.bodyFat && (
                            <div>
                              <p className="font-medium text-purple-700 dark:text-purple-300">Body Fat</p>
                              <p className="text-lg font-semibold">{entry.bodyFat}%</p>
                            </div>
                          )}
                          {entry.measurements?.chest && (
                            <div>
                              <p className="font-medium text-blue-700 dark:text-blue-300">Chest</p>
                              <p className="text-lg font-semibold">{entry.measurements.chest}"</p>
                            </div>
                          )}
                          {entry.measurements?.waist && (
                            <div>
                              <p className="font-medium text-orange-700 dark:text-orange-300">Waist</p>
                              <p className="text-lg font-semibold">{entry.measurements.waist}"</p>
                            </div>
                          )}
                          {entry.measurements?.hips && (
                            <div>
                              <p className="font-medium text-pink-700 dark:text-pink-300">Hips</p>
                              <p className="text-lg font-semibold">{entry.measurements.hips}"</p>
                            </div>
                          )}
                          {entry.measurements?.arms && (
                            <div>
                              <p className="font-medium text-indigo-700 dark:text-indigo-300">Arms</p>
                              <p className="text-lg font-semibold">{entry.measurements.arms}"</p>
                            </div>
                          )}
                          {entry.measurements?.thighs && (
                            <div>
                              <p className="font-medium text-teal-700 dark:text-teal-300">Thighs</p>
                              <p className="text-lg font-semibold">{entry.measurements.thighs}"</p>
                            </div>
                          )}
                        </div>
                        {entry.notes && (
                          <div className="p-3 bg-muted rounded-lg">
                            <p className="text-sm">{entry.notes}</p>
                          </div>
                        )}
                      </div>
                    </Card>
                  )) : (
                    <div className="text-center py-8">
                      <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        No progress data recorded yet. Your trainer will track your progress during sessions.
                      </p>
                    </div>
                  )}
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
                {(() => {
                  // Calculate real gamification data and pass it properly
                  const gamificationData = calculateGamificationData(client, upcomingSessions, progress);
                  
                  return (
                    <div className="space-y-6">
                      {/* Level & Stats Overview */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card className="p-4 text-center bg-gradient-to-br from-primary/5 to-primary/10">
                          <div className="text-2xl font-bold text-primary">{gamificationData.level}</div>
                          <div className="text-xs text-muted-foreground">Level</div>
                        </Card>
                        <Card className="p-4 text-center bg-gradient-to-br from-yellow-50 to-yellow-100/50">
                          <div className="text-2xl font-bold text-yellow-700">{gamificationData.badges.filter(b => b.isUnlocked).length}</div>
                          <div className="text-xs text-muted-foreground">Badges Earned</div>
                        </Card>
                        <Card className="p-4 text-center bg-gradient-to-br from-blue-50 to-blue-100/50">
                          <div className="text-2xl font-bold text-blue-700">{gamificationData.currentStreaks.filter(s => s.isActive).length}</div>
                          <div className="text-xs text-muted-foreground">Active Streaks</div>
                        </Card>
                        <Card className="p-4 text-center bg-gradient-to-br from-green-50 to-green-100/50">
                          <div className="text-2xl font-bold text-green-700">{gamificationData.stats.totalSessions}</div>
                          <div className="text-xs text-muted-foreground">Total Sessions</div>
                        </Card>
                      </div>

                      {/* Badges Grid */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Available Badges</CardTitle>
                          <CardDescription>Complete activities to unlock these achievements</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {gamificationData.badges.map(badge => (
                              <div
                                key={badge.id}
                                className={`p-4 border rounded-lg text-center transition-all ${
                                  badge.isUnlocked 
                                    ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200' 
                                    : 'bg-muted/30 border-muted-foreground/20 opacity-60'
                                }`}
                              >
                                <div className="text-2xl mb-2">{badge.icon}</div>
                                <h4 className="font-medium text-sm">{badge.name}</h4>
                                <p className="text-xs text-muted-foreground mb-2">{badge.description}</p>
                                <div className="text-xs font-medium">{badge.requirement}</div>
                                {!badge.isUnlocked && badge.progress && badge.progress > 0 && (
                                  <div className="mt-2">
                                    <Progress value={badge.progress} className="h-1" />
                                    <p className="text-xs text-muted-foreground mt-1">{Math.round(badge.progress)}% complete</p>
                                  </div>
                                )}
                                {badge.isUnlocked && (
                                  <div className="mt-2">
                                    <Badge className="bg-yellow-100 text-yellow-800 text-xs">Unlocked!</Badge>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Current Streaks */}
                      {gamificationData.currentStreaks.length > 0 && (
                        <Card>
                          <CardHeader>
                            <CardTitle>Your Streaks</CardTitle>
                            <CardDescription>Keep the momentum going!</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {gamificationData.currentStreaks.map(streak => (
                                <div key={streak.id} className="flex items-center justify-between p-4 border rounded-lg">
                                  <div className="flex items-center gap-3">
                                    <div className="text-2xl">{streak.icon}</div>
                                    <div>
                                      <h4 className="font-medium">{streak.title}</h4>
                                      <p className="text-sm text-muted-foreground">{streak.description}</p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-lg font-bold">{streak.currentCount}</div>
                                    <div className="text-xs text-muted-foreground">
                                      {streak.isActive ? 'Active' : 'Broken'}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  );
                })()}
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
