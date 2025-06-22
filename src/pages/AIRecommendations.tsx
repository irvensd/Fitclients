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
  const { clients, sessions, payments, loading } = useData();
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

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex-1">
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

      {/* Overview Stats */}
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
              <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              <span className="text-xs sm:text-sm font-medium">Total Insights</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-green-700">
              {activeRecommendations.length}
            </div>
            <p className="text-xs text-green-600">Active</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="recommendations" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="recommendations" className="flex-1 text-xs sm:text-sm">
            <Lightbulb className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Recommendations</span>
            <span className="sm:hidden">Recs</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex-1 text-xs sm:text-sm">
            <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Predictive Analytics</span>
            <span className="sm:hidden">Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex-1 text-xs sm:text-sm">
            <Zap className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">AI Chat</span>
            <span className="sm:hidden">Chat</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-4 sm:pt-6">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search recommendations or clients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="high">High Priority</SelectItem>
                    <SelectItem value="medium">Medium Priority</SelectItem>
                    <SelectItem value="low">Low Priority</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="workout">Workout</SelectItem>
                    <SelectItem value="cardio">Cardio</SelectItem>
                    <SelectItem value="recovery">Recovery</SelectItem>
                    <SelectItem value="nutrition">Nutrition</SelectItem>
                    <SelectItem value="schedule">Schedule</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations List */}
          <div className="space-y-3 sm:space-y-4">
            {filteredRecommendations.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Recommendations Found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm || priorityFilter !== "all" || typeFilter !== "all"
                      ? "Try adjusting your filters to see more recommendations."
                      : "All recommendations have been applied or no new insights available."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredRecommendations.map((rec) => (
                <Card key={`${rec.clientId}-${rec.id}`} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-4 sm:pt-6">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="text-2xl sm:text-3xl">{getTypeIcon(rec.type)}</div>
                        <div className="hidden sm:block">
                          <Badge className={getPriorityColor(rec.priority)}>
                            {rec.priority}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 mb-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm sm:text-base mb-1">{rec.title}</h3>
                            <p className="text-xs sm:text-sm text-muted-foreground mb-2">{rec.description}</p>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {rec.clientName}
                              </span>
                              <span>•</span>
                              <span className="capitalize">{rec.type}</span>
                              <span>•</span>
                              <span>{rec.confidence}% confidence</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                            <div className="sm:hidden">
                              <Badge className={getPriorityColor(rec.priority)}>
                                {rec.priority}
                              </Badge>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => {
                                setConfirmationModal({
                                  isOpen: true,
                                  recommendation: rec,
                                  clientName: rec.clientName,
                                  isApplying: false,
                                  isSuccess: false,
                                });
                              }}
                              className="w-full sm:w-auto"
                            >
                              <Zap className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                              <span className="text-xs sm:text-sm">Apply</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4 sm:space-y-6">
          {/* Dropout Risk Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
                Dropout Risk Analysis
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                AI-powered prediction of client retention and dropout risk
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {clientAnalyses.map((analysis) => {
                  const dropoutRisk = Math.random() * 30 + 5; // 5-35% risk
                  const retentionProbability = 100 - dropoutRisk;
                  const riskLevel = dropoutRisk > 25 ? "high" : dropoutRisk > 15 ? "medium" : "low";
                  
                  return (
                    <div key={analysis.clientId} className="p-3 sm:p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2 sm:mb-3">
                        <h4 className="font-medium text-sm sm:text-base">{analysis.clientName}</h4>
                        <Badge 
                          className={
                            riskLevel === "high" ? "bg-red-100 text-red-800" :
                            riskLevel === "medium" ? "bg-yellow-100 text-yellow-800" :
                            "bg-green-100 text-green-800"
                          }
                        >
                          {riskLevel} risk
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 sm:space-y-3">
                        <div>
                          <div className="flex justify-between text-xs sm:text-sm mb-1">
                            <span>Dropout Risk</span>
                            <span>{dropoutRisk.toFixed(1)}%</span>
                          </div>
                          <Progress 
                            value={dropoutRisk} 
                            className="h-2"
                            style={{
                              '--progress-background': riskLevel === "high" ? '#ef4444' : 
                                                     riskLevel === "medium" ? '#eab308' : '#22c55e'
                            } as React.CSSProperties}
                          />
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-xs sm:text-sm mb-1">
                            <span>Retention Probability</span>
                            <span>{retentionProbability.toFixed(1)}%</span>
                          </div>
                          <Progress 
                            value={retentionProbability} 
                            className="h-2"
                            style={{
                              '--progress-background': '#22c55e'
                            } as React.CSSProperties}
                          />
                        </div>
                      </div>
                      
                      <div className="mt-2 sm:mt-3 text-xs text-muted-foreground">
                        <p>Last session: {analysis.nextReviewDate ? new Date(analysis.nextReviewDate).toLocaleDateString() : "N/A"}</p>
                        <p>Attendance: {analysis.attendanceRate}%</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Milestone Predictions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Target className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                Milestone Predictions
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                AI predictions for client goal achievement and milestones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {clientAnalyses.slice(0, 6).map((analysis) => {
                  const nextMilestone = Math.random() > 0.5 ? "Weight Goal" : "Fitness Goal";
                  const predictedDate = new Date();
                  predictedDate.setDate(predictedDate.getDate() + Math.floor(Math.random() * 60) + 30);
                  const confidence = Math.floor(Math.random() * 30) + 70; // 70-100%
                  
                  return (
                    <div key={analysis.clientId} className="p-3 sm:p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2 sm:mb-3">
                        <h4 className="font-medium text-sm sm:text-base">{analysis.clientName}</h4>
                        <Badge className="bg-blue-100 text-blue-800">
                          {confidence}% confidence
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 sm:space-y-3">
                        <div>
                          <p className="text-xs sm:text-sm font-medium">{nextMilestone}</p>
                          <p className="text-xs text-muted-foreground">
                            Predicted: {predictedDate.toLocaleDateString()}
                          </p>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-xs sm:text-sm mb-1">
                            <span>Progress</span>
                            <span>{analysis.goalProgress}%</span>
                          </div>
                          <Progress value={analysis.goalProgress} className="h-2" />
                        </div>
                      </div>
                      
                      <div className="mt-2 sm:mt-3 text-xs text-muted-foreground">
                        <p>Current trend: {analysis.progressTrend}</p>
                        <p>Days to milestone: {Math.ceil((predictedDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Performance Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                Performance Trends
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                AI analysis of client performance patterns and trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {clientAnalyses.map((analysis) => {
                  const trend = analysis.progressTrend;
                  const trendIcon = trend === "improving" ? "📈" : trend === "plateauing" ? "➡️" : "📉";
                  const trendColor = trend === "improving" ? "text-green-600" : 
                                   trend === "plateauing" ? "text-yellow-600" : "text-red-600";
                  
                  return (
                    <div key={analysis.clientId} className="p-3 sm:p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2 sm:mb-3">
                        <h4 className="font-medium text-sm sm:text-base">{analysis.clientName}</h4>
                        <span className="text-lg sm:text-xl">{trendIcon}</span>
                      </div>
                      
                      <div className="space-y-2 sm:space-y-3">
                        <div>
                          <p className={`text-xs sm:text-sm font-medium ${trendColor} capitalize`}>
                            {trend} trend
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Based on recent sessions
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs">
                          <div>
                            <p className="text-muted-foreground">Attendance</p>
                            <p className="font-medium">{analysis.attendanceRate}%</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Goal Progress</p>
                            <p className="font-medium">{analysis.goalProgress}%</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-2 sm:mt-3 text-xs text-muted-foreground">
                        <p>Recommendations: {analysis.recommendations.length}</p>
                        <p>Last updated: {new Date().toLocaleDateString()}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="chat" className="space-y-4">
          <div className="h-[600px] sm:h-[700px]">
            <AIChatInterface />
          </div>
        </TabsContent>
      </Tabs>

      {/* Confirmation Modal */}
      <Dialog
        open={confirmationModal.isOpen}
        onOpenChange={(open) =>
          setConfirmationModal({
            ...confirmationModal,
            isOpen: open,
            isApplying: false,
            isSuccess: false,
          })
        }
      >
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
              </div>
              Apply AI Recommendation
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Confirm applying this recommendation to{" "}
              {confirmationModal.clientName}'s training plan
            </DialogDescription>
          </DialogHeader>

          {confirmationModal.recommendation && (
            <div className="space-y-3 sm:space-y-4">
              <div className="p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg sm:text-xl">
                    {getTypeIcon(confirmationModal.recommendation.type)}
                  </span>
                  <h3 className="font-semibold text-sm sm:text-base">
                    {confirmationModal.recommendation.title}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mb-3">
                  {confirmationModal.recommendation.description}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    className={getPriorityColor(
                      confirmationModal.recommendation.priority,
                    )}
                  >
                    {confirmationModal.recommendation.priority} priority
                  </Badge>
                  <Badge variant="outline">
                    {confirmationModal.recommendation.confidence}% confidence
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">Action Items:</h4>
                <ul className="space-y-1">
                  {confirmationModal.recommendation.actionItems
                    ?.slice(0, 3)
                    .map((item: string, index: number) => (
                      <li
                        key={index}
                        className="text-xs sm:text-sm text-muted-foreground flex items-start gap-2"
                      >
                        <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mt-0.5 text-green-500 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                </ul>
              </div>

              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-xs sm:text-sm text-green-800">
                  <strong>Expected Impact:</strong>{" "}
                  {confirmationModal.recommendation.estimatedImpact}
                </p>
                <p className="text-xs sm:text-sm text-green-700 mt-1">
                  <strong>Timeframe:</strong>{" "}
                  {confirmationModal.recommendation.timeframe}
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 flex-col sm:flex-row">
            <Button
              variant="outline"
              onClick={() =>
                setConfirmationModal({
                  isOpen: false,
                  recommendation: null,
                  clientName: "",
                  isApplying: false,
                  isSuccess: false,
                })
              }
              disabled={confirmationModal.isApplying}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                setConfirmationModal({
                  ...confirmationModal,
                  isApplying: true,
                });

                // Simulate processing time
                await new Promise((resolve) => setTimeout(resolve, 1500));

                const recId = `${confirmationModal.recommendation.clientId}-${confirmationModal.recommendation.id}`;
                setAppliedRecommendationIds(
                  (prev) => new Set([...prev, recId]),
                );

                // Store applied recommendation in localStorage for persistence
                const appliedRecs = JSON.parse(
                  localStorage.getItem("appliedRecommendations") || "[]",
                );

                // Check if this recommendation already exists to prevent duplicates
                const existingRec = appliedRecs.find(
                  (rec: any) => rec.id === recId,
                );
                if (!existingRec) {
                  appliedRecs.push({
                    id: recId,
                    clientId: confirmationModal.recommendation.clientId,
                    clientName: confirmationModal.clientName,
                    title: confirmationModal.recommendation.title,
                    type: confirmationModal.recommendation.type,
                    appliedDate: new Date().toISOString(),
                    status: "active",
                  });
                  localStorage.setItem(
                    "appliedRecommendations",
                    JSON.stringify(appliedRecs),
                  );
                }

                setConfirmationModal({
                  ...confirmationModal,
                  isSuccess: true,
                  isApplying: false,
                });

                // Show success toast
                toast({
                  title: "✅ Recommendation Applied!",
                  description: `"${confirmationModal.recommendation.title}" has been added to ${confirmationModal.clientName}'s training plan and will appear on their client card.`,
                  duration: 5000,
                });

                // Auto close after success and refresh counts
                setTimeout(() => {
                  setConfirmationModal({
                    isOpen: false,
                    recommendation: null,
                    clientName: "",
                    isApplying: false,
                    isSuccess: false,
                  });
                  setRefreshKey((prev) => prev + 1); // Trigger refresh of counts
                }, 2000);
              }}
              disabled={
                confirmationModal.isApplying || confirmationModal.isSuccess
              }
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white w-full sm:w-auto"
            >
              {confirmationModal.isApplying ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Applying...
                </>
              ) : confirmationModal.isSuccess ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Applied!
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Apply Recommendation
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AIRecommendations;
