import { useState } from "react";
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
import { Client, Session, Payment, WorkoutPlan, ProgressEntry } from "@/lib/types";

const CancelSessionDialog = ({
  session,
  onCancel,
}: {
  session: Session;
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
    await onCancel(session.id, reason);
    setIsSubmitting(false);
    setOpen(false);
    setReason("");
  };

  const isWithin24Hours = () => {
    if (!session.date || !session.startTime) return false;
    const sessionDateTime = new Date(`${session.date}T${session.startTime}`);
    const now = new Date();
    return (sessionDateTime.getTime() - now.getTime()) / (1000 * 60 * 60) <= 24;
  };

  if (!session.date || !session.startTime) return null;

  const sessionDateTime = new Date(`${session.date}T${session.startTime}`);
  if (sessionDateTime < new Date() || session.status === "cancelled") {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
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
            Cancel your {session.type} session on {new Date(session.date).toLocaleDateString()} at {session.startTime}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {isWithin24Hours() && (
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-orange-800">Late Cancellation Notice</p>
                  <p className="text-orange-700 mt-1">
                    This session is within 24 hours. Cancellation policies may apply.
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
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
            Keep Session
          </Button>
          <Button variant="destructive" onClick={handleCancel} disabled={isSubmitting || !reason.trim()}>
            {isSubmitting ? "Cancelling..." : "Cancel Session"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ClientPortal = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const {
    clients,
    sessions,
    payments,
    workoutPlans,
    progressEntries,
    loading: dataLoading,
    error,
    dataInitialized,
    updateSession,
  } = useData();

  // Get client and related data directly from context
  const client = clients.find((c) => c.id === clientId);
  const clientSessions = sessions.filter((s) => s.clientId === clientId);
  const clientPayments = payments.filter((p) => p.clientId === clientId);
  const clientWorkoutPlan = workoutPlans.find((wp) => wp.clientId === clientId);
  const clientProgress = progressEntries.filter(pe => pe.clientId === clientId);

  const upcomingSessions = clientSessions.filter(s => new Date(s.date) >= new Date() && s.status === 'scheduled').sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const pastSessions = clientSessions.filter(s => new Date(s.date) < new Date() || s.status !== 'scheduled').sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const gamificationData = client ? calculateGamificationData(client, clientSessions, clientPayments) : null;

  const handleCancelSession = async (sessionId: string, reason: string) => {
    try {
      await updateSession(sessionId, {
        status: "cancelled",
        cancellationReason: reason,
        cancelledAt: new Date().toISOString(),
        cancelledBy: "client",
      });
    } catch (err) {
      console.error("Failed to cancel session:", err);
      alert("There was an error cancelling the session.");
    }
  };

  if (dataLoading || !dataInitialized) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen"><p className="text-red-500">Error: {error}</p></div>;
  }

  if (!client) {
    return <div className="flex justify-center items-center min-h-screen"><p>Client Portal not found.</p></div>;
  }
  
  return (
    <div className="min-h-screen bg-muted/40">
      <header className="bg-background border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <Dumbbell className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">FitClients Portal</h1>
            </div>
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={client.avatar} alt={client.name} />
                <AvatarFallback>{client.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{client.name}</p>
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
                          <CancelSessionDialog session={session} onCancel={handleCancelSession} />
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">No upcoming sessions.</p>
                  )}
                </CardContent>
              </Card>

              {gamificationData && <GamificationDashboard data={gamificationData} variant="summary" />}
              
              <Card>
                 <CardHeader>
                  <CardTitle>Session History</CardTitle>
                </CardHeader>
                <CardContent>
                  {pastSessions.length > 0 ? (
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
                                <Badge variant={session.status === 'completed' ? 'default' : session.status === 'cancelled' ? 'destructive' : 'secondary'}>
                                  {session.status}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No past sessions.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="workouts" className="mt-6">
            {clientWorkoutPlan ? (
              <Card>
                <CardHeader>
                  <CardTitle>{clientWorkoutPlan.name}</CardTitle>
                  <CardDescription>{clientWorkoutPlan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {clientWorkoutPlan.exercises.map((exercise, index) => (
                      <li key={index} className="p-3 bg-muted rounded-lg">
                        <p className="font-semibold">{exercise.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {exercise.sets} sets of {exercise.reps} {exercise.weight ? ` at ${exercise.weight}lbs` : ""}
                        </p>
                        {exercise.notes && <p className="text-xs mt-1">Notes: {exercise.notes}</p>}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ) : (
              <Card><CardContent className="pt-6"><p>No workout plan assigned.</p></CardContent></Card>
            )}
          </TabsContent>

          <TabsContent value="progress" className="mt-6">
             <Card>
                <CardHeader>
                  <CardTitle>Progress History</CardTitle>
                </CardHeader>
                <CardContent>
                   {clientProgress.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="text-left text-muted-foreground">
                          <tr>
                            <th className="p-2">Date</th>
                            <th className="p-2">Weight (lbs)</th>
                            <th className="p-2">Body Fat %</th>
                          </tr>
                        </thead>
                        <tbody>
                          {clientProgress.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((entry) => (
                            <tr key={entry.id} className="border-t">
                              <td className="p-2">{new Date(entry.date).toLocaleDateString()}</td>
                              <td className="p-2">{entry.weight}</td>
                              <td className="p-2">{entry.bodyFat}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No progress has been logged yet.</p>
                  )}
                </CardContent>
              </Card>
          </TabsContent>

          <TabsContent value="payments" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>View all recorded payments.</CardDescription>
              </CardHeader>
              <CardContent>
                {clientPayments.length > 0 ? (
                  <ul className="space-y-4">
                    {clientPayments.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((payment) => (
                      <li key={payment.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-full ${payment.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                            {payment.status === 'completed' ? <CheckCircle className="h-5 w-5"/> : <DollarSign className="h-5 w-5" />}
                          </div>
                          <div>
                            <p className="font-semibold">${payment.amount.toFixed(2)} - {payment.description}</p>
                            <p className="text-sm text-muted-foreground">
                              Paid on {new Date(payment.date).toLocaleDateString()} via {payment.method}
                            </p>
                          </div>
                        </div>
                        <Badge variant={payment.status === 'completed' ? 'default' : payment.status === 'pending' ? 'secondary' : 'destructive'}>
                          {payment.status}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-12">
                    <DollarSign className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No payment history</h3>
                    <p className="mt-1 text-sm text-muted-foreground">No payments have been recorded for this client yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ClientPortal;
