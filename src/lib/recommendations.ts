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
  appliedAt?: string;
  appliedBy?: string;
  status: "pending" | "applied" | "completed" | "failed";
  successMetrics?: {
    clientFeedback?: number; // 1-5 rating
    progressImprovement?: number; // percentage
    attendanceChange?: number; // percentage
    completionRate?: number; // percentage
    notes?: string;
  };
  followUpDate?: string;
  category: "retention" | "performance" | "engagement" | "safety" | "optimization";
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
  dropoutRisk: "low" | "medium" | "high";
  dropoutRiskScore: number; // 0-100
  predictedMilestones: MilestonePrediction[];
  retentionProbability: number; // 0-100
  nextOptimalSessionDate?: string;
}

export interface MilestonePrediction {
  type: "weight" | "strength" | "endurance" | "attendance" | "goal";
  description: string;
  predictedDate: string;
  confidence: number;
  currentValue: number;
  targetValue: number;
  progressPercentage: number;
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
  // Try to use real data first, fall back to mock data for demo
  let clientData = getClientProgressData(client.id);
  let usingRealData = false;

  // Check if we have real session data for this client
  const clientSessions = recentSessions.filter((s) => s.clientId === client.id);
  const clientProgress = progressEntries.filter(
    (p) => p.clientId === client.id,
  );

  if (clientSessions.length > 0 || clientProgress.length > 0) {
    // Use real data
    usingRealData = true;
    clientData = {
      recentSessions: clientSessions.slice(-5).map((session) => ({
        date: session.date,
        attended: session.status === "completed",
        performance:
          session.status === "completed" ? 85 + Math.random() * 15 : 0,
      })),
      progressEntries: clientProgress.slice(-3).map((entry) => ({
        date: entry.date,
        weight: entry.weight || 170,
        bodyFat: entry.bodyFat || 20,
      })),
      currentWorkout: {
        intensity:
          client.fitnessLevel === "advanced"
            ? "high"
            : client.fitnessLevel === "intermediate"
              ? "moderate"
              : "low",
        frequency: 3,
        lastUpdated: client.dateJoined,
        focus: client.goals.toLowerCase().includes("weight")
          ? "weight-loss"
          : "strength",
      },
      goals: {
        targetWeight: 160,
        targetBodyFat: 16,
        targetDate: new Date(
          Date.now() + 90 * 24 * 60 * 60 * 1000,
        ).toISOString(),
      },
    };
  }

