import { Client, Session, ProgressEntry, WorkoutPlan } from "./types";

export interface Recommendation {
  id: string;
  type: "workout" | "cardio" | "recovery" | "nutrition" | "schedule";
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  reasoning: string;
  actionItems: string[];
  confidence: number; // 0-100
  dataPoints: string[];
  estimatedImpact: string;
  timeframe: string;
}

export interface ClientAnalysis {
  clientId: string;
  clientName: string;
  analysisDate: string;
  progressTrend: "improving" | "plateauing" | "declining";
  attendanceRate: number;
  goalProgress: number;
  recommendations: Recommendation[];
  keyInsights: string[];
  nextReviewDate: string;
}

// Mock data for demonstration - in real app this would come from actual client data
const getClientProgressData = (clientId: string) => {
  const mockData = {
    "1": {
      recentSessions: [
        { date: "2024-03-15", attended: true, performance: 85 },
        { date: "2024-03-13", attended: true, performance: 88 },
        { date: "2024-03-11", attended: false, performance: 0 },
        { date: "2024-03-08", attended: true, performance: 82 },
        { date: "2024-03-06", attended: true, performance: 90 },
      ],
      progressEntries: [
        { date: "2024-03-15", weight: 165, bodyFat: 18.5 },
        { date: "2024-03-01", weight: 168, bodyFat: 19.2 },
        { date: "2024-02-15", weight: 170, bodyFat: 19.8 },
      ],
      currentWorkout: {
        intensity: "moderate",
        frequency: 3,
        lastUpdated: "2024-02-01",
        focus: "weight-loss",
      },
      goals: {
        targetWeight: 160,
        targetBodyFat: 16,
        targetDate: "2024-06-01",
      },
    },
    "2": {
      recentSessions: [
        { date: "2024-03-15", attended: true, performance: 75 },
        { date: "2024-03-13", attended: true, performance: 78 },
        { date: "2024-03-11", attended: true, performance: 80 },
        { date: "2024-03-08", attended: true, performance: 70 },
        { date: "2024-03-06", attended: true, performance: 72 },
      ],
      progressEntries: [
        { date: "2024-03-15", weight: 185, bodyFat: 15.8 },
        { date: "2024-03-01", weight: 183, bodyFat: 16.2 },
        { date: "2024-02-15", weight: 181, bodyFat: 16.8 },
      ],
      currentWorkout: {
        intensity: "high",
        frequency: 4,
        lastUpdated: "2024-01-15",
        focus: "strength",
      },
      goals: {
        targetWeight: 190,
        targetBodyFat: 12,
        targetDate: "2024-08-01",
      },
    },
  };

  return mockData[clientId as keyof typeof mockData] || null;
};

export const generateRecommendations = (
  client: Client,
  recentSessions: Session[],
  progressEntries: ProgressEntry[],
  currentWorkout?: WorkoutPlan,
): ClientAnalysis => {
  const clientData = getClientProgressData(client.id);
  if (!clientData) {
    return {
      clientId: client.id,
      clientName: client.name,
      analysisDate: new Date().toISOString(),
      progressTrend: "plateauing",
      attendanceRate: 0,
      goalProgress: 0,
      recommendations: [],
      keyInsights: ["Insufficient data for analysis"],
      nextReviewDate: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000,
      ).toISOString(),
    };
  }

  const analysis: ClientAnalysis = {
    clientId: client.id,
    clientName: client.name,
    analysisDate: new Date().toISOString(),
    progressTrend: analyzeProgressTrend(clientData),
    attendanceRate: calculateAttendanceRate(clientData.recentSessions),
    goalProgress: calculateGoalProgress(clientData),
    recommendations: [],
    keyInsights: [],
    nextReviewDate: new Date(
      Date.now() + 14 * 24 * 60 * 60 * 1000,
    ).toISOString(),
  };

  // Generate AI recommendations based on analysis
  analysis.recommendations = generateAIRecommendations(clientData, analysis);
  analysis.keyInsights = generateKeyInsights(clientData, analysis);

  return analysis;
};

