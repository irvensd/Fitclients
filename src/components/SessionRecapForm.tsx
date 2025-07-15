import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sparkles,
  FileText,
  Clock,
  CheckCircle,
  Share2,
  Copy,
  Mail,
  MessageSquare,
  Loader2,
  Star,
  TrendingUp,
} from "lucide-react";
import { Session, Client, SessionRecap } from "@/lib/types";
import {
  generateSessionRecap,
  generateClientSummary,
} from "@/lib/sessionRecapAI";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { SUBSCRIPTION_PLANS } from "@/lib/stripe";

interface SessionRecapFormProps {
  session: Session;
  client: Client;
  onRecapGenerated: (recap: SessionRecap) => void;
}

export const SessionRecapForm = ({
  session,
  client,
  onRecapGenerated,
}: SessionRecapFormProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"form" | "generating" | "result">("form");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Check if user has Pro or Lifetime plan
  const hasProAccess = user?.email === "trainer@demo.com" || user?.email?.includes("pro");
  const [formData, setFormData] = useState({
    workoutFocus: "",
    exercisesCompleted: [] as string[],
    clientPerformance: "" as any,
    clientMood: "" as any,
    achievementsToday: "",
    challengesFaced: "",
    notesForNextSession: "",
    progressObservations: "",
  });
  const [newExercise, setNewExercise] = useState("");
  const [generatedRecap, setGeneratedRecap] = useState<SessionRecap | null>(
    null,
  );
  const [isSharing, setIsSharing] = useState(false);

  const handleAddExercise = () => {
    if (newExercise.trim()) {
      setFormData({
        ...formData,
        exercisesCompleted: [
          ...formData.exercisesCompleted,
          newExercise.trim(),
        ],
      });
      setNewExercise("");
    }
  };

  const removeExercise = (index: number) => {
    setFormData({
      ...formData,
      exercisesCompleted: formData.exercisesCompleted.filter(
        (_, i) => i !== index,
      ),
    });
  };

  const handleGenerateRecap = async () => {
    // Check if user has Pro access
    if (!hasProAccess) {
      setShowUpgradeModal(true);
      return;
    }

    setStep("generating");

    try {
      const aiContent = await generateSessionRecap(
        formData,
        client,
        session.type,
      );

      const recap: SessionRecap = {
        id: `recap-${Date.now()}`,
        sessionId: session.id,
        clientId: client.id,
        createdAt: new Date().toISOString(),
        trainerForm: formData,
        aiGeneratedContent: aiContent,
        sharedWithClient: false,
        clientViewed: false,
      };

      setGeneratedRecap(recap);
      setStep("result");
      onRecapGenerated(recap);
    } catch (error) {
      console.error("Error generating recap:", error);
      setStep("form");
    }
  };

  const handleShareWithClient = async (method: "email" | "copy" | "sms") => {
    if (!generatedRecap) return;

    setIsSharing(true);
    const clientSummary = generateClientSummary(
      generatedRecap.aiGeneratedContent,
      client.name,
    );

    try {
      if (method === "email") {
        const subject = `Your Workout Recap - ${new Date(session.date).toLocaleDateString()}`;
        const body = clientSummary;
        window.open(
          `mailto:${client.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
        );
      } else if (method === "copy") {
        await navigator.clipboard.writeText(clientSummary);
        toast({
          title: "Recap Copied",
          description: "Recap copied to clipboard!",
        });
      } else if (method === "sms") {
        // In real app, this would integrate with SMS service
        toast({
          title: "SMS Integration",
          description: "SMS integration would send: " + clientSummary.substring(0, 100) + "...",
        });
      }

      // Mark as shared
      setGeneratedRecap({
        ...generatedRecap,
        sharedWithClient: true,
      });
    } catch (error) {
      console.error("Error sharing recap:", error);
    } finally {
      setIsSharing(false);
    }
  };

  const resetForm = () => {
    setStep("form");
    setFormData({
      workoutFocus: "",
      exercisesCompleted: [],
      clientPerformance: "",
      clientMood: "",
      achievementsToday: "",
      challengesFaced: "",
      notesForNextSession: "",
      progressObservations: "",
    });
    setGeneratedRecap(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Create AI Recap
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-purple-600" />
            AI Session Recap for {client.name}
          </DialogTitle>
          <DialogDescription>
            Quick session details → Personalized AI-generated recap for your
            client
          </DialogDescription>
        </DialogHeader>

        {step === "form" && (
          <div className="space-y-6 py-4">
            {/* Workout Focus */}
            <div className="space-y-2">
              <Label htmlFor="workout-focus">Today's Workout Focus</Label>
              <Input
                id="workout-focus"
                placeholder="e.g., Upper body strength, Cardio endurance, Core stability..."
                value={formData.workoutFocus}
                onChange={(e) =>
                  setFormData({ ...formData, workoutFocus: e.target.value })
                }
              />
            </div>

            {/* Exercises Completed */}
            <div className="space-y-2">
              <Label>Exercises Completed</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add exercise (e.g., Squats, Push-ups, Deadlifts...)"
                  value={newExercise}
                  onChange={(e) => setNewExercise(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddExercise()}
                />
                <Button
                  type="button"
                  onClick={handleAddExercise}
                  variant="outline"
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.exercisesCompleted.map((exercise, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => removeExercise(index)}
                  >
                    {exercise} ×
                  </Badge>
                ))}
              </div>
            </div>

            {/* Performance and Mood */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Client Performance</Label>
                <Select
                  value={formData.clientPerformance}
                  onValueChange={(value) =>
                    setFormData({ ...formData, clientPerformance: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Rate performance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excellent">🌟 Excellent</SelectItem>
                    <SelectItem value="good">👍 Good</SelectItem>
                    <SelectItem value="average">👌 Average</SelectItem>
                    <SelectItem value="needs-improvement">
                      📈 Needs Improvement
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Client Mood/Energy</Label>
                <Select
                  value={formData.clientMood}
                  onValueChange={(value) =>
                    setFormData({ ...formData, clientMood: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select mood" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="energetic">⚡ Energetic</SelectItem>
                    <SelectItem value="motivated">💪 Motivated</SelectItem>
                    <SelectItem value="neutral">😐 Neutral</SelectItem>
                    <SelectItem value="tired">😴 Tired</SelectItem>
                    <SelectItem value="stressed">😰 Stressed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Achievements and Challenges */}
            <div className="space-y-2">
              <Label htmlFor="achievements">Key Achievements Today</Label>
              <Input
                id="achievements"
                placeholder="e.g., First unassisted pull-up, Increased squat weight, Improved form..."
                value={formData.achievementsToday}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    achievementsToday: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="challenges">Challenges Faced (Optional)</Label>
              <Input
                id="challenges"
                placeholder="e.g., Struggled with balance, Knee discomfort, Form issues..."
                value={formData.challengesFaced}
                onChange={(e) =>
                  setFormData({ ...formData, challengesFaced: e.target.value })
                }
              />
            </div>

            {/* Notes and Observations */}
            <div className="space-y-2">
              <Label htmlFor="next-session">Notes for Next Session</Label>
              <Textarea
                id="next-session"
                placeholder="What to focus on next time..."
                value={formData.notesForNextSession}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    notesForNextSession: e.target.value,
                  })
                }
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="progress">Progress Observations</Label>
              <Textarea
                id="progress"
                placeholder="Any improvements in strength, form, endurance, confidence..."
                value={formData.progressObservations}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    progressObservations: e.target.value,
                  })
                }
                className="min-h-[60px]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleGenerateRecap}
                disabled={
                  !formData.workoutFocus ||
                  !formData.clientPerformance ||
                  formData.exercisesCompleted.length === 0
                }
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Generate AI Recap
              </Button>
            </div>
          </div>
        )}

        {step === "generating" && (
          <div className="py-12 text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-purple-600" />
            <h3 className="text-lg font-medium mb-2">
              AI is crafting your personalized recap...
            </h3>
            <p className="text-muted-foreground">
              Analyzing workout data and generating encouragement for{" "}
              {client.name}
            </p>
          </div>
        )}

        {step === "result" && generatedRecap && (
          <div className="space-y-6 py-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  AI-Generated Session Recap
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">📝 Workout Summary</h4>
                  <p className="text-sm bg-muted p-3 rounded-lg">
                    {generatedRecap.aiGeneratedContent.workoutSummary}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">
                    💪 Personal Encouragement
                  </h4>
                  <p className="text-sm bg-green-50 border border-green-200 p-3 rounded-lg">
                    {
                      generatedRecap.aiGeneratedContent
                        .personalizedEncouragement
                    }
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">🎯 Next Steps</h4>
                  <p className="text-sm bg-blue-50 border border-blue-200 p-3 rounded-lg">
                    {generatedRecap.aiGeneratedContent.nextStepsRecommendations}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">🏆 Key Achievements</h4>
                  <ul className="text-sm space-y-1">
                    {generatedRecap.aiGeneratedContent.keyAchievements.map(
                      (achievement, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          {achievement}
                        </li>
                      ),
                    )}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">✨ Motivational Quote</h4>
                  <p className="text-sm italic bg-purple-50 border border-purple-200 p-3 rounded-lg">
                    {generatedRecap.aiGeneratedContent.motivationalQuote}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Sharing Options */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="h-5 w-5" />
                  Share with {client.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-4">
                  <Button
                    onClick={() => handleShareWithClient("email")}
                    disabled={isSharing}
                    variant="outline"
                    className="flex-1"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                  <Button
                    onClick={() => handleShareWithClient("copy")}
                    disabled={isSharing}
                    variant="outline"
                    className="flex-1"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Text
                  </Button>
                  <Button
                    onClick={() => handleShareWithClient("sms")}
                    disabled={isSharing}
                    variant="outline"
                    className="flex-1"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    SMS
                  </Button>
                </div>
                {generatedRecap.sharedWithClient && (
                  <div className="text-sm text-green-600 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Shared with client successfully!
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={resetForm}>
                Create Another
              </Button>
              <Button onClick={() => setOpen(false)}>Done</Button>
            </div>
          </div>
        )}
      </DialogContent>
      
      {/* Upgrade Modal */}
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              Upgrade to Pro
            </DialogTitle>
            <DialogDescription>
              AI-powered session recaps are available exclusively for Pro and Lifetime plan subscribers.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">What you'll get with Pro:</h4>
              <ul className="space-y-1 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  AI-powered session recaps
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Unlimited clients
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Advanced analytics & insights
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Priority support
                </li>
              </ul>
            </div>
            
            <div className="flex gap-2">
              <Button 
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                onClick={() => {
                  setShowUpgradeModal(false);
                  // In a real app, this would redirect to billing/upgrade page
                  window.location.href = "/billing";
                }}
              >
                Upgrade to Pro - $19/month
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowUpgradeModal(false)}
              >
                Maybe Later
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};
