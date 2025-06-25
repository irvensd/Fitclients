import React, { useEffect, useState } from 'react';
import { 
  Dumbbell, 
  Heart, 
  Target, 
  Trophy, 
  Zap, 
  Star,
  Activity,
  TrendingUp
} from 'lucide-react';

interface FloatingBadge {
  id: number;
  icon: React.ReactNode;
  x: number;
  y: number;
  delay: number;
  size: number;
}

interface AnimatedIcon {
  id: number;
  icon: React.ReactNode;
  x: number;
  y: number;
  pulseDelay: number;
  size: number;
}

const AnimatedHero: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);
  const [progress, setProgress] = useState(0);
  const [gradientPosition, setGradientPosition] = useState(0);

  // Floating achievement badges
  const floatingBadges: FloatingBadge[] = [
    { id: 1, icon: <Trophy className="h-4 w-4" />, x: 10, y: 20, delay: 0, size: 16 },
    { id: 2, icon: <Star className="h-4 w-4" />, x: 85, y: 15, delay: 1, size: 14 },
    { id: 3, icon: <Target className="h-4 w-4" />, x: 15, y: 80, delay: 2, size: 18 },
    { id: 4, icon: <Heart className="h-4 w-4" />, x: 80, y: 75, delay: 3, size: 15 },
    { id: 5, icon: <Zap className="h-4 w-4" />, x: 50, y: 10, delay: 4, size: 16 },
  ];

  // Animated fitness icons
  const animatedIcons: AnimatedIcon[] = [
    { id: 1, icon: <Dumbbell className="h-6 w-6" />, x: 5, y: 30, pulseDelay: 0, size: 24 },
    { id: 2, icon: <Activity className="h-6 w-6" />, x: 90, y: 25, pulseDelay: 1, size: 24 },
    { id: 3, icon: <TrendingUp className="h-6 w-6" />, x: 20, y: 70, pulseDelay: 2, size: 24 },
    { id: 4, icon: <Target className="h-6 w-6" />, x: 75, y: 65, pulseDelay: 3, size: 24 },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const handleProgress = () => {
      const scrolled = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progressPercent = (scrolled / maxScroll) * 100;
      setProgress(Math.min(progressPercent, 100));
    };

    // Animate gradient
    const gradientInterval = setInterval(() => {
      setGradientPosition(prev => (prev + 1) % 100);
    }, 100);

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('scroll', handleProgress);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', handleProgress);
      clearInterval(gradientInterval);
    };
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* Animated gradient background */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          background: `linear-gradient(45deg, 
            rgba(34, 197, 94, 0.1) 0%, 
            rgba(59, 130, 246, 0.1) 33%, 
            rgba(147, 51, 234, 0.1) 66%, 
            rgba(236, 72, 153, 0.1) 100%)`,
          backgroundPosition: `${gradientPosition}% 50%`,
          transition: 'background-position 0.1s ease-out',
        }}
      />

      {/* Floating achievement badges - hidden on mobile for better performance */}
      {floatingBadges.map((badge) => (
        <div
          key={badge.id}
          className="absolute hidden md:block animate-bounce"
          style={{
            left: `${badge.x}%`,
            top: `${badge.y}%`,
            animationDelay: `${badge.delay}s`,
            animationDuration: '3s',
            transform: `translateY(${scrollY * 0.1}px)`,
          }}
        >
          <div 
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full p-2 shadow-lg"
            style={{ width: badge.size, height: badge.size }}
          >
            {badge.icon}
          </div>
        </div>
      ))}

      {/* Animated fitness icons - hidden on mobile for better performance */}
      {animatedIcons.map((icon) => (
        <div
          key={icon.id}
          className="absolute hidden md:block"
          style={{
            left: `${icon.x}%`,
            top: `${icon.y}%`,
            transform: `translateY(${scrollY * 0.05}px)`,
          }}
        >
          <div 
            className="text-primary animate-pulse"
            style={{
              animationDelay: `${icon.pulseDelay}s`,
              animationDuration: '2s',
            }}
          >
            {icon.icon}
          </div>
        </div>
      ))}

      {/* Animated progress bar with particles - mobile optimized */}
      <div className="fixed top-0 left-0 w-full h-0.5 sm:h-1 bg-gray-200 z-50">
        <div 
          className="h-full bg-gradient-to-r from-green-500 via-blue-500 to-purple-600 transition-all duration-300 relative overflow-hidden"
          style={{ width: `${progress}%` }}
        >
          {/* Animated particles - reduced on mobile for performance */}
          <div className="absolute inset-0">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute w-0.5 h-0.5 sm:w-1 sm:h-1 bg-white rounded-full animate-ping"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: '2s',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedHero; 