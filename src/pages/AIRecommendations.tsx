import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  Sparkles,
  Search,
  TrendingUp,
  Users,
  Target,
  Clock,
  Lightbulb,
  BarChart3,
  Zap,
  CheckCircle,
  AlertTriangle,
  Activity,
} from "lucide-react";
import { SmartRecommendations } from "@/components/SmartRecommendations";
import { AIChatInterface } from "@/components/AIChatInterface";
import {
  generateRecommendations,
  getPriorityColor,
  getTypeIcon,
} from "@/lib/recommendations";
import { useData } from "@/contexts/DataContext";
import { useToast } from "@/hooks/use-toast";

const AIRecommendations = () => {
  const { clients, sessions, payments, progressEntries, loading, addAiNotesToWorkoutPlan } = useData();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastAnalysisTime, setLastAnalysisTime] = useState<Date | null>(null);
  const [appliedRecommendationIds, setAppliedRecommendationIds] = useState<
    Set<string>
  >(new Set());
  const [refreshKey, setRefreshKey] = useState(0);
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    recommendation: any;
    clientName: string;
    isApplying: boolean;
    isSuccess: boolean;
  }>({
    isOpen: false,
    recommendation: null,
    clientName: "",
    isApplying: false,
    isSuccess: false,
  });

  // Load applied recommendations from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("appliedRecommendations");
    if (stored) {
      try {
        const appliedRecs = JSON.parse(stored);
        const ids = new Set<string>(appliedRecs.map((rec: any) => rec.id as string));
        setAppliedRecommendationIds(ids);
      } catch (e) {
        console.warn("Failed to load applied recommendations:", e);
      }
    }
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="flex items-center justify-center h-48 sm:h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground">Loading AI analysis...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show empty state for new accounts
  if (clients.length === 0) {
    return (
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                AI Coach Dashboard
              </h1>
              <Badge className="bg-purple-100 text-purple-800 w-fit">
                <Sparkles className="h-3 w-3 mr-1" />
                AI Powered
              </Badge>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground">
              Smart recommendations and insights to help you coach more
              effectively.
            </p>
          </div>
        </div>

        <Card className="text-center py-8 sm:py-12">
          <CardContent>
            <Brain className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold mb-2">
              No Client Data Available
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-6 max-w-md mx-auto">
              Add some clients and their session data to see AI-powered
              recommendations and insights.
            </p>
            <div className="space-y-2 text-xs sm:text-sm text-muted-foreground">
              <p>• Add clients to your roster</p>
              <p>• Schedule and complete training sessions</p>
              <p>• Track client progress and payments</p>
              <p>• Get personalized AI recommendations</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Generate analyses for all clients using real data
  const clientAnalyses = clients.map((client) =>
    generateRecommendations(client, sessions, payments),
  );

  // Get all recommendations across clients
  const allRecommendations = clientAnalyses.flatMap((analysis) =>
    analysis.recommendations.map((rec) => ({
      ...rec,
      clientName: analysis.clientName,
      clientId: analysis.clientId,
    })),
  );

  // Filter recommendations
  const filteredRecommendations = allRecommendations.filter((rec) => {
    const matchesSearch =
      rec.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority =
      priorityFilter === "all" || rec.priority === priorityFilter;
    const matchesType = typeFilter === "all" || rec.type === typeFilter;
    const notApplied = !appliedRecommendationIds.has(
      `${rec.clientId}-${rec.id}`,
    );
    return matchesSearch && matchesPriority && matchesType && notApplied;
  });

  // Stats - filtered by applied recommendations
  const activeRecommendations = allRecommendations.filter(
    (rec) => !appliedRecommendationIds.has(`${rec.clientId}-${rec.id}`),
  );
  const highPriorityCount = activeRecommendations.filter(
    (r) => r.priority === "high",
  ).length;
  const clientsNeedingAttention = clientAnalyses.filter((a) =>
    a.recommendations.some(
      (r) =>
        r.priority === "high" &&
        !appliedRecommendationIds.has(`${a.clientId}-${r.id}`),
    ),
  ).length;
  const clientsOnTrack = clientAnalyses.filter((a) =>
    a.recommendations.every(
      (r) => r.priority === "low" || appliedRecommendationIds.has(`${a.clientId}-${r.id}`),
    ),
  ).length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
            <h1 className="text-3xl font-bold text-foreground">
              AI Coach Dashboard
            </h1>
            <Badge className="bg-purple-100 text-purple-800 w-fit">
              <Sparkles className="h-3 w-3 mr-1" />
              AI Powered
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Smart recommendations and insights to help you coach more
            effectively.
          </p>
          {lastAnalysisTime && (
            <p className="text-xs text-purple-600 mt-1">
              Last analysis: {lastAnalysisTime.toLocaleString()}
            </p>
          )}
        </div>
        <Button
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white w-full sm:w-auto"
          onClick={async () => {
            setIsAnalyzing(true);

            // Simulate AI processing
            await new Promise((resolve) => setTimeout(resolve, 3000));

            setLastAnalysisTime(new Date());
            setIsAnalyzing(false);

            // Show success toast
            toast({
              title: "🤖 AI Analysis Complete!",
              description: `Analyzed ${clients.length} clients and generated ${allRecommendations.length} recommendations with ${highPriorityCount} high-priority items.`,
              duration: 5000,
            });
          }}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Analyzing...
            </>
          ) : (
            <>
              <Brain className="h-4 w-4 mr-2" />
              Generate New Analysis
            </>
          )}
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
              <span className="text-xs sm:text-sm font-medium">High Priority</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-red-700">
              {highPriorityCount}
            </div>
            <p className="text-xs text-red-600">Recommendations</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              <span className="text-xs sm:text-sm font-medium">Clients</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-blue-700">
              {clientAnalyses.length}
            </div>
            <p className="text-xs text-blue-600">Analyzed</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
              <span className="text-xs sm:text-sm font-medium">Need Attention</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-yellow-700">
              {clientsNeedingAttention}
            </div>
            <p className="text-xs text-yellow-600">Clients</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              <span className="text-xs sm:text-sm font-medium">On Track</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-green-700">
              {clientsOnTrack}
            </div>
            <p className="text-xs text-green-600">Clients</p>
          </CardContent>
        </Card>
      </div>

      {/* Client Analyses */}
      <div className="space-y-6">
        {clientAnalyses.map((analysis) => {
          const client = clients.find(c => c.id === analysis.clientId);
          if (!client) return null;
          
          return (
            <Card key={analysis.clientId} className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={client.avatar} />
                      <AvatarFallback className="text-sm font-semibold">
                        {client.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{client.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {client.email} • {client.fitnessLevel}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge
                    variant={
                      analysis.recommendations.some(r => r.priority === "high")
                        ? "destructive"
                        : analysis.recommendations.some(r => r.priority === "medium")
                        ? "secondary"
                        : "default"
                    }
                    className="ml-2"
                  >
                    {analysis.recommendations.some(r => r.priority === "high") ? "high" : 
                     analysis.recommendations.some(r => r.priority === "medium") ? "medium" : "low"} priority
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Key Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-lg font-bold text-blue-600">
                      {sessions.filter(s => s.clientId === analysis.clientId).length}
                    </div>
                    <div className="text-xs text-muted-foreground">Sessions</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-lg font-bold text-green-600">
                      {analysis.attendanceRate}%
                    </div>
                    <div className="text-xs text-muted-foreground">Attendance</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-lg font-bold text-purple-600">
                      {progressEntries.filter(p => p.clientId === analysis.clientId).length}
                    </div>
                    <div className="text-xs text-muted-foreground">Progress Logs</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-lg font-bold text-orange-600">
                      ${payments.filter(p => p.clientId === analysis.clientId).reduce((sum, p) => sum + p.amount, 0)}
                    </div>
                    <div className="text-xs text-muted-foreground">Revenue</div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <Brain className="h-4 w-4 text-primary" />
                    AI Recommendations
                  </h4>
                  <div className="space-y-2">
                    {analysis.recommendations.map((rec, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg"
                      >
                        <div className="p-1.5 bg-primary/10 rounded-full mt-0.5">
                          <Target className="h-3 w-3 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{rec.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {rec.description}
                          </p>
                          <Button size="sm" variant="outline" className="mt-2">
                            Apply Recommendation
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Insights */}
                {analysis.keyInsights.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-purple-600" />
                      Key Insights
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {analysis.keyInsights.map((insight, index) => (
                        <div
                          key={index}
                          className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg"
                        >
                          <div className="flex items-start gap-2">
                            <div className="p-1 bg-purple-100 rounded-full mt-0.5">
                              <Activity className="h-3 w-3 text-purple-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-purple-900">
                                Insight {index + 1}
                              </p>
                              <p className="text-xs text-purple-700 mt-1">
                                {insight}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AIRecommendations;
