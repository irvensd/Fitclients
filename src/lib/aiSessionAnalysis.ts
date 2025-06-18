import { Client, Session } from "./types";

export interface SessionAnalysis {
  sessionId: string;
  clientId: string;
  analysisDate: string;
  performanceScore: number;
  mood: "excellent" | "good" | "average" | "needs-support";
  insights: string[];
  nextSessionRecommendations: string[];
  clientMotivation: string;
  trainerNotes: string[];
}

export const analyzeSession = (
  session: Session,
  client: Client,
  recentSessions: Session[] = [],
): SessionAnalysis => {
  // Calculate performance based on session completion and type
  const performanceScore = calculatePerformanceScore(session);

  // Determine mood based on session data
  const mood = determineMood(session, performanceScore);

  // Generate insights based on session pattern
  const insights = generateSessionInsights(
    session,
    client,
    recentSessions,
    performanceScore,
  );

  // Create next session recommendations
  const nextSessionRecommendations = generateNextSessionRecommendations(
    session,
    client,
    mood,
  );

  // Generate motivational message for client
  const clientMotivation = generateClientMotivation(
    client,
    session,
    performanceScore,
  );

  // Generate notes for trainer
  const trainerNotes = generateTrainerNotes(session, client, recentSessions);

  return {
    sessionId: session.id,
    clientId: session.clientId,
    analysisDate: new Date().toISOString(),
    performanceScore,
    mood,
    insights,
    nextSessionRecommendations,
    clientMotivation,
    trainerNotes,
  };
};

const calculatePerformanceScore = (session: Session): number => {
  let score = 50; // Base score

  // Session completion boosts score
  if (session.status === "completed") {
    score += 30;
  } else if (session.status === "cancelled") {
    score -= 20;
  }

  // Session type affects scoring
  if (session.type === "Personal Training") {
    score += 10; // 1-on-1 typically means better performance
  }

  // Add some randomization for demo purposes
  score += Math.random() * 20 - 10;

  return Math.max(0, Math.min(100, Math.round(score)));
};

const determineMood = (
  session: Session,
  performanceScore: number,
): SessionAnalysis["mood"] => {
  if (session.status === "cancelled") return "needs-support";

  if (performanceScore >= 85) return "excellent";
  if (performanceScore >= 70) return "good";
  if (performanceScore >= 50) return "average";
  return "needs-support";
};

const generateSessionInsights = (
  session: Session,
  client: Client,
  recentSessions: Session[],
  performanceScore: number,
): string[] => {
  const insights: string[] = [];

  // Completion streak analysis
  const completedSessions = recentSessions.filter(
    (s) => s.status === "completed",
  ).length;
  if (completedSessions >= 3) {
    insights.push(
      `🔥 ${client.name} is on a ${completedSessions}-session completion streak!`,
    );
  }

  // Performance trend
  if (performanceScore >= 80) {
    insights.push(
      `💪 Strong performance today - ${client.name} is really hitting their stride`,
    );
  } else if (performanceScore < 60) {
    insights.push(
      `⚡ Performance below usual - may need energy boost or recovery focus`,
    );
  }

  // Session timing insights
  const sessionHour = new Date(`2024-01-01T${session.startTime}`).getHours();
  if (sessionHour < 8) {
    insights.push(
      "🌅 Early morning session - great dedication to starting the day strong",
    );
  } else if (sessionHour > 18) {
    insights.push("🌆 Evening session - excellent commitment after a full day");
  }

  // Fitness level progression
  if (client.fitnessLevel === "beginner" && performanceScore > 75) {
    insights.push(
      "🚀 Showing advanced beginner potential - ready for progression challenges",
    );
  } else if (client.fitnessLevel === "advanced" && performanceScore > 85) {
    insights.push(
      "🏆 Elite performance - maintaining high standards consistently",
    );
  }

  return insights;
};

