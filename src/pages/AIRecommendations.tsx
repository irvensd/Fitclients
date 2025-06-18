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
        const ids = new Set(appliedRecs.map((rec: any) => rec.id));
        setAppliedRecommendationIds(ids);
      } catch (e) {
        console.warn("Failed to load applied recommendations:", e);
      }
    }
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading AI analysis...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show empty state for new accounts
  if (clients.length === 0) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-3xl font-bold text-foreground">
                AI Coach Dashboard
              </h1>
              <Badge className="bg-purple-100 text-purple-800">
                <Sparkles className="h-3 w-3 mr-1" />
                AI Powered
              </Badge>
            </div>
            <p className="text-muted-foreground">
              Smart recommendations and insights to help you coach more
              effectively.
            </p>
          </div>
        </div>

        <Card className="text-center py-12">
          <CardContent>
            <Brain className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              No Client Data Available
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Add some clients and their session data to see AI-powered
              recommendations and insights.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
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

  // Stats
  const highPriorityCount = allRecommendations.filter(
    (r) => r.priority === "high",
  ).length;
  const clientsNeedingAttention = clientAnalyses.filter((a) =>
    a.recommendations.some((r) => r.priority === "high"),
  ).length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-3xl font-bold text-foreground">
              AI Coach Dashboard
            </h1>
            <Badge className="bg-purple-100 text-purple-800">
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
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white"
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span className="text-sm font-medium">High Priority</span>
            </div>
            <div className="text-2xl font-bold text-red-700">
              {highPriorityCount}
            </div>
            <p className="text-xs text-red-600">Recommendations</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium">Clients</span>
            </div>
            <div className="text-2xl font-bold text-blue-700">
              {clientAnalyses.length}
            </div>
            <p className="text-xs text-blue-600">Analyzed</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-yellow-600" />
              <span className="text-sm font-medium">Need Attention</span>
            </div>
            <div className="text-2xl font-bold text-yellow-700">
              {clientsNeedingAttention}
            </div>
            <p className="text-xs text-yellow-600">Clients</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium">Total Insights</span>
            </div>
            <div className="text-2xl font-bold text-green-700">
              {allRecommendations.length}
            </div>
            <p className="text-xs text-green-600">Generated</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="recommendations">All Recommendations</TabsTrigger>
          <TabsTrigger value="clients">Client Analysis</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Priority Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                High Priority Recommendations
              </CardTitle>
              <CardDescription>
                These recommendations need immediate attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {allRecommendations
                  .filter((r) => r.priority === "high")
                  .slice(0, 3)
                  .map((rec) => (
                    <div
                      key={`${rec.clientId}-${rec.id}`}
                      className="flex items-center justify-between p-4 border rounded-lg bg-red-50"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{getTypeIcon(rec.type)}</span>
                        <div>
                          <h4 className="font-medium">{rec.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {rec.clientName} • {rec.confidence}% confidence
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getPriorityColor(rec.priority)}>
                          {rec.priority}
                        </Badge>
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
                        >
                          <Zap className="h-4 w-4 mr-2" />
                          Apply
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Client Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Client Progress Overview</CardTitle>
              <CardDescription>
                Quick view of all client progress trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {clientAnalyses.map((analysis) => (
                  <div
                    key={analysis.clientId}
                    className="p-4 border rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {analysis.clientName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{analysis.clientName}</h4>
                          <p className="text-sm text-muted-foreground capitalize">
                            {analysis.progressTrend}
                          </p>
                        </div>
                      </div>
                      <Badge
                        className={
                          analysis.recommendations.some(
                            (r) => r.priority === "high",
                          )
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }
                      >
                        {analysis.recommendations.length} recommendations
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Attendance</p>
                        <Progress
                          value={analysis.attendanceRate}
                          className="h-2 mt-1"
                        />
                        <span className="text-xs">
                          {analysis.attendanceRate}%
                        </span>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Goal Progress</p>
                        <Progress
                          value={analysis.goalProgress}
                          className="h-2 mt-1"
                        />
                        <span className="text-xs">
                          {analysis.goalProgress}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search recommendations or clients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select
                  value={priorityFilter}
                  onValueChange={setPriorityFilter}
                >
                  <SelectTrigger className="w-full sm:w-[140px]">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full sm:w-[140px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="workout">Workout</SelectItem>
                    <SelectItem value="cardio">Cardio</SelectItem>
                    <SelectItem value="recovery">Recovery</SelectItem>
                    <SelectItem value="schedule">Schedule</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations List */}
          <div className="space-y-4">
            {filteredRecommendations.map((rec) => (
              <Card key={`${rec.clientId}-${rec.id}`}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <span className="text-xl">{getTypeIcon(rec.type)}</span>
                      <div className="space-y-1">
                        <h3 className="font-semibold">{rec.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {rec.clientName} • {rec.confidence}% confidence
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge className={getPriorityColor(rec.priority)}>
                            {rec.priority} priority
                          </Badge>
                          <Badge variant="outline">{rec.type}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
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
                      >
                        <Zap className="h-4 w-4 mr-2" />
                        Apply
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          console.log("Viewing details for:", rec.title);
                        }}
                      >
                        Details
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">
                    {rec.description}
                  </p>
                  <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Impact: {rec.estimatedImpact}</span>
                    <span>Timeframe: {rec.timeframe}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="clients" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {clientAnalyses.map((analysis) => {
              const client = clients.find((c) => c.id === analysis.clientId);
              return (
                <div key={analysis.clientId}>
                  <SmartRecommendations
                    client={client}
                    variant="card"
                    onRecommendationApplied={(id) => {
                      console.log(
                        `Applied recommendation ${id} for ${client?.name}`,
                      );
                    }}
                  />
                </div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Recommendation Types
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {["workout", "cardio", "recovery", "schedule"].map((type) => {
                    const count = allRecommendations.filter(
                      (r) => r.type === type,
                    ).length;
                    const percentage = Math.round(
                      (count / allRecommendations.length) * 100,
                    );
                    return (
                      <div key={type} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="capitalize">{type}</span>
                          <span>
                            {count} ({percentage}%)
                          </span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Client Progress Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {["improving", "plateauing", "declining"].map((trend) => {
                    const count = clientAnalyses.filter(
                      (a) => a.progressTrend === trend,
                    ).length;
                    const percentage = Math.round(
                      (count / clientAnalyses.length) * 100,
                    );
                    return (
                      <div key={trend} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="capitalize">{trend}</span>
                          <span>
                            {count} clients ({percentage}%)
                          </span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
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
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Zap className="h-5 w-5 text-purple-600" />
              </div>
              Apply AI Recommendation
            </DialogTitle>
            <DialogDescription>
              Confirm applying this recommendation to{" "}
              {confirmationModal.clientName}'s training plan
            </DialogDescription>
          </DialogHeader>

          {confirmationModal.recommendation && (
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">
                    {getTypeIcon(confirmationModal.recommendation.type)}
                  </span>
                  <h3 className="font-semibold">
                    {confirmationModal.recommendation.title}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {confirmationModal.recommendation.description}
                </p>
                <div className="flex items-center gap-2">
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
                        className="text-sm text-muted-foreground flex items-start gap-2"
                      >
                        <CheckCircle className="h-4 w-4 mt-0.5 text-green-500 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                </ul>
              </div>

              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>Expected Impact:</strong>{" "}
                  {confirmationModal.recommendation.estimatedImpact}
                </p>
                <p className="text-sm text-green-700 mt-1">
                  <strong>Timeframe:</strong>{" "}
                  {confirmationModal.recommendation.timeframe}
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
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

                // Auto close after success
                setTimeout(() => {
                  setConfirmationModal({
                    isOpen: false,
                    recommendation: null,
                    clientName: "",
                    isApplying: false,
                    isSuccess: false,
                  });
                }, 2000);
              }}
              disabled={
                confirmationModal.isApplying || confirmationModal.isSuccess
              }
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white"
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