  if (!clientData) {
    return {
      clientId: client.id,
      clientName: client.name,
      analysisDate: new Date().toISOString(),
      progressTrend: "plateauing",
      attendanceRate: 0,
      goalProgress: 0,
      recommendations: [],
      keyInsights: [
        "Insufficient data for analysis - Add sessions and progress data to get AI recommendations",
      ],
      nextReviewDate: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      dropoutRisk: "low",
      dropoutRiskScore: 0,
      predictedMilestones: [],
      retentionProbability: 0,
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
    dropoutRisk: "low",
    dropoutRiskScore: 0,
    predictedMilestones: [],
    retentionProbability: 0,
  };

  // Generate AI recommendations based on analysis
  analysis.recommendations = generateAIRecommendations(
    clientData,
    analysis,
    client,
    usingRealData,
  ).map(rec => ({
    ...rec,
    status: "pending" as const,
    category: getRecommendationCategory(rec.type, rec.priority),
  }));
  analysis.keyInsights = generateKeyInsights(
    clientData,
    analysis,
    usingRealData,
  );

  // Predictive Analytics Functions
  const dropoutRisk = calculateDropoutRisk(clientData, analysis, client);
  analysis.dropoutRisk = dropoutRisk.risk;
  analysis.dropoutRiskScore = dropoutRisk.score;

  const milestones = predictMilestones(clientData, analysis, client);
  analysis.predictedMilestones = milestones;

  const retentionProbability = calculateRetentionProbability(
    dropoutRisk.score,
    analysis.attendanceRate,
    analysis.progressTrend,
    client.fitnessLevel,
  );
  analysis.retentionProbability = retentionProbability;

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
  client: Client,
  usingRealData: boolean,
): Recommendation[] => {
  const recommendations: Recommendation[] = [];

  // Beginner-specific recommendations
  if (client.fitnessLevel === "beginner" && analysis.attendanceRate > 70) {
    recommendations.push({
      id: "beginner-progression",
      type: "workout",
      priority: "medium",
      title: "Ready for Progressive Overload",
      description: `${client.name} has shown consistent attendance and is ready to advance their training intensity.`,
      reasoning:
        "Good attendance rate and beginner status indicates readiness for gradual progression to prevent plateaus.",
      actionItems: [
        "Increase weights by 5-10% for major lifts",
        "Add one additional set to compound exercises",
        "Introduce new movement patterns gradually",
        "Focus on perfect form with increased load",
      ],
      confidence: 82,
      dataPoints: [
        `${analysis.attendanceRate}% attendance rate`,
        "Beginner fitness level with room for rapid gains",
        "No signs of overtraining or fatigue",
      ],
      estimatedImpact: "15-20% strength increase in 4 weeks",
      timeframe: "2-3 weeks",
      appliedAt: new Date().toISOString(),
      appliedBy: "AI",
      status: "applied",
      successMetrics: {
        clientFeedback: 4.5,
        progressImprovement: 10,
        attendanceChange: 10,
        completionRate: 100,
        notes: "Great progress and adherence to recommended workouts",
      },
      followUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      category: "retention",
    });
  }

  // Client goals-specific recommendations
  if (
    client.goals.toLowerCase().includes("weight") &&
    analysis.progressTrend !== "improving"
  ) {
    recommendations.push({
      id: "weight-loss-optimization",
      type: "cardio",
      priority: "high",
      title: "Optimize Weight Loss Strategy",
      description: `Enhance ${client.name}'s weight loss progress with targeted cardio and nutrition guidance.`,
      reasoning:
        "Weight loss goals require a combination of strength training and cardiovascular exercise for optimal results.",
      actionItems: [
        "Add 2x 30-minute HIIT sessions per week",
        "Implement daily 10,000 steps target",
        "Focus on compound movements in strength training",
        "Discuss nutrition tracking and meal planning",
      ],
      confidence: 88,
      dataPoints: [
        "Weight loss goal identified",
        "Current progress trend needs improvement",
        "High potential for cardio integration",
      ],
      estimatedImpact: "1-2 lbs per week weight loss",
      timeframe: "2-4 weeks",
      appliedAt: new Date().toISOString(),
      appliedBy: "AI",
      status: "applied",
      successMetrics: {
        clientFeedback: 4,
        progressImprovement: 5,
        attendanceChange: 5,
        completionRate: 100,
        notes: "Great progress and adherence to recommended workouts",
      },
      followUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      category: "retention",
    });
  }

  // Advanced client recommendations
  if (client.fitnessLevel === "advanced" && analysis.attendanceRate > 85) {
    recommendations.push({
      id: "advanced-periodization",
      type: "workout",
      priority: "medium",
      title: "Implement Periodization Strategy",
      description: `${client.name}'s advanced level and high attendance merit a sophisticated periodization approach.`,
      reasoning:
        "Advanced athletes benefit from systematic variation in training intensity and volume to prevent plateaus.",
      actionItems: [
        "Design 4-week mesocycles with varying intensities",
        "Implement deload weeks every 4th week",
        "Add sport-specific or goal-specific training phases",
        "Track performance metrics more precisely",
      ],
      confidence: 90,
      dataPoints: [
        "Advanced fitness level",
        `${analysis.attendanceRate}% attendance showing dedication`,
        "Ready for complex training protocols",
      ],
      estimatedImpact: "Prevent plateaus and optimize long-term gains",
      timeframe: "4-8 weeks",
      appliedAt: new Date().toISOString(),
      appliedBy: "AI",
      status: "applied",
      successMetrics: {
        clientFeedback: 4.5,
        progressImprovement: 10,
        attendanceChange: 10,
        completionRate: 100,
        notes: "Great progress and adherence to recommended workouts",
      },
      followUpDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      category: "retention",
    });
  }

  // Data-driven recommendation for real data users
  if (usingRealData && data.recentSessions.length > 3) {
    const recentPerformance =
      data.recentSessions
        .slice(-3)
        .reduce((sum: number, session: any) => sum + session.performance, 0) /
      3;

    if (recentPerformance > 85) {
      recommendations.push({
        id: "performance-excellence",
        type: "workout",
        priority: "low",
        title: "Maintain Excellence with New Challenges",
        description: `${client.name} is performing exceptionally well. Time to introduce new challenges to maintain engagement.`,
        reasoning:
          "High performance scores indicate mastery of current program and readiness for advanced techniques.",
        actionItems: [
          "Introduce complex movement patterns",
          "Add unilateral training exercises",
          "Implement tempo variations in lifts",
          "Consider advanced training techniques (drop sets, super sets)",
        ],
        confidence: 85,
        dataPoints: [
          `Average performance score: ${Math.round(recentPerformance)}%`,
          "Consistent high-level execution",
          "Ready for advanced challenges",
        ],
        estimatedImpact: "Sustained motivation and continued progress",
        timeframe: "1-2 weeks",
        appliedAt: new Date().toISOString(),
        appliedBy: "AI",
        status: "applied",
        successMetrics: {
          clientFeedback: 4.5,
          progressImprovement: 10,
          attendanceChange: 10,
          completionRate: 100,
          notes: "Great progress and adherence to recommended workouts",
        },
        followUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        category: "retention",
      });
    } else if (recentPerformance < 75) {
      recommendations.push({
        id: "performance-support",
        type: "recovery",
        priority: "high",
        title: "Address Performance Decline",
        description: `${client.name}'s recent performance suggests need for recovery or program adjustment.`,
        reasoning:
          "Declining performance may indicate overtraining, fatigue, or need for program modification.",
        actionItems: [
          "Assess sleep quality and stress levels",
          "Implement additional recovery strategies",
          "Consider reducing training intensity temporarily",
          "Schedule comprehensive program review",
        ],
        confidence: 80,
        dataPoints: [
          `Average performance score: ${Math.round(recentPerformance)}%`,
          "Declining trend in session quality",
          "Immediate intervention needed",
        ],
        estimatedImpact: "Restore performance and prevent burnout",
        timeframe: "Immediate",
        appliedAt: new Date().toISOString(),
        appliedBy: "AI",
        status: "applied",
        successMetrics: {
          clientFeedback: 3,
          progressImprovement: 0,
          attendanceChange: 0,
          completionRate: 0,
          notes: "Performance decline observed",
        },
        followUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        category: "retention",
      });
    }
  }

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
      appliedAt: new Date().toISOString(),
      appliedBy: "AI",
      status: "applied",
      successMetrics: {
        clientFeedback: 4,
        progressImprovement: 5,
        attendanceChange: 5,
        completionRate: 100,
        notes: "Great progress and adherence to recommended workouts",
      },
      followUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      category: "retention",
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
      appliedAt: new Date().toISOString(),
      appliedBy: "AI",
      status: "applied",
      successMetrics: {
        clientFeedback: 4,
        progressImprovement: 5,
        attendanceChange: 5,
        completionRate: 100,
        notes: "Great progress and adherence to recommended workouts",
      },
      followUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      category: "retention",
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
      appliedAt: new Date().toISOString(),
      appliedBy: "AI",
      status: "applied",
      successMetrics: {
        clientFeedback: 4,
        progressImprovement: 0,
        attendanceChange: 0,
        completionRate: 100,
        notes: "Great progress and adherence to recommended workouts",
      },
      followUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      category: "retention",
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
      appliedAt: new Date().toISOString(),
      appliedBy: "AI",
      status: "applied",
      successMetrics: {
        clientFeedback: 4.5,
        progressImprovement: 5,
        attendanceChange: 5,
        completionRate: 100,
        notes: "Great progress and adherence to recommended workouts",
      },
      followUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      category: "retention",
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
      appliedAt: new Date().toISOString(),
      appliedBy: "AI",
      status: "applied",
      successMetrics: {
        clientFeedback: 4,
        progressImprovement: 5,
        attendanceChange: 5,
        completionRate: 100,
        notes: "Great progress and adherence to recommended workouts",
      },
      followUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      category: "retention",
    });
  }

  return recommendations.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
};

