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
} from "lucide-react";

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
        },
        {
          id: "2",
          date: "2024-03-20",
          startTime: "09:00",
          endTime: "10:00",
          type: "Personal Training",
          location: "FitGym Downtown",
          notes: "Cardio and core work",
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
  };

  return clientData[clientId as keyof typeof clientData] || null;
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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="workout">Workout</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
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
                      <div>
                        <p className="font-medium">{session.type}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(session.date).toLocaleDateString()} at{" "}
                          {session.startTime}
                        </p>
                      </div>
                      <Badge variant="outline">Scheduled</Badge>
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
                <CardTitle>Your Upcoming Sessions</CardTitle>
                <CardDescription>
                  All your scheduled training sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingSessions.map((session: any) => (
                    <Card key={session.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h4 className="font-semibold">{session.type}</h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(session.date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {session.startTime} - {session.endTime}
                            </div>
                          </div>
                          <p className="text-sm">📍 {session.location}</p>
                        </div>
                        <Badge>Scheduled</Badge>
                      </div>
                      {session.notes && (
                        <div className="mt-3 p-3 bg-muted rounded-lg">
                          <p className="text-sm">
                            <strong>Notes:</strong> {session.notes}
                          </p>
                        </div>
                      )}
                    </Card>
                  ))}
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
