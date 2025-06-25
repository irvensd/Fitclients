import React from 'react';
import { 
  Zap, 
  Target, 
  Trophy, 
  Star,
  TrendingUp,
  Heart,
  Award,
  Crown
} from 'lucide-react';

const ColorPsychology: React.FC = () => {
  // Energy colors for motivation and intensity
  const energyElements = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "High Energy",
      color: "bg-orange-500",
      gradient: "from-orange-400 to-red-500",
      description: "Motivation & Intensity"
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Goal Focus",
      color: "bg-red-500",
      gradient: "from-red-400 to-pink-500",
      description: "Determination & Drive"
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Peak Performance",
      color: "bg-pink-500",
      gradient: "from-pink-400 to-rose-500",
      description: "Maximum Effort"
    }
  ];

  // Calm colors for trust and growth
  const calmElements = [
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Trust & Stability",
      color: "bg-blue-500",
      gradient: "from-blue-400 to-indigo-500",
      description: "Reliable & Professional"
    },
    {
      icon: <Star className="h-6 w-6" />,
      title: "Growth & Progress",
      color: "bg-green-500",
      gradient: "from-green-400 to-emerald-500",
      description: "Development & Success"
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Balance & Harmony",
      color: "bg-teal-500",
      gradient: "from-teal-400 to-cyan-500",
      description: "Wellness & Health"
    }
  ];

  // Achievement colors for wins and premium features
  const achievementElements = [
    {
      icon: <Trophy className="h-6 w-6" />,
      title: "Victory & Success",
      color: "bg-yellow-500",
      gradient: "from-yellow-400 to-orange-500",
      description: "Gold Standard"
    },
    {
      icon: <Crown className="h-6 w-6" />,
      title: "Premium Features",
      color: "bg-purple-500",
      gradient: "from-purple-400 to-violet-500",
      description: "Exclusive Access"
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Elite Status",
      color: "bg-indigo-500",
      gradient: "from-indigo-400 to-purple-500",
      description: "Top Performance"
    }
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Energy Colors Section */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 sm:p-6 rounded-lg border border-orange-200">
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-orange-800 flex items-center gap-2">
          <Zap className="h-4 w-4 sm:h-5 sm:w-5" />
          Energy & Motivation
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {energyElements.map((element, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-3 sm:p-4 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 touch-manipulation"
            >
              <div className={`${element.color} text-white p-2 sm:p-3 rounded-lg mb-2 sm:mb-3 w-fit`}>
                <div className="h-5 w-5 sm:h-6 sm:w-6">
                  {element.icon}
                </div>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">{element.title}</h4>
              <p className="text-xs sm:text-sm text-gray-600">{element.description}</p>
              <div className={`mt-2 sm:mt-3 h-1 bg-gradient-to-r ${element.gradient} rounded-full`}></div>
            </div>
          ))}
        </div>
      </div>

      {/* Calm Colors Section */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 sm:p-6 rounded-lg border border-blue-200">
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-blue-800 flex items-center gap-2">
          <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
          Trust & Growth
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {calmElements.map((element, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-3 sm:p-4 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 touch-manipulation"
            >
              <div className={`${element.color} text-white p-2 sm:p-3 rounded-lg mb-2 sm:mb-3 w-fit`}>
                <div className="h-5 w-5 sm:h-6 sm:w-6">
                  {element.icon}
                </div>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">{element.title}</h4>
              <p className="text-xs sm:text-sm text-gray-600">{element.description}</p>
              <div className={`mt-2 sm:mt-3 h-1 bg-gradient-to-r ${element.gradient} rounded-full`}></div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievement Colors Section */}
      <div className="bg-gradient-to-r from-yellow-50 to-purple-50 p-4 sm:p-6 rounded-lg border border-yellow-200">
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-yellow-800 flex items-center gap-2">
          <Trophy className="h-4 w-4 sm:h-5 sm:w-5" />
          Achievement & Premium
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {achievementElements.map((element, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-3 sm:p-4 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 touch-manipulation"
            >
              <div className={`${element.color} text-white p-2 sm:p-3 rounded-lg mb-2 sm:mb-3 w-fit`}>
                <div className="h-5 w-5 sm:h-6 sm:w-6">
                  {element.icon}
                </div>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">{element.title}</h4>
              <p className="text-xs sm:text-sm text-gray-600">{element.description}</p>
              <div className={`mt-2 sm:mt-3 h-1 bg-gradient-to-r ${element.gradient} rounded-full`}></div>
            </div>
          ))}
        </div>
      </div>

      {/* Color Psychology Summary */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-center">Color Psychology in Fitness</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-orange-400 to-red-500 rounded-full mx-auto mb-2 sm:mb-3 flex items-center justify-center">
              <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Energy Colors</h4>
            <p className="text-xs sm:text-sm text-gray-600">
              Orange and red create urgency and motivation, perfect for high-intensity workouts and goal setting.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-400 to-green-500 rounded-full mx-auto mb-2 sm:mb-3 flex items-center justify-center">
              <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Calm Colors</h4>
            <p className="text-xs sm:text-sm text-gray-600">
              Blue and green promote trust and growth, ideal for progress tracking and wellness features.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-yellow-400 to-purple-500 rounded-full mx-auto mb-2 sm:mb-3 flex items-center justify-center">
              <Trophy className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Achievement Colors</h4>
            <p className="text-xs sm:text-sm text-gray-600">
              Gold and purple signify success and premium features, perfect for milestones and exclusive content.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorPsychology; 