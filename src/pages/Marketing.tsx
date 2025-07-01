import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Target, 
  TrendingUp, 
  Users, 
  Mail, 
  Share2, 
  BarChart3,
  Zap,
  Star
} from "lucide-react";

const Marketing = () => {
  const features = [
    {
      icon: <Target className="h-6 w-6" />,
      title: "Campaign Management",
      description: "Create and manage marketing campaigns with automated tracking and analytics"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Lead Management",
      description: "Track leads from multiple sources and automate follow-up sequences"
    },
    {
      icon: <Share2 className="h-6 w-6" />,
      title: "Social Media Integration",
      description: "Schedule and publish posts across multiple social media platforms"
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email Marketing",
      description: "Create email campaigns with templates and automated sequences"
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Analytics & Reporting",
      description: "Track ROI, conversion rates, and campaign performance in real-time"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Marketing Automation",
      description: "Automate lead nurturing, follow-ups, and client engagement"
    }
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Badge variant="secondary" className="text-sm">
            <Calendar className="h-3 w-3 mr-1" />
            Coming Soon
          </Badge>
        </div>
        
        <h1 className="text-4xl font-bold text-foreground">
          Marketing & Growth Hub
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Powerful marketing automation tools to grow your fitness business. 
          Track leads, manage campaigns, and boost your client acquisition. Coming soon to your dashboard!
        </p>
      </div>

      {/* Stats Preview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">245</div>
            <p className="text-sm text-muted-foreground">Total Leads</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">18.5%</div>
            <p className="text-sm text-muted-foreground">Conversion Rate</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-purple-600">$12,450</div>
            <p className="text-sm text-muted-foreground">Revenue Generated</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-orange-600">340%</div>
            <p className="text-sm text-muted-foreground">ROI</p>
          </CardContent>
        </Card>
      </div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">
          Everything you need to grow your fitness business
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center space-y-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Star className="h-5 w-5 text-yellow-500" />
          <span className="text-sm font-medium text-yellow-700">
            Premium Feature
          </span>
        </div>
        
        <h3 className="text-2xl font-bold">
          Ready to supercharge your marketing?
        </h3>
        
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Our marketing hub will help you attract more clients, automate your follow-ups, 
          and track your growth with powerful analytics. We're working hard to bring you these features soon!
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <TrendingUp className="h-4 w-4 mr-2" />
            Get Notified
          </Button>
          
          <Button variant="outline" size="lg">
            View Roadmap
          </Button>
        </div>
      </div>

      {/* Timeline */}
      <div className="max-w-4xl mx-auto">
        <h3 className="text-xl font-bold text-center mb-6">
          Development Timeline
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div>
              <div className="font-medium">Phase 1: Core CRM</div>
              <div className="text-sm text-muted-foreground">Client management, sessions, payments</div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <div>
              <div className="font-medium">Phase 2: Marketing Hub</div>
              <div className="text-sm text-muted-foreground">Campaigns, leads, analytics (Coming Soon)</div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            <div>
              <div className="font-medium">Phase 3: Advanced Features</div>
              <div className="text-sm text-muted-foreground">AI recommendations, automation</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketing;