const analyzeProgressTrend = (
  data: any,
): "improving" | "plateauing" | "declining" => {
  const weights = data.progressEntries.map((entry: any) => entry.weight);
  if (weights.length < 2) return "plateauing";

  const recentChange = weights[0] - weights[1];
  const olderChange = weights.length > 2 ? weights[1] - weights[2] : 0;

  if (data.currentWorkout.focus === "weight-loss") {
    if (recentChange < -1) return "improving";
    if (recentChange > 1) return "declining";
  } else if (data.currentWorkout.focus === "strength") {
    if (recentChange > 1) return "improving";
    if (recentChange < -1) return "declining";
  }

  return "plateauing";
};

const calculateAttendanceRate = (sessions: any[]): number => {
  const attendedSessions = sessions.filter((s) => s.attended).length;
  return Math.round((attendedSessions / sessions.length) * 100);
};

const calculateGoalProgress = (data: any): number => {
  const currentWeight = data.progressEntries[0]?.weight || 0;
  const startWeight =
    data.progressEntries[data.progressEntries.length - 1]?.weight ||
    currentWeight;
  const targetWeight = data.goals.targetWeight;

  const totalChange = Math.abs(targetWeight - startWeight);
  const currentChange = Math.abs(currentWeight - startWeight);

  return Math.min(Math.round((currentChange / totalChange) * 100), 100);
};

const generateAIRecommendations = (
  data: any,
  analysis: ClientAnalysis,
): Recommendation[] => {
  const recommendations: Recommendation[] = [];

  // Workout Progression Recommendation
  if (
    analysis.progressTrend === "plateauing" &&
    data.currentWorkout.focus === "weight-loss"
  ) {
    recommendations.push({
      id: "workout-intensity",
      type: "workout",
      priority: "high",
      title: "Increase Workout Intensity",
      description:
        "Client's weight loss has plateaued. Time to challenge them with higher intensity workouts.",
      reasoning:
        "Weight has remained stable for 2 weeks despite consistent training. Body may have adapted to current routine.",
      actionItems: [
        "Add 15-20% more weight to strength exercises",
        "Introduce supersets and compound movements",
        "Reduce rest periods by 15-30 seconds",
        "Add plyometric exercises 2x per week",
      ],
      confidence: 85,
      dataPoints: [
        "Weight stable at 165 lbs for 2 weeks",
        "Body fat reduction slowing",
        "Session performance scores improving (82-90%)",
      ],
      estimatedImpact: "Resume 1-2 lbs weight loss per week",
      timeframe: "2-3 weeks",
    });
  }

  // Cardio Recommendation
  if (
    data.currentWorkout.focus === "weight-loss" &&
    analysis.attendanceRate > 80
  ) {
    recommendations.push({
      id: "cardio-addition",
      type: "cardio",
      priority: "medium",
      title: "Add HIIT Cardio Sessions",
      description:
        "Excellent attendance shows client motivation. Add cardio to accelerate fat loss.",
      reasoning:
        "High attendance rate and consistent performance indicate readiness for additional training volume.",
      actionItems: [
        "Add 2x 20-minute HIIT sessions per week",
        "Focus on bike or rowing intervals",
        "Schedule on non-strength training days",
        "Monitor recovery between sessions",
      ],
      confidence: 78,
      dataPoints: [
        `${analysis.attendanceRate}% attendance rate`,
        "Consistent session performance",
        "No signs of overtraining",
      ],
      estimatedImpact: "Increase calorie burn by 300-400 per week",
      timeframe: "1-2 weeks",
    });
  }

  // Recovery Recommendation
  if (analysis.attendanceRate === 100 && data.recentSessions.length >= 4) {
    recommendations.push({
      id: "recovery-day",
      type: "recovery",
      priority: "medium",
      title: "Schedule Recovery Day",
      description:
        "Perfect attendance is great, but recovery is crucial for continued progress.",
      reasoning:
        "100% attendance with consistent high-intensity training may lead to overtraining without proper recovery.",
      actionItems: [
        "Add 1 complete rest day per week",
        "Include active recovery (light walking, yoga)",
        "Focus on sleep quality (7-9 hours)",
        "Consider massage or stretching session",
      ],
      confidence: 72,
      dataPoints: [
        "100% session attendance",
        "High training frequency",
        "Performance scores maintaining",
      ],
      estimatedImpact: "Prevent overtraining and improve performance",
      timeframe: "Immediate",
    });
  }

  // Workout Update Recommendation
  const workoutAge = data.currentWorkout.lastUpdated;
  const daysSinceUpdate = Math.floor(
    (new Date().getTime() - new Date(workoutAge).getTime()) /
      (1000 * 60 * 60 * 24),
  );

  if (daysSinceUpdate > 30) {
    recommendations.push({
      id: "workout-refresh",
      type: "workout",
      priority: "high",
      title: "Update Workout Program",
      description:
        "Current workout plan is over 30 days old. Time for new challenges and exercise variety.",
      reasoning:
        "Body adapts to routines after 4-6 weeks. New exercises prevent plateaus and maintain engagement.",
      actionItems: [
        "Design new exercise selection",
        "Adjust rep ranges and sets",
        "Introduce new movement patterns",
        "Update based on progress and goals",
      ],
      confidence: 90,
      dataPoints: [
        `Workout last updated ${daysSinceUpdate} days ago`,
        "Progress trend showing adaptation",
        "Client ready for new challenges",
      ],
      estimatedImpact: "Renewed progress and motivation",
      timeframe: "Next session",
    });
  }

  // Goal Adjustment Recommendation
  if (analysis.goalProgress > 75 && analysis.progressTrend === "improving") {
    recommendations.push({
      id: "goal-adjustment",
      type: "schedule",
      priority: "low",
      title: "Consider Goal Advancement",
      description:
        "Excellent progress toward current goals. Consider setting more ambitious targets.",
      reasoning:
        "Client is exceeding expectations and may benefit from more challenging goals to maintain motivation.",
      actionItems: [
        "Discuss new target weight/body fat goals",
        "Set performance-based goals (strength, endurance)",
        "Plan advanced training phases",
        "Celebrate current achievements first",
      ],
      confidence: 68,
      dataPoints: [
        `${analysis.goalProgress}% goal completion`,
        "Consistent improvement trend",
        "High client engagement",
      ],
      estimatedImpact: "Sustained long-term motivation",
      timeframe: "Next goal review meeting",
    });
  }

  return recommendations.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
};

