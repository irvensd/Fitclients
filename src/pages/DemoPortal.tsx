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
import { Label } from "@/components/ui/label";
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
  MessageCircle,
  HelpCircle,
  Instagram,
  Facebook,
  Youtube,
} from "lucide-react";
import { GamificationDashboard } from "@/components/GamificationDashboard";
import { BusinessHours } from "@/components/BusinessHours";
import { InstallPrompt } from "@/components/InstallPrompt";

// Hardcoded demo data
const demoClient = {
  id: "1",
  name: "Sarah Johnson",
  email: "sarah.johnson@email.com",
  phone: "(555) 123-4567",
  avatar: "",
};

// Demo trainer profile with business information
const demoTrainerProfile = {
  id: "demo-trainer",
  email: "trainer@fitclients.com",
  firstName: "Alex",
  lastName: "Thompson",
  displayName: "Alex Thompson",
  phone: "(555) 987-6543",
  bio: "Certified personal trainer with 8+ years of experience helping clients achieve their fitness goals. Specializing in strength training, weight loss, and functional movement.",
  businessName: "FitLife Personal Training",
  website: "https://fitlife-training.com",
  address: "123 Fitness Ave, Wellness City, CA 90210",
  createdAt: "2020-01-01T00:00:00.000Z",
  operatingHours: [
    { day: "Monday", isOpen: true, startTime: "06:00", endTime: "20:00" },
    { day: "Tuesday", isOpen: true, startTime: "06:00", endTime: "20:00" },
    { day: "Wednesday", isOpen: true, startTime: "06:00", endTime: "20:00" },
    { day: "Thursday", isOpen: true, startTime: "06:00", endTime: "20:00" },
    { day: "Friday", isOpen: true, startTime: "06:00", endTime: "18:00" },
    { day: "Saturday", isOpen: true, startTime: "08:00", endTime: "16:00" },
    { day: "Sunday", isOpen: false, startTime: "09:00", endTime: "17:00" },
  ],
  socialMedia: {
    instagram: "@fitlife_alex",
    facebook: "FitLifePersonalTraining",
    youtube: "FitLifeTrainingChannel",
    tiktok: "@fitlife_workouts",
  },
};

const demoSessions = [
  {
    id: "1",
    date: "2024-02-20",
    startTime: "09:00",
    endTime: "10:00",
    type: "Personal Training",
    status: "scheduled",
  },
  {
    id: "2",
    date: "2024-02-22",
    startTime: "14:00",
    endTime: "15:00",
    type: "Strength Training",
    status: "scheduled",
  },
  {
    id: "3",
    date: "2024-02-15",
    startTime: "09:00",
    endTime: "10:00",
    type: "Personal Training",
    status: "completed",
  },
  {
    id: "4",
    date: "2024-02-12",
    startTime: "09:00",
    endTime: "10:00",
    type: "Cardio Session",
    status: "completed",
  },
  {
    id: "5",
    date: "2024-02-08",
    startTime: "16:00",
    endTime: "17:00",
    type: "Strength Training",
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
      weight: "135",
      notes: "Focus on form, keep knees aligned"
    },
    {
      name: "Bench Press",
      sets: "3",
      reps: "10",
      weight: "95",
      notes: "Controlled movement, full range of motion"
    },
    {
      name: "Deadlifts",
      sets: "3",
      reps: "8",
      weight: "155",
      notes: "Keep back straight, engage core"
    },
    {
      name: "Pull-ups",
      sets: "3",
      reps: "8",
      weight: "",
      notes: "Use assistance band if needed"
    },
    {
      name: "Plank",
      sets: "3",
      reps: "60 seconds",
      weight: "",
      notes: "Keep core tight, straight line from head to toe"
    },
    {
      name: "Lunges",
      sets: "3",
      reps: "12 each leg",
      weight: "25",
      notes: "Step forward, keep front knee over ankle"
    },
  ]
};

const demoProgress = [
  { id: "1", date: "2024-01-01", weight: 180, bodyFat: 20 },
  { id: "2", date: "2024-01-15", weight: 178, bodyFat: 19.5 },
  { id: "3", date: "2024-02-01", weight: 175, bodyFat: 19 },
  { id: "4", date: "2024-02-15", weight: 173, bodyFat: 18.5 },
];

