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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Share2,
  Eye,
  EyeOff,
  Calendar,
  Clock,
  User,
  CheckCircle,
  Mail,
  Copy,
  MessageSquare,
  Star,
  TrendingUp,
  Target,
} from "lucide-react";
import { SessionRecap, Client } from "@/lib/types";
import { generateClientSummary } from "@/lib/sessionRecapAI";

interface SessionRecapViewerProps {
  recap: SessionRecap;
  client: Client;
  sessionDate: string;
  onUpdateRecap?: (recap: SessionRecap) => void;
}

export const SessionRecapViewer = ({
  recap,
  client,
  sessionDate,
  onUpdateRecap,
}: SessionRecapViewerProps) => {
  const [open, setOpen] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async (method: "email" | "copy" | "sms") => {
    setIsSharing(true);
    const clientSummary = generateClientSummary(
      recap.aiGeneratedContent,
      client.name,
    );

    try {
      if (method === "email") {
        const subject = `Your Workout Recap - ${new Date(sessionDate).toLocaleDateString()}`;
        window.open(
          `mailto:${client.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(clientSummary)}`,
        );
      } else if (method === "copy") {
        await navigator.clipboard.writeText(clientSummary);
        alert("Recap copied to clipboard!");
      } else if (method === "sms") {
        alert(
          "SMS integration would send: " +
            clientSummary.substring(0, 100) +
            "...",
        );
      }

      // Update shared status
      if (onUpdateRecap) {
        onUpdateRecap({
          ...recap,
          sharedWithClient: true,
        });
      }
    } catch (error) {
      console.error("Error sharing recap:", error);
    } finally {
      setIsSharing(false);
    }
  };

  const getPerformanceIcon = (performance: string) => {
    switch (performance) {
      case "excellent":
        return "🌟";
      case "good":
        return "👍";
      case "average":
        return "👌";
      case "needs-improvement":
        return "📈";
      default:
        return "💪";
    }
  };

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case "energetic":
        return "⚡";
      case "motivated":
        return "💪";
      case "neutral":
        return "😐";
      case "tired":
        return "😴";
      case "stressed":
        return "😰";
      default:
        return "😊";
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <FileText className="h-4 w-4 mr-2" />
          View Recap
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-600" />
            Session Recap - {client.name}
          </DialogTitle>
          <DialogDescription>
            {new Date(sessionDate).toLocaleDateString()} •{" "}
            {recap.sharedWithClient ? "Shared with client" : "Not shared yet"}
            {recap.clientViewed && " • Viewed by client"}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="ai-recap" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="ai-recap">AI Recap</TabsTrigger>
            <TabsTrigger value="trainer-notes">Trainer Notes</TabsTrigger>
            <TabsTrigger value="share">Share</TabsTrigger>
          </TabsList>

          <TabsContent value="ai-recap" className="space-y-4">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">📝 Workout Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed">
                    {recap.aiGeneratedContent.workoutSummary}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    💪 Personal Encouragement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed bg-green-50 border border-green-200 p-4 rounded-lg">
                    {recap.aiGeneratedContent.personalizedEncouragement}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">🎯 Next Steps</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed bg-blue-50 border border-blue-200 p-4 rounded-lg">
                    {recap.aiGeneratedContent.nextStepsRecommendations}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">🏆 Key Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {recap.aiGeneratedContent.keyAchievements.map(
                      (achievement, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">{achievement}</span>
                        </li>
                      ),
                    )}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    💫 Progress Highlight
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed bg-purple-50 border border-purple-200 p-4 rounded-lg">
                    {recap.aiGeneratedContent.progressHighlight}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    ✨ Motivational Quote
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm italic leading-relaxed bg-gray-50 border border-gray-200 p-4 rounded-lg">
                    {recap.aiGeneratedContent.motivationalQuote}
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trainer-notes" className="space-y-4">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Session Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Workout Focus</h4>
                    <p className="text-sm bg-muted p-3 rounded">
                      {recap.trainerForm.workoutFocus}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Exercises Completed</h4>
                    <div className="flex flex-wrap gap-2">
                      {recap.trainerForm.exercisesCompleted.map(
                        (exercise, index) => (
                          <Badge key={index} variant="secondary">
                            {exercise}
                          </Badge>
                        ),
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Performance</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {getPerformanceIcon(
                            recap.trainerForm.clientPerformance,
                          )}
                        </span>
                        <span className="text-sm capitalize">
                          {recap.trainerForm.clientPerformance.replace(
                            "-",
                            " ",
                          )}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Mood/Energy</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {getMoodIcon(recap.trainerForm.clientMood)}
                        </span>
                        <span className="text-sm capitalize">
                          {recap.trainerForm.clientMood}
                        </span>
                      </div>
                    </div>
                  </div>

                  {recap.trainerForm.achievementsToday && (
                    <div>
                      <h4 className="font-medium mb-2">Achievements</h4>
                      <p className="text-sm bg-green-50 border border-green-200 p-3 rounded">
                        {recap.trainerForm.achievementsToday}
                      </p>
                    </div>
                  )}

                  {recap.trainerForm.challengesFaced && (
                    <div>
                      <h4 className="font-medium mb-2">Challenges</h4>
                      <p className="text-sm bg-orange-50 border border-orange-200 p-3 rounded">
                        {recap.trainerForm.challengesFaced}
                      </p>
                    </div>
                  )}

                  {recap.trainerForm.notesForNextSession && (
                    <div>
                      <h4 className="font-medium mb-2">
                        Notes for Next Session
                      </h4>
                      <p className="text-sm bg-blue-50 border border-blue-200 p-3 rounded">
                        {recap.trainerForm.notesForNextSession}
                      </p>
                    </div>
                  )}

                  {recap.trainerForm.progressObservations && (
                    <div>
                      <h4 className="font-medium mb-2">
                        Progress Observations
                      </h4>
                      <p className="text-sm bg-purple-50 border border-purple-200 p-3 rounded">
                        {recap.trainerForm.progressObservations}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="share" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="h-5 w-5" />
                  Share with {client.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleShare("email")}
                    disabled={isSharing}
                    variant="outline"
                    className="flex-1"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email Recap
                  </Button>
                  <Button
                    onClick={() => handleShare("copy")}
                    disabled={isSharing}
                    variant="outline"
                    className="flex-1"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Text
                  </Button>
                  <Button
                    onClick={() => handleShare("sms")}
                    disabled={isSharing}
                    variant="outline"
                    className="flex-1"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send SMS
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    {recap.sharedWithClient ? (
                      <Eye className="h-4 w-4 text-green-600" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span>
                      {recap.sharedWithClient
                        ? "Shared with client"
                        : "Not shared yet"}
                    </span>
                  </div>

                  {recap.clientViewed && (
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>
                        Viewed by client on{" "}
                        {recap.clientViewedAt &&
                          new Date(recap.clientViewedAt).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Preview of client summary */}
                <div>
                  <h4 className="font-medium mb-2">Client Summary Preview</h4>
                  <div className="bg-muted p-4 rounded-lg text-sm font-mono max-h-60 overflow-y-auto">
                    {generateClientSummary(
                      recap.aiGeneratedContent,
                      client.name,
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-4">
          <Button onClick={() => setOpen(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
