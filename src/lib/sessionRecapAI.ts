import { SessionRecap, Client } from "./types";

interface TrainerFormData {
  workoutFocus: string;
  exercisesCompleted: string[];
  clientPerformance: "excellent" | "good" | "average" | "needs-improvement";
  clientMood: "energetic" | "motivated" | "neutral" | "tired" | "stressed";
  achievementsToday: string;
  challengesFaced: string;
  notesForNextSession: string;
  progressObservations: string;
}

// AI-powered recap generation
export const generateSessionRecap = async (
  trainerForm: TrainerFormData,
  client: Client,
  sessionType: string,
): Promise<SessionRecap["aiGeneratedContent"]> => {
  // Simulate AI processing delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // In a real implementation, this would call an AI service like OpenAI GPT
  // For now, we'll use intelligent templates with dynamic content

  const performanceAdjectives = {
    excellent: ["outstanding", "exceptional", "phenomenal", "incredible"],
    good: ["solid", "strong", "impressive", "commendable"],
    average: ["steady", "consistent", "reliable", "determined"],
    "needs-improvement": [
      "dedicated",
      "persistent",
      "hardworking",
      "committed",
    ],
  };

  const moodResponseMap = {
    energetic: "Your energy today was contagious! 🔋",
    motivated: "Your motivation really showed in every rep! 💪",
    neutral: "You stayed focused and got the work done! 🎯",
    tired: "Despite feeling tired, you pushed through like a champion! 🏆",
    stressed: "You used the workout to channel stress into strength! 💥",
  };

  const levelSpecificEncouragement = {
    beginner:
      "Every expert was once a beginner. You're building something amazing!",
    intermediate:
      "You're really hitting your stride. The progress is undeniable!",
    advanced: "Your dedication to excellence continues to inspire!",
  };

  const exercises = trainerForm.exercisesCompleted.join(", ");
  const performanceLevel = performanceAdjectives[trainerForm.clientPerformance];
  const randomPerformanceAdj =
    performanceLevel[Math.floor(Math.random() * performanceLevel.length)];

  // Generate workout summary
  const workoutSummary = `Today's ${sessionType.replace("-", " ")} session focused on ${trainerForm.workoutFocus.toLowerCase()}. ${client.name} completed ${exercises} with ${randomPerformanceAdj} form and technique. ${trainerForm.progressObservations}`;

  // Generate personalized encouragement
  const moodResponse = moodResponseMap[trainerForm.clientMood];
  const levelEncouragement = levelSpecificEncouragement[client.fitnessLevel];
  const personalizedEncouragement = `${client.name}, ${moodResponse} ${levelEncouragement} Your consistency is paying off, and today's achievements of "${trainerForm.achievementsToday}" prove you're on the right track toward your goal of ${client.goals.toLowerCase()}.`;

  // Generate next steps
  const nextStepsRecommendations = generateNextSteps(trainerForm, client);

  // Extract key achievements
  const keyAchievements = [
    trainerForm.achievementsToday,
    `Completed ${trainerForm.exercisesCompleted.length} exercises`,
    `${randomPerformanceAdj.charAt(0).toUpperCase() + randomPerformanceAdj.slice(1)} performance rating`,
  ];

  // Generate motivational quote
  const motivationalQuotes = [
    "\"Strength doesn't come from what you can do. It comes from overcoming the things you once thought you couldn't.\" - Rikki Rogers",
    '"The groundwork for all happiness is good health." - Leigh Hunt',
    '"Take care of your body. It\'s the only place you have to live." - Jim Rohn',
    '"A healthy outside starts from the inside." - Robert Urich',
    '"Your body can do it. It\'s your mind you need to convince." - Unknown',
  ];
  const motivationalQuote =
    motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  // Generate progress highlight
  const progressHighlight = generateProgressHighlight(trainerForm, client);

  return {
    workoutSummary,
    personalizedEncouragement,
    nextStepsRecommendations,
    keyAchievements,
    motivationalQuote,
    progressHighlight,
  };
};

const generateNextSteps = (form: TrainerFormData, client: Client): string => {
  const suggestions = [];

  if (form.clientPerformance === "excellent") {
    suggestions.push("Consider increasing intensity or adding new challenges");
  } else if (form.clientPerformance === "needs-improvement") {
    suggestions.push("Focus on form refinement and gradual progression");
  }

  if (form.clientMood === "tired" || form.clientMood === "stressed") {
    suggestions.push("Prioritize recovery and stress management techniques");
  } else if (form.clientMood === "energetic") {
    suggestions.push("Channel this energy into compound movements");
  }

  if (form.challengesFaced) {
    suggestions.push(
      `Address the challenge: ${form.challengesFaced.toLowerCase()}`,
    );
  }

  if (form.notesForNextSession) {
    suggestions.push(form.notesForNextSession);
  }

  return suggestions.length > 0
    ? `For next session: ${suggestions.join("; ")}.`
    : "Continue building on today's momentum with consistent progression.";
};

const generateProgressHighlight = (
  form: TrainerFormData,
  client: Client,
): string => {
  const highlights = [
    `${client.name} is showing consistent improvement in ${form.workoutFocus.toLowerCase()}`,
    `Building strength and confidence with each session`,
    `Making steady progress toward ${client.goals.toLowerCase()}`,
    `Developing better movement patterns and technique`,
  ];

  return highlights[Math.floor(Math.random() * highlights.length)];
};

// Generate shareable client summary (shorter version)
export const generateClientSummary = (
  recap: SessionRecap["aiGeneratedContent"],
  clientName: string,
): string => {
  return `🎯 **Workout Complete, ${clientName}!**

${recap.workoutSummary}

**Today's Wins:**
${recap.keyAchievements.map((achievement) => `• ${achievement}`).join("\n")}

**Your Coach Says:**
${recap.personalizedEncouragement}

**Next Up:**
${recap.nextStepsRecommendations}

---
${recap.motivationalQuote}

Keep crushing it! 💪`;
};
