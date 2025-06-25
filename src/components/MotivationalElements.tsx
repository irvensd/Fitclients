import React, { useState, useEffect } from 'react';
import { 
  Dumbbell, 
  Heart, 
  Target, 
  Trophy, 
  Star,
  Activity,
  TrendingUp,
  CheckCircle,
  Zap,
  Award,
  Crown
} from 'lucide-react';

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  delay: number;
}

interface Achievement {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

const MotivationalElements: React.FC = () => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  // Fitness-themed illustrations
  const fitnessIllustrations = [
    { icon: <Dumbbell className="h-8 w-8" />, color: 'text-blue-500', label: 'Strength' },
    { icon: <Activity className="h-8 w-8" />, color: 'text-green-500', label: 'Cardio' },
    { icon: <Target className="h-8 w-8" />, color: 'text-purple-500', label: 'Goals' },
    { icon: <Heart className="h-8 w-8" />, color: 'text-red-500', label: 'Health' },
    { icon: <TrendingUp className="h-8 w-8" />, color: 'text-orange-500', label: 'Progress' },
  ];

  // Sample achievements
  const sampleAchievements: Achievement[] = [
    {
      id: 1,
      icon: <Trophy className="h-6 w-6" />,
      title: "First Client",
      description: "Welcome your first client to FitClient!",
      color: "bg-yellow-500"
    },
    {
      id: 2,
      icon: <Star className="h-6 w-6" />,
      title: "5 Sessions",
      description: "Completed 5 training sessions",
      color: "bg-blue-500"
    },
    {
      id: 3,
      icon: <Target className="h-6 w-6" />,
      title: "Goal Setter",
      description: "Set goals for 3 clients",
      color: "bg-green-500"
    },
    {
      id: 4,
      icon: <Crown className="h-6 w-6" />,
      title: "Pro Trainer",
      description: "Manage 10+ clients",
      color: "bg-purple-500"
    }
  ];

  // Generate confetti
  const generateConfetti = () => {
    const pieces: ConfettiPiece[] = [];
    for (let i = 0; i < 50; i++) {
      pieces.push({
        id: i,
        x: Math.random() * 100,
        y: -10,
        color: ['#fbbf24', '#ef4444', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'][Math.floor(Math.random() * 6)],
        size: Math.random() * 8 + 4,
        delay: Math.random() * 2,
      });
    }
    setConfetti(pieces);
    setShowConfetti(true);
    
    setTimeout(() => {
      setShowConfetti(false);
    }, 3000);
  };

  // Simulate achievement unlock
  useEffect(() => {
    const timer = setTimeout(() => {
      setAchievements(sampleAchievements.slice(0, 2));
      generateConfetti();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative">
      {/* Fitness Illustrations Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-4 mb-6 sm:mb-8">
        {fitnessIllustrations.map((illustration, index) => (
          <div
            key={index}
            className="flex flex-col items-center p-2 sm:p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 touch-manipulation"
          >
            <div className={`${illustration.color} mb-1 sm:mb-2 animate-pulse`} style={{ animationDelay: `${index * 0.2}s` }}>
              <div className="h-6 w-6 sm:h-8 sm:w-8">
                {illustration.icon}
              </div>
            </div>
            <span className="text-xs font-medium text-gray-600 text-center">{illustration.label}</span>
          </div>
        ))}
      </div>

      {/* Achievement Unlock Animations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {achievements.map((achievement, index) => (
          <div
            key={achievement.id}
            className="bg-white rounded-lg shadow-md p-3 sm:p-4 border-l-4 border-green-500 opacity-0 animate-slideIn"
            style={{ animationDelay: `${index * 0.5}s` }}
          >
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className={`${achievement.color} text-white p-1.5 sm:p-2 rounded-full flex-shrink-0`}>
                <div className="h-4 w-4 sm:h-6 sm:w-6">
                  {achievement.icon}
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{achievement.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{achievement.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Visualization with Before/After Style */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-center">Client Progress Journey</h3>
        <div className="flex items-center justify-between space-x-2 sm:space-x-4">
          <div className="flex-1 text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-full mx-auto mb-1 sm:mb-2 flex items-center justify-center">
              <span className="text-gray-500 text-xs sm:text-sm">Before</span>
            </div>
            <p className="text-xs text-gray-600">Starting Point</p>
          </div>
          
          <div className="flex-1 relative">
            <div className="h-1.5 sm:h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full transition-all duration-1000"
                style={{ width: '75%' }}
              >
                {/* Animated particles in progress bar - reduced on mobile */}
                <div className="absolute inset-0">
                  {[...Array(2)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-0.5 h-0.5 sm:w-1 sm:h-1 bg-white rounded-full animate-ping"
                      style={{
                        left: `${20 + i * 30}%`,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        animationDelay: `${i * 0.3}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="text-center mt-1 sm:mt-2">
              <span className="text-xs sm:text-sm font-medium text-green-600">75% Complete</span>
            </div>
          </div>
          
          <div className="flex-1 text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mx-auto mb-1 sm:mb-2 flex items-center justify-center">
              <CheckCircle className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
            </div>
            <p className="text-xs text-gray-600">Goal Achieved</p>
          </div>
        </div>
      </div>

      {/* Celebration Confetti - reduced on mobile for performance */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {confetti.slice(0, 25).map((piece) => (
            <div
              key={piece.id}
              className="absolute animate-bounce"
              style={{
                left: `${piece.x}%`,
                top: `${piece.y}%`,
                backgroundColor: piece.color,
                width: piece.size,
                height: piece.size,
                borderRadius: '50%',
                animationDelay: `${piece.delay}s`,
                animationDuration: '3s',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MotivationalElements; 