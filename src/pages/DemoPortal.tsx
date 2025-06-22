import { useState } from "react";
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

// Hardcoded demo data
const demoClient = {
  id: "1",
  name: "Sarah Johnson",
  email: "sarah.johnson@email.com",
  phone: "(555) 123-4567",
  avatar: "",
};

const demoSessions = [
  {
    id: "1",
    date: "2024-02-20",
    startTime: "09:00",
    endTime: "10:00",
    type: "personal-training",
    status: "scheduled",
  },
  {
    id: "2",
    date: "2024-02-15",
    startTime: "09:00",
    endTime: "10:00",
    type: "personal-training",
    status: "completed",
  },
  {
    id: "3",
    date: "2024-02-12",
    startTime: "09:00",
    endTime: "10:00",
    type: "personal-training",
    status: "completed",
  },
];

const demoWorkoutPlan = {
  name: "Strength & Conditioning Program",
  description: "A comprehensive program focused on building strength and improving overall conditioning",
  exercises: [
    {
      name: "Squats",
      sets: "3",
      reps: "12",
      weight: "135 lbs",
      notes: "Focus on form, keep knees aligned"
    },
    {
      name: "Bench Press",
      sets: "3",
      reps: "10",
      weight: "95 lbs",
      notes: "Controlled movement, full range of motion"
    },
    {
      name: "Deadlifts",
      sets: "3",
      reps: "8",
      weight: "155 lbs",
      notes: "Keep back straight, engage core"
    },
    {
      name: "Pull-ups",
      sets: "3",
      reps: "8",
      weight: "Body weight",
      notes: "Use assistance band if needed"
    },
  ]
};

const demoProgress = [
  { date: "2024-01-01", weight: 180, bodyFat: 20 },
  { date: "2024-01-15", weight: 178, bodyFat: 19.5 },
  { date: "2024-02-01", weight: 175, bodyFat: 19 },
  { date: "2024-02-15", weight: 173, bodyFat: 18.5 },
];

const demoPayments = [
  {
    id: "1",
    date: "2024-02-01",
    amount: 300,
    description: "Monthly Training Package",
    status: "paid"
  },
  {
    id: "2",
    date: "2024-01-01",
    amount: 300,
    description: "Monthly Training Package",
    status: "paid"
  },
];

const demoGamificationData = {
  clientId: "1",
  clientName: "Sarah Johnson",
  level: 8,
  totalXP: 2450,
  currentStreaks: [
    {
      id: "session-streak",
      type: "session" as const,
      currentCount: 5,
      bestCount: 8,
      isActive: true,
      lastActivityDate: "2024-02-15T00:00:00.000Z",
      startDate: "2024-02-01T00:00:00.000Z",
      title: "Workout Streak",
      description: "Consecutive workout sessions",
      icon: "🔥",
    },
    {
      id: "progress-streak",
      type: "progress_log" as const,
      currentCount: 3,
      bestCount: 5,
      isActive: true,
      lastActivityDate: "2024-02-15T00:00:00.000Z",
      startDate: "2024-02-10T00:00:00.000Z",
      title: "Progress Tracking",
      description: "Consecutive days logging progress",
      icon: "📊",
    }
  ],
  badges: [
    { 
      id: "consistency", 
      category: "consistency" as const,
      name: "Consistency Champion", 
      description: "5 workouts in a row", 
      icon: "🏆", 
      color: "bg-yellow-100 text-yellow-800",
      requirement: "5-day streak",
      isUnlocked: true,
      progress: 100,
      achievedDate: "2024-02-10T00:00:00.000Z"
    },
    { 
      id: "strength", 
      category: "sessions" as const,
      name: "Strength Builder", 
      description: "Increased weight by 20%", 
      icon: "💪", 
      color: "bg-green-100 text-green-800",
      requirement: "20 sessions",
      isUnlocked: true,
      progress: 100,
      achievedDate: "2024-02-05T00:00:00.000Z"
    },
    { 
      id: "dedication", 
      category: "sessions" as const,
      name: "Dedicated Trainee", 
      description: "20+ sessions completed", 
      icon: "🎯", 
      color: "bg-blue-100 text-blue-800",
      requirement: "20 sessions",
      isUnlocked: true,
      progress: 100,
      achievedDate: "2024-02-01T00:00:00.000Z"
    },
  ],
  recentAchievements: [
    { 
      id: "first-month", 
      type: "milestone" as const,
      title: "First Month Complete", 
      description: "Completed your first month of training", 
      icon: "🎯",
      xpEarned: 100,
      achievedDate: "2024-01-31T00:00:00.000Z",
      isNew: false
    },
    { 
      id: "weight-loss", 
      type: "milestone" as const,
      title: "Weight Loss Milestone", 
      description: "Lost 5+ pounds", 
      icon: "📉",
      xpEarned: 150,
      achievedDate: "2024-02-10T00:00:00.000Z",
      isNew: true
    },
  ],
  stats: {
    totalSessions: 24,
    totalWeightLoss: 7,
    totalDaysTracked: 15,
    longestStreak: 8,
    badgesEarned: 3,
    currentLevel: 8,
  }
};

