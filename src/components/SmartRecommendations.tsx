import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Brain,
  TrendingUp,
  Lightbulb,
  Target,
  CheckCircle,
  Clock,
  Sparkles,
  BarChart3,
  Zap,
  ChevronRight,
} from "lucide-react";
import {
  generateRecommendations,
  getPriorityColor,
  getTypeIcon,
  type ClientAnalysis,
  type Recommendation,
} from "@/lib/recommendations";
import { Client } from "@/lib/types";

interface SmartRecommendationsProps {
  client: Client;
  variant?: "card" | "full" | "widget";
  onRecommendationApplied?: (recommendationId: string) => void;
}

export const SmartRecommendations = ({
  client,
  variant = "card",
  onRecommendationApplied,
}: SmartRecommendationsProps) => {
  const [analysis, setAnalysis] = useState<ClientAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [appliedRecommendations, setAppliedRecommendations] = useState<
    Set<string>
  >(new Set());

  useEffect(() => {
    // Simulate AI analysis processing
    setTimeout(() => {
      const analysisResult = generateRecommendations(client, [], []);
      setAnalysis(analysisResult);
      setLoading(false);
    }, 1000);
  }, [client]);

  const handleApplyRecommendation = (recommendationId: string) => {
    setAppliedRecommendations((prev) => new Set([...prev, recommendationId]));
    onRecommendationApplied?.(recommendationId);
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <div>
              <p className="text-sm font-medium">AI analyzing client data...</p>
              <p className="text-xs text-muted-foreground">
                Processing progress patterns and generating insights
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analysis) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <Brain className="h-8 w-8 mx-auto mb-2" />
            <p className="text-sm">Unable to generate recommendations</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === "widget") {
    return <RecommendationsWidget analysis={analysis} client={client} />;
  }

  if (variant === "full") {
    return (
      <RecommendationsFullView
        analysis={analysis}
        client={client}
        appliedRecommendations={appliedRecommendations}
        onApplyRecommendation={handleApplyRecommendation}
      />
    );
  }

  return (
    <RecommendationsCard
      analysis={analysis}
      client={client}
      appliedRecommendations={appliedRecommendations}
      onApplyRecommendation={handleApplyRecommendation}
    />
  );
};

