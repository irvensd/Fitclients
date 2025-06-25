import { useState } from "react";
import { Button } from "@/components/ui/button";
import { StreakTracker } from "./StreakTracker";
import { Streak } from "@/lib/gamification";

export const StreakDemo = () => {
  const [currentStreak, setCurrentStreak] = useState(7);
  const [showCelebration, setShowCelebration] = useState(false);

  const demoStreak: Streak = {
    id: "demo-streak",
    type: "session",
    currentCount: currentStreak,
    bestCount: Math.max(currentStreak, 25),
    isActive: true,
    lastActivityDate: new Date().toISOString(),
    startDate: new Date(Date.now() - currentStreak * 24 * 60 * 60 * 1000).toISOString(),
    title: "Workout Sessions",
    description: "Consecutive days of completing workouts",
    icon: "💪",
  };

  const milestones = [7, 14, 30, 60, 100];

  return (
    <div className="space-y-6 p-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Streak Visualization Demo</h2>
        <p className="text-muted-foreground mb-6">
          Test different streak milestones and see the celebrations!
        </p>
      </div>

      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {milestones.map((milestone) => (
          <Button
            key={milestone}
            variant={currentStreak === milestone ? "default" : "outline"}
            onClick={() => {
              setCurrentStreak(milestone);
              setShowCelebration(true);
            }}
            className="min-w-[60px]"
          >
            {milestone} days
          </Button>
        ))}
      </div>

      <div className="max-w-2xl mx-auto">
        <StreakTracker 
          streaks={[demoStreak]} 
          variant="card" 
          showCelebration={showCelebration} 
        />
      </div>

      <div className="text-center space-y-4">
        <div className="bg-muted p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Features Demonstrated:</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Flame/emoji that grows with streak length</li>
            <li>• Glow effect for streaks 7+ days</li>
            <li>• Milestone celebrations with confetti</li>
            <li>• XP rewards and motivational messages</li>
            <li>• Social sharing options</li>
          </ul>
        </div>

        <Button 
          onClick={() => setShowCelebration(!showCelebration)}
          variant="outline"
        >
          {showCelebration ? "Hide" : "Show"} Celebration Mode
        </Button>
      </div>
    </div>
  );
}; 