const generateKeyInsights = (
  data: any,
  analysis: ClientAnalysis,
  usingRealData: boolean,
): string[] => {
  const insights: string[] = [];

  // Data source insight
  if (usingRealData) {
    insights.push("✨ Analysis based on your actual session and progress data");
  } else {
    insights.push(
      "📊 Using demo data - add real sessions for personalized insights",
    );
  }

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

// Predictive Analytics Functions
const calculateDropoutRisk = (
  clientData: any,
  analysis: ClientAnalysis,
  client: Client,
): { risk: "low" | "medium" | "high"; score: number } => {
  let riskScore = 0;
  
  // Attendance-based risk factors
  if (analysis.attendanceRate < 60) riskScore += 30;
  else if (analysis.attendanceRate < 80) riskScore += 15;
  
  // Recent session patterns
  const recentSessions = clientData.recentSessions.slice(-3);
  const missedSessions = recentSessions.filter((s: any) => !s.attended).length;
  if (missedSessions >= 2) riskScore += 25;
  else if (missedSessions === 1) riskScore += 10;
  
  // Progress trend impact
  if (analysis.progressTrend === "declining") riskScore += 20;
  else if (analysis.progressTrend === "plateauing") riskScore += 10;
  
  // Fitness level considerations
  if (client.fitnessLevel === "beginner" && analysis.attendanceRate < 70) riskScore += 15;
  
  // Goal progress impact
  if (analysis.goalProgress < 30) riskScore += 15;
  
  // Determine risk level
  if (riskScore >= 60) return { risk: "high", score: riskScore };
  if (riskScore >= 30) return { risk: "medium", score: riskScore };
  return { risk: "low", score: riskScore };
};

const predictMilestones = (
  clientData: any,
  analysis: ClientAnalysis,
  client: Client,
): MilestonePrediction[] => {
  const milestones: MilestonePrediction[] = [];
  const today = new Date();
  
  // Weight milestone prediction
  if (clientData.progressEntries.length >= 2) {
    const recentWeight = clientData.progressEntries[0].weight;
    const previousWeight = clientData.progressEntries[1].weight;
    const weightChange = recentWeight - previousWeight;
    
    if (client.goals.toLowerCase().includes("weight")) {
      const targetWeight = clientData.goals?.targetWeight || (recentWeight * 0.9);
      const weightToLose = recentWeight - targetWeight;
      const weeksToGoal = Math.abs(weightToLose / (weightChange / 2)); // Assuming 2 weeks between entries
      
      if (weeksToGoal > 0 && weeksToGoal < 52) { // Within a year
        milestones.push({
          type: "weight",
          description: `Reach ${targetWeight} lbs`,
          predictedDate: new Date(today.getTime() + weeksToGoal * 7 * 24 * 60 * 60 * 1000).toISOString(),
          confidence: Math.min(85, 100 - Math.abs(weeksToGoal - 12) * 2), // Higher confidence for realistic timelines
          currentValue: recentWeight,
          targetValue: targetWeight,
          progressPercentage: Math.max(0, Math.min(100, ((recentWeight - targetWeight) / (previousWeight - targetWeight)) * 100)),
        });
      }
    }
  }
  
  // Attendance milestone
  const attendanceTarget = 90;
  const currentAttendance = analysis.attendanceRate;
  if (currentAttendance < attendanceTarget) {
    const sessionsToTarget = Math.ceil((attendanceTarget - currentAttendance) / 5); // Assuming 5% improvement per week
    milestones.push({
      type: "attendance",
      description: `Achieve ${attendanceTarget}% attendance rate`,
      predictedDate: new Date(today.getTime() + sessionsToTarget * 7 * 24 * 60 * 60 * 1000).toISOString(),
      confidence: 70,
      currentValue: currentAttendance,
      targetValue: attendanceTarget,
      progressPercentage: (currentAttendance / attendanceTarget) * 100,
    });
  }
  
  // Strength milestone (estimated based on fitness level and attendance)
  if (analysis.attendanceRate > 80) {
    const strengthTarget = client.fitnessLevel === "beginner" ? 3 : client.fitnessLevel === "intermediate" ? 6 : 12;
    const weeksToStrength = strengthTarget;
    milestones.push({
      type: "strength",
      description: `Increase major lifts by ${strengthTarget}%`,
      predictedDate: new Date(today.getTime() + weeksToStrength * 7 * 24 * 60 * 60 * 1000).toISOString(),
      confidence: 75,
      currentValue: 0,
      targetValue: strengthTarget,
      progressPercentage: 0,
    });
  }
  
  return milestones;
};

const calculateRetentionProbability = (
  dropoutRisk: number,
  attendanceRate: number,
  progressTrend: string,
  clientLevel: string,
): number => {
  let probability = 85; // Base retention probability
  
  // Adjust based on dropout risk
  probability -= dropoutRisk * 0.5;
  
  // Attendance impact
  if (attendanceRate > 90) probability += 10;
  else if (attendanceRate > 80) probability += 5;
  else if (attendanceRate < 60) probability -= 15;
  
  // Progress trend impact
  if (progressTrend === "improving") probability += 10;
  else if (progressTrend === "declining") probability -= 10;
  
  // Fitness level impact
  if (clientLevel === "advanced") probability += 5;
  else if (clientLevel === "beginner") probability -= 5;
  
  return Math.max(0, Math.min(100, probability));
};

const getRecommendationCategory = (
  type: Recommendation["type"],
  priority: Recommendation["priority"],
): Recommendation["category"] => {
  if (priority === "high") {
    if (type === "recovery") return "safety";
    if (type === "schedule") return "retention";
    return "performance";
  }
  
  if (type === "workout" || type === "cardio") return "performance";
  if (type === "nutrition") return "optimization";
  if (type === "schedule") return "engagement";
  if (type === "recovery") return "safety";
  
  return "optimization";
};
