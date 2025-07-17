import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Lightbulb, 
  X, 
  Users, 
  Calendar, 
  Dumbbell, 
  Brain, 
  TrendingUp,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface DemoTip {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  action?: {
    text: string;
    href: string;
  };
}

const demoTips: DemoTip[] = [
  {
    id: 'clients',
    title: 'Manage Clients',
    description: 'Add, edit, and track your client profiles with fitness levels and goals.',
    icon: Users,
    action: { text: 'View Clients', href: '/clients' }
  },
  {
    id: 'sessions',
    title: 'Schedule Sessions',
    description: 'Create and manage training sessions with your clients.',
    icon: Calendar,
    action: { text: 'View Sessions', href: '/sessions' }
  },
  {
    id: 'workouts',
    title: 'Create Workouts',
    description: 'Design personalized workout plans for your clients.',
    icon: Dumbbell,
    action: { text: 'View Workouts', href: '/workouts' }
  },
  {
    id: 'ai-coach',
    title: 'AI Recommendations',
    description: 'Get smart insights and recommendations for your clients.',
    icon: Brain,
    action: { text: 'Try AI Coach', href: '/ai-recommendations' }
  },
  {
    id: 'progress',
    title: 'Track Progress',
    description: 'Monitor client progress and celebrate achievements.',
    icon: TrendingUp,
    action: { text: 'View Progress', href: '/progress' }
  }
];

export const DemoTips: React.FC = () => {
  const { isDemoUser } = useAuth();
  const [dismissed, setDismissed] = useState(false);
  const [completedTips, setCompletedTips] = useState<Set<string>>(new Set());

  if (!isDemoUser || dismissed) return null;

  const handleCompleteTip = (tipId: string) => {
    setCompletedTips(prev => new Set([...prev, tipId]));
  };

  const handleDismiss = () => {
    setDismissed(true);
  };

  const completedCount = completedTips.size;
  const totalTips = demoTips.length;

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg text-blue-800">Demo Tips</CardTitle>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              {completedCount}/{totalTips} completed
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="text-blue-600 hover:text-blue-800"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-blue-700 mb-4">
          Explore these key features to see how FitClient can help your fitness business:
        </p>
        
        <div className="space-y-2">
          {demoTips.map((tip) => {
            const isCompleted = completedTips.has(tip.id);
            const Icon = tip.icon;
            
            return (
              <div
                key={tip.id}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                  isCompleted 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-white border-blue-200 hover:border-blue-300'
                }`}
              >
                <div className={`p-2 rounded-lg ${
                  isCompleted ? 'bg-green-100' : 'bg-blue-100'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <Icon className="h-4 w-4 text-blue-600" />
                  )}
                </div>
                
                <div className="flex-1">
                  <h4 className={`font-medium text-sm ${
                    isCompleted ? 'text-green-800' : 'text-gray-900'
                  }`}>
                    {tip.title}
                  </h4>
                  <p className={`text-xs ${
                    isCompleted ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {tip.description}
                  </p>
                </div>
                
                {tip.action && !isCompleted && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-blue-700 border-blue-300 hover:bg-blue-50"
                    onClick={() => {
                      handleCompleteTip(tip.id);
                      window.location.href = tip.action!.href;
                    }}
                  >
                    {tip.action.text}
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                )}
              </div>
            );
          })}
        </div>
        
        {completedCount === totalTips && (
          <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle className="h-5 w-5 text-green-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-green-800">
              Great job! You've explored all the key features.
            </p>
            <p className="text-xs text-green-600 mt-1">
              Ready to start your own fitness business with FitClient?
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 