const generateNextSessionRecommendations = (
  session: Session,
  client: Client,
  mood: SessionAnalysis["mood"],
): string[] => {
  const recommendations: string[] = [];

  // Based on mood
  switch (mood) {
    case "excellent":
      recommendations.push(
        "Challenge with increased intensity or new exercises",
      );
      recommendations.push("Introduce advanced movement patterns");
      break;
    case "good":
      recommendations.push(
        "Maintain current intensity with small progressions",
      );
      recommendations.push("Focus on technique refinement");
      break;
    case "average":
      recommendations.push("Review and solidify fundamentals");
      recommendations.push("Ensure adequate rest between sessions");
      break;
    case "needs-support":
      recommendations.push("Reduce intensity and focus on movement quality");
      recommendations.push("Check in on motivation and any external stressors");
      break;
  }

  // Based on goals
  if (client.goals.toLowerCase().includes("weight")) {
    recommendations.push("Include metabolic conditioning exercises");
  }

  if (client.goals.toLowerCase().includes("strength")) {
    recommendations.push("Progressive overload on compound movements");
  }

  // Session type specific
  if (session.type === "Personal Training") {
    recommendations.push("Prepare for focused 1-on-1 attention and feedback");
  }

  return recommendations;
};

const generateClientMotivation = (
  client: Client,
  session: Session,
  performanceScore: number,
): string => {
  const motivationalMessages = [
    `${client.name}, your consistency is paying off! Every session builds on the last.`,
    `Great work today, ${client.name}! You're making real progress toward your goals.`,
    `${client.name}, your dedication is inspiring. Keep pushing forward!`,
    `Excellent effort, ${client.name}! This is how champions are made.`,
    `${client.name}, you're stronger than you think. Today proved it!`,
  ];

  if (session.status === "cancelled") {
    return `Don't worry, ${client.name}. Life happens! Let's get back to it next session and continue your amazing journey.`;
  }

  if (performanceScore >= 85) {
    return `Outstanding work today, ${client.name}! You absolutely crushed it. Your dedication and effort are truly paying off. Keep this momentum going!`;
  }

  if (performanceScore < 60) {
    return `${client.name}, everyone has off days and that's completely normal. What matters is showing up. You're building resilience and that's just as important as building strength.`;
  }

  return motivationalMessages[
    Math.floor(Math.random() * motivationalMessages.length)
  ];
};

const generateTrainerNotes = (
  session: Session,
  client: Client,
  recentSessions: Session[],
): string[] => {
  const notes: string[] = [];

  // Attendance pattern
  const attendanceRate =
    recentSessions.filter((s) => s.status === "completed").length /
    Math.max(recentSessions.length, 1);
  if (attendanceRate > 0.8) {
    notes.push("High attendance rate - client is highly motivated");
  } else if (attendanceRate < 0.6) {
    notes.push(
      "Consider discussing schedule optimization or barriers to attendance",
    );
  }

  // Progression readiness
  if (
    client.fitnessLevel === "beginner" &&
    recentSessions.filter((s) => s.status === "completed").length >= 3
  ) {
    notes.push(
      "Client showing consistency - ready for gradual intensity increases",
    );
  }

  // Cancellation pattern
  const recentCancellations = recentSessions.filter(
    (s) => s.status === "cancelled",
  ).length;
  if (recentCancellations > 1) {
    notes.push(
      "Multiple recent cancellations - check in on schedule flexibility",
    );
  }

  // Goal alignment
  if (
    client.goals.toLowerCase().includes("weight") &&
    session.type === "Personal Training"
  ) {
    notes.push(
      "Focus on compound movements and metabolic training for weight loss goals",
    );
  }

  if (
    client.goals.toLowerCase().includes("strength") &&
    client.fitnessLevel === "advanced"
  ) {
    notes.push(
      "Advanced client with strength goals - consider periodization strategies",
    );
  }

  return notes;
};

// Function to get AI-powered session summary for display
export const getSessionSummary = (analysis: SessionAnalysis): string => {
  const moodEmojis = {
    excellent: "🔥",
    good: "💪",
    average: "👍",
    "needs-support": "🤝",
  };

  return `${moodEmojis[analysis.mood]} Performance: ${analysis.performanceScore}% | ${analysis.insights[0] || "Great effort today!"}`;
};

// Function to check if client needs attention based on AI analysis
export const needsAttention = (analyses: SessionAnalysis[]): boolean => {
  const recentAnalyses = analyses.slice(-3);
  const avgPerformance =
    recentAnalyses.reduce((sum, a) => sum + a.performanceScore, 0) /
    recentAnalyses.length;

  return (
    avgPerformance < 60 ||
    recentAnalyses.filter((a) => a.mood === "needs-support").length >= 2
  );
};
