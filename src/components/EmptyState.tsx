import React from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Sparkles, 
  ArrowRight, 
  CheckCircle,
  Target,
  Activity,
  Brain
} from "lucide-react";

interface EmptyStateProps {
  Icon: React.ElementType;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  Icon,
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80">
          <Icon className="h-8 w-8 text-white" aria-hidden="true" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">{title}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{description}</p>
        </div>
        {actionText && onAction && (
          <div className="flex justify-center">
            <Button onClick={onAction} size="lg" className="text-lg px-8 py-3">
              {actionText}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        )}
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <CardTitle className="text-lg">Client Management</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-sm leading-relaxed">
              Add and manage your clients with detailed profiles, progress tracking, and communication tools.
            </CardDescription>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>Client profiles & contact info</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>Progress tracking & goals</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>Client portal access</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 group-hover:bg-green-200 transition-colors">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <CardTitle className="text-lg">Session Scheduling</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-sm leading-relaxed">
              Schedule and manage training sessions with your clients, track attendance, and manage your calendar.
            </CardDescription>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>Easy session scheduling</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>Calendar integration</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>Session notes & tracking</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100 group-hover:bg-purple-200 transition-colors">
                <DollarSign className="h-5 w-5 text-purple-600" />
              </div>
              <CardTitle className="text-lg">Payment Tracking</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-sm leading-relaxed">
              Track payments, manage invoices, and monitor your business revenue with detailed analytics.
            </CardDescription>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>Payment tracking</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>Revenue analytics</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>Invoice management</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-100 group-hover:bg-orange-200 transition-colors">
                <TrendingUp className="h-5 w-5 text-orange-600" />
              </div>
              <CardTitle className="text-lg">Progress Tracking</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-sm leading-relaxed">
              Monitor client progress with detailed measurements, weight tracking, and goal achievement.
            </CardDescription>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>Weight & measurements</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>Goal setting & tracking</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>Progress visualization</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-pink-100 group-hover:bg-pink-200 transition-colors">
                <Brain className="h-5 w-5 text-pink-600" />
              </div>
              <CardTitle className="text-lg">AI Recommendations</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-sm leading-relaxed">
              Get AI-powered workout recommendations and insights to optimize your training programs.
            </CardDescription>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>Smart workout suggestions</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>Progress insights</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>Performance analytics</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-100 group-hover:bg-indigo-200 transition-colors">
                <Activity className="h-5 w-5 text-indigo-600" />
              </div>
              <CardTitle className="text-lg">Business Analytics</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-sm leading-relaxed">
              View detailed analytics and insights about your business performance and client engagement.
            </CardDescription>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>Revenue tracking</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>Client growth metrics</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>Performance dashboards</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Start Tips */}
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-6 border border-primary/20">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Quick Start Tips</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start gap-3">
            <Badge variant="secondary" className="text-xs">1</Badge>
            <div>
              <p className="font-medium">Add Your First Client</p>
              <p className="text-muted-foreground">Start by adding a client to begin managing their fitness journey.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Badge variant="secondary" className="text-xs">2</Badge>
            <div>
              <p className="font-medium">Schedule a Session</p>
              <p className="text-muted-foreground">Book your first training session to start tracking progress.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Badge variant="secondary" className="text-xs">3</Badge>
            <div>
              <p className="font-medium">Set Up Payments</p>
              <p className="text-muted-foreground">Configure payment tracking to monitor your business revenue.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Badge variant="secondary" className="text-xs">4</Badge>
            <div>
              <p className="font-medium">Explore Features</p>
              <p className="text-muted-foreground">Check out all the tools available to grow your fitness business.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyState; 