const RecommendationsWidget = ({
  analysis,
  client,
}: {
  analysis: ClientAnalysis;
  client: Client;
}) => {
  const highPriorityCount = analysis.recommendations.filter(
    (r) => r.priority === "high",
  ).length;

  return (
    <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Brain className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="font-medium">AI Recommendations</p>
              <p className="text-sm text-muted-foreground">
                {analysis.recommendations.length} insights for {client.name}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {highPriorityCount > 0 && (
              <Badge className="bg-red-100 text-red-800">
                {highPriorityCount} high priority
              </Badge>
            )}
            <Button size="sm" variant="outline">
              View All
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const RecommendationsCard = ({
  analysis,
  client,
  appliedRecommendations,
  onApplyRecommendation,
}: {
  analysis: ClientAnalysis;
  client: Client;
  appliedRecommendations: Set<string>;
  onApplyRecommendation: (id: string) => void;
}) => {
  const topRecommendation = analysis.recommendations[0];

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            <CardTitle className="text-lg">AI Coach Recommendations</CardTitle>
          </div>
          <Badge className="bg-purple-100 text-purple-800">
            <Sparkles className="h-3 w-3 mr-1" />
            AI Powered
          </Badge>
        </div>
        <CardDescription>
          Smart insights for {client.name} based on progress analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Overview */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{analysis.attendanceRate}%</div>
            <p className="text-xs text-muted-foreground">Attendance</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{analysis.goalProgress}%</div>
            <p className="text-xs text-muted-foreground">Goal Progress</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold capitalize">
              {analysis.progressTrend}
            </div>
            <p className="text-xs text-muted-foreground">Trend</p>
          </div>
        </div>

        {/* Top Recommendation */}
        {topRecommendation && (
          <div className="border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">
                  {getTypeIcon(topRecommendation.type)}
                </span>
                <div>
                  <h4 className="font-medium">{topRecommendation.title}</h4>
                  <Badge
                    className={getPriorityColor(topRecommendation.priority)}
                  >
                    {topRecommendation.priority} priority
                  </Badge>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                {topRecommendation.confidence}% confidence
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              {topRecommendation.description}
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => onApplyRecommendation(topRecommendation.id)}
                disabled={appliedRecommendations.has(topRecommendation.id)}
              >
                {appliedRecommendations.has(topRecommendation.id) ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Applied
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Apply
                  </>
                )}
              </Button>
              <ViewRecommendationDialog recommendation={topRecommendation} />
            </div>
          </div>
        )}

        {/* Key Insights */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Key Insights</h4>
          {analysis.keyInsights.slice(0, 2).map((insight, index) => (
            <p
              key={index}
              className="text-sm text-muted-foreground flex items-start gap-2"
            >
              <Lightbulb className="h-4 w-4 mt-0.5 text-yellow-500" />
              {insight}
            </p>
          ))}
        </div>

        {analysis.recommendations.length > 1 && (
          <Button variant="outline" className="w-full">
            View All {analysis.recommendations.length} Recommendations
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

const RecommendationsFullView = ({
  analysis,
  client,
  appliedRecommendations,
  onApplyRecommendation,
}: {
  analysis: ClientAnalysis;
  client: Client;
  appliedRecommendations: Set<string>;
  onApplyRecommendation: (id: string) => void;
}) => {
  return (
    <div className="space-y-6">
      {/* Analysis Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-6 w-6 text-purple-600" />
                AI Analysis for {client.name}
              </CardTitle>
              <CardDescription>
                Generated on{" "}
                {new Date(analysis.analysisDate).toLocaleDateString()}
              </CardDescription>
            </div>
            <Badge className="bg-purple-100 text-purple-800">
              <Sparkles className="h-3 w-3 mr-1" />
              AI Powered
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <p className="text-sm font-medium">Progress Trend</p>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span className="text-lg font-semibold capitalize">
                  {analysis.progressTrend}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Attendance Rate</p>
              <div className="space-y-1">
                <span className="text-lg font-semibold">
                  {analysis.attendanceRate}%
                </span>
                <Progress value={analysis.attendanceRate} className="h-2" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Goal Progress</p>
              <div className="space-y-1">
                <span className="text-lg font-semibold">
                  {analysis.goalProgress}%
                </span>
                <Progress value={analysis.goalProgress} className="h-2" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Recommendations</p>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <span className="text-lg font-semibold">
                  {analysis.recommendations.length}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="recommendations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="insights">Key Insights</TabsTrigger>
          <TabsTrigger value="data">Data Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations" className="space-y-4">
          {analysis.recommendations.map((recommendation) => (
            <Card key={recommendation.id}>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">
                        {getTypeIcon(recommendation.type)}
                      </span>
                      <div className="space-y-1">
                        <h3 className="font-semibold">
                          {recommendation.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={getPriorityColor(
                              recommendation.priority,
                            )}
                          >
                            {recommendation.priority} priority
                          </Badge>
                          <Badge variant="outline">
                            {recommendation.confidence}% confidence
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => onApplyRecommendation(recommendation.id)}
                        disabled={appliedRecommendations.has(recommendation.id)}
                      >
                        {appliedRecommendations.has(recommendation.id) ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Applied
                          </>
                        ) : (
                          <>
                            <Zap className="h-4 w-4 mr-2" />
                            Apply
                          </>
                        )}
                      </Button>
                      <ViewRecommendationDialog
                        recommendation={recommendation}
                      />
                    </div>
                  </div>

                  <p className="text-muted-foreground">
                    {recommendation.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Action Items</h4>
                      <ul className="space-y-1">
                        {recommendation.actionItems.map((item, index) => (
                          <li
                            key={index}
                            className="text-sm text-muted-foreground flex items-start gap-2"
                          >
                            <CheckCircle className="h-4 w-4 mt-0.5 text-green-500" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Expected Impact</h4>
                      <div className="space-y-2 text-sm">
                        <p className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-blue-500" />
                          {recommendation.estimatedImpact}
                        </p>
                        <p className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-orange-500" />
                          {recommendation.timeframe}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                Key Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysis.keyInsights.map((insight, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-muted rounded-lg"
                  >
                    <Lightbulb className="h-5 w-5 mt-0.5 text-yellow-500" />
                    <p className="text-sm">{insight}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Points Analyzed</CardTitle>
              <CardDescription>
                The AI system analyzed the following data to generate
                recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysis.recommendations.slice(0, 2).map((rec) => (
                  <div key={rec.id} className="space-y-2">
                    <h4 className="font-medium">{rec.title}</h4>
                    <ul className="space-y-1">
                      {rec.dataPoints.map((point, index) => (
                        <li
                          key={index}
                          className="text-sm text-muted-foreground flex items-center gap-2"
                        >
                          <BarChart3 className="h-3 w-3" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const ViewRecommendationDialog = ({
  recommendation,
}: {
  recommendation: Recommendation;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          View Details
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-xl">{getTypeIcon(recommendation.type)}</span>
            {recommendation.title}
          </DialogTitle>
          <DialogDescription>{recommendation.description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="flex gap-2">
            <Badge className={getPriorityColor(recommendation.priority)}>
              {recommendation.priority} priority
            </Badge>
            <Badge variant="outline">
              {recommendation.confidence}% confidence
            </Badge>
          </div>

          <div>
            <h4 className="font-medium mb-2">Reasoning</h4>
            <p className="text-sm text-muted-foreground">
              {recommendation.reasoning}
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-3">Action Plan</h4>
            <div className="space-y-2">
              {recommendation.actionItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-2 bg-muted rounded"
                >
                  <CheckCircle className="h-4 w-4 mt-0.5 text-green-500" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Expected Impact</h4>
              <p className="text-sm text-muted-foreground">
                {recommendation.estimatedImpact}
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Timeframe</h4>
              <p className="text-sm text-muted-foreground">
                {recommendation.timeframe}
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Data Sources</h4>
            <ul className="space-y-1">
              {recommendation.dataPoints.map((point, index) => (
                <li
                  key={index}
                  className="text-sm text-muted-foreground flex items-center gap-2"
                >
                  <BarChart3 className="h-3 w-3" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
