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
  MessageCircle,
  HelpCircle,
  Instagram,
  Facebook,
  Youtube,
  Settings as SettingsIcon,
  Smartphone,
  Mail,
  Globe,
  MapPin,
} from "lucide-react";
import { GamificationDashboard } from "@/components/GamificationDashboard";
import { BusinessHours } from "@/components/BusinessHours";
import { InstallPrompt } from "@/components/InstallPrompt";
import { useData } from "@/contexts/DataContext";
import { calculateGamificationData } from "@/lib/gamification";
import { Client, Session, Payment, WorkoutPlan, ProgressEntry, UserProfile } from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { userProfileService } from "@/lib/firebaseService";
import { useToast } from "@/hooks/use-toast";

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
      // Validation error - will be handled by parent component
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
  const { isDemoUser, user } = useAuth();
  const { toast } = useToast();
  const [trainerProfile, setTrainerProfile] = useState<UserProfile | null>(null);

  // Check if we're on the demo portal route (public access)
  const isDemoPortalRoute = window.location.pathname === '/demo-portal';
  const isDemoAccess = isDemoUser || isDemoPortalRoute;

  // For demo users or demo portal route, use the first available client if no specific clientId is provided
  const effectiveClientId = isDemoAccess && (!clientId || clientId === 'demo') 
    ? (clients.length > 0 ? clients[0].id : null) 
    : clientId;

  // Get client and related data directly from context
  const client = clients.find((c) => c.id === effectiveClientId);

  const clientSessions = sessions.filter((s) => s.clientId === effectiveClientId);
  const clientPayments = payments.filter((p) => p.clientId === effectiveClientId);
  const clientWorkoutPlan = workoutPlans.find((wp) => wp.clientId === effectiveClientId);
  const clientProgress = progressEntries.filter(pe => pe.clientId === effectiveClientId);

  const upcomingSessions = clientSessions.filter(s => new Date(s.date) >= new Date() && s.status === 'scheduled').sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const pastSessions = clientSessions.filter(s => new Date(s.date) < new Date() || s.status !== 'scheduled').sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const gamificationData = client ? calculateGamificationData(client, clientSessions, clientPayments) : null;

  // Fetch trainer profile for operating hours
  useEffect(() => {
    const fetchTrainerProfile = async () => {
      if (user?.uid) {
        try {
          const profile = await userProfileService.getUserProfile(user.uid);
          
          setTrainerProfile(profile);
        } catch (error) {
          // Error fetching trainer profile
        }
      }
    };

    fetchTrainerProfile();
  }, [user?.uid]);

  const handleCancelSession = async (sessionId: string, reason: string) => {
    try {
      await updateSession(sessionId, {
          status: "cancelled",
          cancellationReason: reason,
          cancelledAt: new Date().toISOString(),
          cancelledBy: "client",
      });
    } catch (err) {
              // Failed to cancel session
              toast({
          title: "Cancellation Failed",
          description: "There was an error cancelling the session.",
          variant: "destructive",
        });
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
                <p className="text-xs text-gray-500 hidden sm:block">Client Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <div className="text-right hidden md:block">
                <p className="font-semibold text-gray-900 text-sm">{client.name}</p>
                <p className="text-xs text-gray-500">Welcome back!</p>
              </div>
              <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border-2 border-primary/20">
                <AvatarImage src={client.avatar} alt={client.name} />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                  {client.name.split(" ").map(n => n[0]).join("")}
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
                          <CancelSessionDialog session={session} onCancel={handleCancelSession} />
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
            {gamificationData && (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 lg:p-6 border border-purple-100">
                <GamificationDashboard data={gamificationData} variant="summary" />
              </div>
            )}
          </TabsContent>

          <TabsContent value="workouts" className="mt-6">
            {clientWorkoutPlan ? (
              <Card className="shadow-sm border-0 bg-white">
              <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Dumbbell className="h-5 w-5 text-primary" />
                    {clientWorkoutPlan.name}
                  </CardTitle>
                  <CardDescription className="text-gray-600">{clientWorkoutPlan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {clientWorkoutPlan.exercises.map((exercise, index) => (
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
            ) : (
              <Card className="shadow-sm border-0 bg-white">
                <CardContent className="pt-6 text-center">
                  <Dumbbell className="mx-auto h-12 w-12 text-gray-300" />
                  <p className="mt-2 text-gray-500">No workout plan assigned</p>
                  <p className="text-sm text-gray-400">Your trainer will create a personalized plan for you</p>
                </CardContent>
              </Card>
            )}
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
                   {clientProgress.length > 0 ? (
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
                          {clientProgress.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((entry) => (
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
                {clientPayments.length > 0 ? (
                  <div className="space-y-4">
                    {clientPayments.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((payment) => (
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

          <TabsContent value="business" className="mt-4 sm:mt-6">
            <div className="space-y-4 sm:space-y-6">
              {/* Business Information Hero Section */}
              {trainerProfile?.businessName && (
                <Card className="border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg">
                  <CardHeader className="text-center pb-3 sm:pb-4 px-4 sm:px-6">
                    <CardTitle className="flex items-center justify-center gap-2 text-blue-800 text-lg sm:text-xl">
                      <SettingsIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                      {trainerProfile.businessName}
                    </CardTitle>
                    {trainerProfile?.bio && (
                      <CardDescription className="text-blue-700 max-w-2xl mx-auto text-sm sm:text-base">
                        {trainerProfile.bio}
                      </CardDescription>
                    )}
                  </CardHeader>
                </Card>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Operating Hours */}
                <BusinessHours 
                  operatingHours={trainerProfile?.operatingHours}
                  trainerName={trainerProfile?.displayName || "Your Trainer"}
                />
                
                {/* Contact Information */}
                <Card className="border-2 border-green-100 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg">
                  <CardHeader className="px-4 sm:px-6 pb-3 sm:pb-4">
                    <CardTitle className="flex items-center gap-2 text-green-800 text-base sm:text-lg">
                      <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                      Contact Information
                    </CardTitle>
                    <CardDescription className="text-green-700 text-sm">
                      Get in touch with your trainer
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6">
                    {trainerProfile?.phone && (
                      <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white/60 rounded-lg border border-green-200 hover:bg-white/80 transition-colors">
                        <div className="p-1.5 sm:p-2 bg-green-100 rounded-full flex-shrink-0">
                          <Smartphone className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Label className="text-xs font-medium text-green-700">Phone</Label>
                          <a 
                            href={`tel:${trainerProfile.phone}`}
                            className="font-semibold text-green-900 text-xs sm:text-sm hover:underline block break-all"
                          >
                            {trainerProfile.phone}
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {(trainerProfile?.email || user?.email) && (
                      <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white/60 rounded-lg border border-green-200 hover:bg-white/80 transition-colors">
                        <div className="p-1.5 sm:p-2 bg-green-100 rounded-full flex-shrink-0">
                          <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Label className="text-xs font-medium text-green-700">Email</Label>
                          <a 
                            href={`mailto:${trainerProfile?.email || user?.email}`}
                            className="font-semibold text-green-900 text-xs sm:text-sm hover:underline break-all block"
                          >
                            {trainerProfile?.email || user?.email}
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {trainerProfile?.website && (
                      <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white/60 rounded-lg border border-green-200 hover:bg-white/80 transition-colors">
                        <div className="p-1.5 sm:p-2 bg-green-100 rounded-full flex-shrink-0">
                          <Globe className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Label className="text-xs font-medium text-green-700">Website</Label>
                          <a 
                            href={trainerProfile.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="font-semibold text-green-900 text-xs sm:text-sm hover:underline break-all"
                          >
                            {trainerProfile.website}
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {trainerProfile?.address && (
                      <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white/60 rounded-lg border border-green-200 hover:bg-white/80 transition-colors">
                        <div className="p-1.5 sm:p-2 bg-green-100 rounded-full flex-shrink-0">
                          <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Label className="text-xs font-medium text-green-700">Address</Label>
                          <p className="font-semibold text-green-900 text-xs sm:text-sm">{trainerProfile.address}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Social Media Section */}
              {trainerProfile?.socialMedia && (
                Object.values(trainerProfile.socialMedia).some(value => value && value.trim() !== "")
              ) && (
                <Card className="border-2 border-purple-100 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg">
                  <CardHeader className="text-center px-4 sm:px-6 pb-3 sm:pb-4">
                    <CardTitle className="flex items-center justify-center gap-2 text-purple-800 text-base sm:text-lg">
                      <Star className="h-4 w-4 sm:h-5 sm:w-5" />
                      Follow {trainerProfile?.displayName || "Your Trainer"}
                    </CardTitle>
                    <CardDescription className="text-purple-700 text-sm">
                      Stay connected and get fitness tips, motivation, and updates
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-4 sm:px-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                      {trainerProfile.socialMedia.instagram && (
                        <a
                          href={`https://instagram.com/${trainerProfile.socialMedia.instagram.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center gap-2 sm:gap-4 p-3 sm:p-4 bg-white/60 rounded-xl border border-purple-200 hover:bg-white/80 hover:shadow-lg transition-all duration-200 hover:scale-105"
                        >
                          <div className="p-2 sm:p-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex-shrink-0">
                            <Instagram className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-purple-900 text-sm">Instagram</p>
                            <p className="text-xs sm:text-sm text-purple-700 truncate">{trainerProfile.socialMedia.instagram}</p>
                          </div>
                        </a>
                      )}

                      {trainerProfile.socialMedia.facebook && (
                        <a
                          href={trainerProfile.socialMedia.facebook.startsWith('http') 
                            ? trainerProfile.socialMedia.facebook 
                            : `https://facebook.com/${trainerProfile.socialMedia.facebook}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center gap-2 sm:gap-4 p-3 sm:p-4 bg-white/60 rounded-xl border border-purple-200 hover:bg-white/80 hover:shadow-lg transition-all duration-200 hover:scale-105"
                        >
                          <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex-shrink-0">
                            <Facebook className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-purple-900 text-sm">Facebook</p>
                            <p className="text-xs sm:text-sm text-purple-700">Visit Page</p>
                          </div>
                        </a>
                      )}

                      {trainerProfile.socialMedia.youtube && (
                        <a
                          href={trainerProfile.socialMedia.youtube.startsWith('http') 
                            ? trainerProfile.socialMedia.youtube 
                            : `https://youtube.com/${trainerProfile.socialMedia.youtube}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center gap-2 sm:gap-4 p-3 sm:p-4 bg-white/60 rounded-xl border border-purple-200 hover:bg-white/80 hover:shadow-lg transition-all duration-200 hover:scale-105"
                        >
                          <div className="p-2 sm:p-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex-shrink-0">
                            <Youtube className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-purple-900 text-sm">YouTube</p>
                            <p className="text-xs sm:text-sm text-purple-700">Watch Videos</p>
                          </div>
                        </a>
                      )}

                      {trainerProfile.socialMedia.tiktok && (
                        <a
                          href={`https://tiktok.com/@${trainerProfile.socialMedia.tiktok.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center gap-2 sm:gap-4 p-3 sm:p-4 bg-white/60 rounded-xl border border-purple-200 hover:bg-white/80 hover:shadow-lg transition-all duration-200 hover:scale-105"
                        >
                          <div className="p-2 sm:p-3 bg-black rounded-full flex-shrink-0">
                            <span className="text-white text-xs sm:text-sm font-bold">T</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-purple-900 text-sm">TikTok</p>
                            <p className="text-xs sm:text-sm text-purple-700 truncate">{trainerProfile.socialMedia.tiktok}</p>
                          </div>
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      {/* PWA Install Prompt */}
      <InstallPrompt />
    </div>
  );
};

export default ClientPortal;