const upcomingSessions = demoSessions.filter(s => new Date(s.date) >= new Date() && s.status === 'scheduled');
const pastSessions = demoSessions.filter(s => new Date(s.date) < new Date() || s.status !== 'scheduled');

const DemoPortal = () => {
  console.log("=== DEMO PORTAL LOADED ===");
  console.log("DemoPortal component is rendering");
  console.log("Demo client data:", demoClient);
  console.log("=== END DEMO PORTAL DEBUG ===");

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="bg-background border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <Dumbbell className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">FitClients Portal</h1>
              <Badge variant="secondary" className="ml-2">DEMO</Badge>
            </div>
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarFallback>{demoClient.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{demoClient.name}</p>
                <p className="text-sm text-muted-foreground">Client Portal</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="workouts">Workouts</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  {upcomingSessions.length > 0 ? (
                    <ul className="space-y-4">
                      {upcomingSessions.map((session) => (
                        <li key={session.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="bg-primary/10 text-primary p-3 rounded-lg">
                              <Calendar className="h-6 w-6" />
                            </div>
                            <div>
                              <p className="font-semibold">{new Date(session.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                              <p className="text-sm text-muted-foreground">{session.startTime} - {session.endTime}</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                            <XCircle className="h-4 w-4 mr-1" />
                            Cancel Session
                          </Button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">No upcoming sessions.</p>
                  )}
                </CardContent>
              </Card>

              <GamificationDashboard data={demoGamificationData} variant="summary" />
              
              <Card>
                <CardHeader>
                  <CardTitle>Session History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="text-left text-muted-foreground">
                        <tr>
                          <th className="p-2">Date</th>
                          <th className="p-2">Type</th>
                          <th className="p-2">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pastSessions.map((session) => (
                          <tr key={session.id} className="border-t">
                            <td className="p-2">{new Date(session.date).toLocaleDateString()}</td>
                            <td className="p-2">{session.type}</td>
                            <td className="p-2">
                              <Badge variant={session.status === 'completed' ? 'default' : 'secondary'}>
                                {session.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="workouts" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>{demoWorkoutPlan.name}</CardTitle>
                <CardDescription>{demoWorkoutPlan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {demoWorkoutPlan.exercises.map((exercise, index) => (
                    <li key={index} className="p-3 bg-muted rounded-lg">
                      <p className="font-semibold">{exercise.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {exercise.sets} sets of {exercise.reps} {exercise.weight ? ` at ${exercise.weight}` : ""}
                      </p>
                      {exercise.notes && <p className="text-xs mt-1">Notes: {exercise.notes}</p>}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Weight Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {demoProgress.map((entry, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                        <span className="text-sm">{new Date(entry.date).toLocaleDateString()}</span>
                        <span className="font-semibold">{entry.weight} lbs</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Body Fat Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {demoProgress.map((entry, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                        <span className="text-sm">{new Date(entry.date).toLocaleDateString()}</span>
                        <span className="font-semibold">{entry.bodyFat}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="payments" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-left text-muted-foreground">
                      <tr>
                        <th className="p-2">Date</th>
                        <th className="p-2">Description</th>
                        <th className="p-2">Amount</th>
                        <th className="p-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {demoPayments.map((payment) => (
                        <tr key={payment.id} className="border-t">
                          <td className="p-2">{new Date(payment.date).toLocaleDateString()}</td>
                          <td className="p-2">{payment.description}</td>
                          <td className="p-2">${payment.amount}</td>
                          <td className="p-2">
                            <Badge variant="default">
                              {payment.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default DemoPortal; 