const demoPayments = [
  {
    id: "1",
    date: "2024-02-01",
    amount: 300,
    description: "Monthly Training Package",
    method: "Credit Card",
    status: "completed"
  },
  {
    id: "2",
    date: "2024-01-01",
    amount: 300,
    description: "Monthly Training Package", 
    method: "Credit Card",
    status: "completed"
  },
  {
    id: "3",
    date: "2023-12-01",
    amount: 300,
    description: "Monthly Training Package",
    method: "Credit Card", 
    status: "completed"
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

const upcomingSessions = demoSessions.filter(s => new Date(s.date) >= new Date() && s.status === 'scheduled').sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
const pastSessions = demoSessions.filter(s => new Date(s.date) < new Date() || s.status !== 'scheduled').sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

const DemoPortal = () => {
  console.log("=== DEMO PORTAL LOADED ===");
  console.log("DemoPortal component is rendering");
  console.log("Demo client data:", demoClient);
  console.log("=== END DEMO PORTAL DEBUG ===");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div className="bg-primary/10 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                <Dumbbell className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">FitClients Portal</h1>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-gray-500 hidden sm:block">Client Dashboard</p>
                  <Badge variant="secondary" className="text-xs">DEMO</Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <div className="text-right hidden md:block">
                <p className="font-semibold text-gray-900 text-sm">{demoClient.name}</p>
                <p className="text-xs text-gray-500">Welcome back!</p>
              </div>
              <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border-2 border-primary/20">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                  {demoClient.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-3 sm:p-4 lg:p-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5 h-auto p-1 bg-white shadow-sm border">
            <TabsTrigger value="overview" className="text-xs sm:text-sm py-2 px-1">Overview</TabsTrigger>
            <TabsTrigger value="workouts" className="text-xs sm:text-sm py-2 px-1">Workouts</TabsTrigger>
            <TabsTrigger value="progress" className="text-xs sm:text-sm py-2 px-1">Progress</TabsTrigger>
            <TabsTrigger value="payments" className="text-xs sm:text-sm py-2 px-1">Payments</TabsTrigger>
            <TabsTrigger value="business" className="text-xs sm:text-sm py-2 px-1">Business</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
              {/* Left Column - Sessions */}
              <div className="lg:col-span-2 space-y-4 lg:space-y-6">
                <Card className="shadow-sm border-0 bg-white">
                  <CardHeader className="pb-3 lg:pb-4">
                    <CardTitle className="flex items-center gap-2 text-base lg:text-lg">
                      <Calendar className="h-4 w-4 lg:h-5 lg:w-5 text-primary" />
                      Upcoming Sessions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-3 lg:px-6">
                    {upcomingSessions.length > 0 ? (
                      <div className="space-y-3">
                        {upcomingSessions.map((session) => (
                          <div key={session.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 lg:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                            <div className="flex items-center gap-3 lg:gap-4 mb-3 sm:mb-0">
                              <div className="bg-primary text-white p-2 lg:p-3 rounded-xl shadow-sm flex-shrink-0">
                                <Calendar className="h-4 w-4 lg:h-5 lg:w-5" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-semibold text-gray-900 text-sm lg:text-base truncate">
                                  {new Date(session.date).toLocaleDateString('en-US', { 
                                    weekday: 'short', 
                                    month: 'short', 
                                    day: 'numeric' 
                                  })}
                                </p>
                                <p className="text-xs lg:text-sm text-gray-600">{session.startTime} - {session.endTime}</p>
                                <p className="text-xs text-primary font-medium">{session.type}</p>
                              </div>
                            </div>
                            <div className="flex-shrink-0">
                              <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                                <XCircle className="h-4 w-4 mr-1" />
                                Cancel Session
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 lg:py-8">
                        <Calendar className="mx-auto h-10 w-10 lg:h-12 lg:w-12 text-gray-300" />
                        <p className="mt-2 text-gray-500 text-sm lg:text-base">No upcoming sessions</p>
                        <p className="text-xs lg:text-sm text-gray-400">Your trainer will schedule sessions for you</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Recent Sessions */}
              <div className="space-y-4 lg:space-y-6">
                <Card className="shadow-sm border-0 bg-white">
                  <CardHeader className="pb-3 lg:pb-4">
                    <CardTitle className="flex items-center gap-2 text-base lg:text-lg">
                      <Clock className="h-4 w-4 lg:h-5 lg:w-5 text-primary" />
                      Recent Sessions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-3 lg:px-6">
                    {pastSessions.length > 0 ? (
                      <div className="space-y-2 lg:space-y-3">
                        {pastSessions.slice(0, 5).map((session) => (
                          <div key={session.id} className="flex items-center justify-between p-2 lg:p-3 bg-gray-50 rounded-lg">
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-gray-900 text-sm lg:text-base truncate">
                                {new Date(session.date).toLocaleDateString()}
                              </p>
                              <p className="text-xs lg:text-sm text-gray-600 truncate">{session.type}</p>
                            </div>
                            <Badge 
                              variant={session.status === 'completed' ? 'default' : session.status === 'cancelled' ? 'destructive' : 'secondary'}
                              className="text-xs flex-shrink-0 ml-2"
                            >
                              {session.status}
                            </Badge>
                          </div>
                        ))}
                        {pastSessions.length > 5 && (
                          <p className="text-xs text-gray-500 text-center pt-2">
                            +{pastSessions.length - 5} more sessions
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-4 lg:py-6">
                        <Clock className="mx-auto h-6 w-6 lg:h-8 lg:w-8 text-gray-300" />
                        <p className="mt-2 text-gray-500 text-xs lg:text-sm">No past sessions</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Full Width Gamification Dashboard */}
            {demoGamificationData && (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 lg:p-6 border border-purple-100">
                <GamificationDashboard data={demoGamificationData} variant="summary" />
              </div>
            )}
          </TabsContent>

          <TabsContent value="workouts" className="mt-6">
            <Card className="shadow-sm border-0 bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Dumbbell className="h-5 w-5 text-primary" />
                  {demoWorkoutPlan.name}
                </CardTitle>
                <CardDescription className="text-gray-600">{demoWorkoutPlan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {demoWorkoutPlan.exercises.map((exercise, index) => (
                    <div key={index} className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                      <p className="font-semibold text-gray-900 mb-2">{exercise.name}</p>
                      <p className="text-sm text-gray-600 mb-2">
                        {exercise.sets} sets × {exercise.reps} reps
                        {exercise.weight && <span className="text-primary font-medium"> @ {exercise.weight}lbs</span>}
                      </p>
                      {exercise.notes && (
                        <p className="text-xs text-gray-500 bg-white/50 p-2 rounded border">
                          💡 {exercise.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="mt-6">
            <Card className="shadow-sm border-0 bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Progress History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {demoProgress.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="text-left text-gray-500 border-b">
                        <tr>
                          <th className="p-3 font-medium">Date</th>
                          <th className="p-3 font-medium">Weight (lbs)</th>
                          <th className="p-3 font-medium">Body Fat %</th>
                        </tr>
                      </thead>
                      <tbody>
                        {demoProgress.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((entry) => (
                          <tr key={entry.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="p-3 font-medium">{new Date(entry.date).toLocaleDateString()}</td>
                            <td className="p-3">{entry.weight}</td>
                            <td className="p-3">{entry.bodyFat}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <TrendingUp className="mx-auto h-12 w-12 text-gray-300" />
                    <p className="mt-2 text-gray-500">No progress data yet</p>
                    <p className="text-sm text-gray-400">Your trainer will log your progress here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="mt-6">
            <Card className="shadow-sm border-0 bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Payment History
                </CardTitle>
                <CardDescription>View all recorded payments</CardDescription>
              </CardHeader>
              <CardContent>
                {demoPayments.length > 0 ? (
                  <div className="space-y-4">
                    {demoPayments.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl ${payment.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                            {payment.status === 'completed' ? <CheckCircle className="h-5 w-5"/> : <DollarSign className="h-5 w-5" />}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">${payment.amount.toFixed(2)} - {payment.description}</p>
                            <p className="text-sm text-gray-600">
                              Paid on {new Date(payment.date).toLocaleDateString()} via {payment.method}
                            </p>
                          </div>
                        </div>
                        <Badge 
                          variant={payment.status === 'completed' ? 'default' : payment.status === 'pending' ? 'secondary' : 'destructive'}
                          className="bg-white border"
                        >
                          {payment.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <DollarSign className="mx-auto h-12 w-12 text-gray-300" />
                    <p className="mt-2 text-gray-500">No payment history</p>
                    <p className="text-sm text-gray-400">Payment records will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="business" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              <BusinessHours 
                operatingHours={demoTrainerProfile.operatingHours}
                trainerName={demoTrainerProfile.displayName}
              />
              
              <Card className="shadow-sm border-0 bg-white">
                <CardHeader className="pb-3 lg:pb-4">
                  <CardTitle className="flex items-center gap-2 text-base lg:text-lg">
                    <MessageCircle className="h-4 w-4 lg:h-5 lg:w-5 text-primary" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 lg:space-y-4 px-3 lg:px-6">
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <Label className="text-xs font-medium text-blue-700">Business Name</Label>
                    <p className="font-semibold text-blue-900 text-sm lg:text-base break-words">{demoTrainerProfile.businessName}</p>
                  </div>
                  
                  <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                    <Label className="text-xs font-medium text-green-700">Phone</Label>
                    <a 
                      href={`tel:${demoTrainerProfile.phone}`}
                      className="font-semibold text-green-900 text-sm lg:text-base hover:underline"
                    >
                      {demoTrainerProfile.phone}
                    </a>
                  </div>
                  
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                    <Label className="text-xs font-medium text-purple-700">Email</Label>
                    <a 
                      href={`mailto:${demoTrainerProfile.email}`}
                      className="font-semibold text-purple-900 text-sm lg:text-base hover:underline break-all"
                    >
                      {demoTrainerProfile.email}
                    </a>
                  </div>
                  
                  <div className="p-3 bg-orange-50 rounded-lg border border-orange-100">
                    <Label className="text-xs font-medium text-orange-700">Website</Label>
                    <a 
                      href={demoTrainerProfile.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-semibold text-orange-900 text-sm lg:text-base hover:underline break-all"
                    >
                      {demoTrainerProfile.website}
                    </a>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <Label className="text-xs font-medium text-gray-700">Address</Label>
                    <p className="font-semibold text-gray-900 text-sm lg:text-base">{demoTrainerProfile.address}</p>
                  </div>
                  
                  <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                    <Label className="text-xs font-medium text-indigo-700">About</Label>
                    <p className="text-xs lg:text-sm text-indigo-900">{demoTrainerProfile.bio}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Social Media Section - Full Width */}
            <Card className="shadow-sm border-0 bg-white mt-4 lg:mt-6">
              <CardHeader className="pb-3 lg:pb-4">
                <CardTitle className="flex items-center gap-2 text-base lg:text-lg">
                  <Star className="h-4 w-4 lg:h-5 lg:w-5 text-primary" />
                  Follow {demoTrainerProfile.displayName}
                </CardTitle>
                <CardDescription className="text-xs lg:text-sm">
                  Stay connected and get fitness tips, motivation, and updates
                </CardDescription>
              </CardHeader>
              <CardContent className="px-3 lg:px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                  <a
                    href={`https://instagram.com/${demoTrainerProfile.socialMedia.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 lg:p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border border-pink-100 hover:shadow-md transition-shadow active:scale-95"
                  >
                    <Instagram className="h-5 w-5 lg:h-6 lg:w-6 text-pink-600 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-pink-900 text-sm lg:text-base">Instagram</p>
                      <p className="text-xs lg:text-sm text-pink-700 truncate">{demoTrainerProfile.socialMedia.instagram}</p>
                    </div>
                  </a>

                  <a
                    href={`https://facebook.com/${demoTrainerProfile.socialMedia.facebook}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 lg:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 hover:shadow-md transition-shadow active:scale-95"
                  >
                    <Facebook className="h-5 w-5 lg:h-6 lg:w-6 text-blue-600 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-blue-900 text-sm lg:text-base">Facebook</p>
                      <p className="text-xs lg:text-sm text-blue-700">Visit Page</p>
                    </div>
                  </a>

                  <a
                    href={`https://youtube.com/${demoTrainerProfile.socialMedia.youtube}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 lg:p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-100 hover:shadow-md transition-shadow active:scale-95"
                  >
                    <Youtube className="h-5 w-5 lg:h-6 lg:w-6 text-red-600 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-red-900 text-sm lg:text-base">YouTube</p>
                      <p className="text-xs lg:text-sm text-red-700">Watch Videos</p>
                    </div>
                  </a>

                  <a
                    href={`https://tiktok.com/@${demoTrainerProfile.socialMedia.tiktok.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 lg:p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-100 hover:shadow-md transition-shadow active:scale-95"
                  >
                    <div className="h-5 w-5 lg:h-6 lg:w-6 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">T</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900 text-sm lg:text-base">TikTok</p>
                      <p className="text-xs lg:text-sm text-gray-700 truncate">{demoTrainerProfile.socialMedia.tiktok}</p>
                    </div>
                  </a>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      {/* PWA Install Prompt */}
      <InstallPrompt />
    </div>
  );
};

export default DemoPortal; 