const generateKeyInsights = (data: any, analysis: ClientAnalysis): string[] => {
  const insights: string[] = [];

  if (analysis.attendanceRate >= 90) {
    insights.push(
      "🎯 Exceptional attendance shows high motivation and commitment",
    );
  } else if (analysis.attendanceRate >= 70) {
    insights.push(
      "✅ Good attendance rate, minor schedule optimization opportunities",
    );
  } else {
    insights.push(
      "⚠️ Attendance below optimal - consider scheduling adjustments",
    );
  }

  if (analysis.progressTrend === "improving") {
    insights.push(
      "📈 Progress trending positively - current approach is working well",
    );
  } else if (analysis.progressTrend === "plateauing") {
    insights.push(
      "🔄 Progress has plateaued - program adjustments recommended",
    );
  } else {
    insights.push("📉 Progress declining - immediate program review needed");
  }

  if (analysis.goalProgress > 50) {
    insights.push(
      `🏆 ${analysis.goalProgress}% goal completion - excellent trajectory`,
    );
  } else {
    insights.push(
      "🎯 Goal progress slower than expected - strategy review recommended",
    );
  }

  const avgPerformance =
    data.recentSessions.reduce(
      (sum: number, session: any) => sum + session.performance,
      0,
    ) / data.recentSessions.length;

  if (avgPerformance > 85) {
    insights.push(
      "💪 High session performance indicates client is ready for new challenges",
    );
  } else if (avgPerformance < 70) {
    insights.push(
      "⚡ Performance scores suggest need for program modification or recovery",
    );
  }

  return insights;
};

// Utility function to get priority color for UI
export const getPriorityColor = (priority: Recommendation["priority"]) => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800 border-red-200";
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "low":
      return "bg-blue-100 text-blue-800 border-blue-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export const getTypeIcon = (type: Recommendation["type"]) => {
  switch (type) {
    case "workout":
      return "🏋️";
    case "cardio":
      return "🏃";
    case "recovery":
      return "😴";
    case "nutrition":
      return "🥗";
    case "schedule":
      return "📅";
    default:
      return "💡";
  }
};
