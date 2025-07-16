import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Zap, Star } from "lucide-react";

const DemoPortal = () => {
  // Redirect to Loom demo video
  useEffect(() => {
    window.location.href = "https://www.loom.com/share/5c5dbae5eced4f0caf3d5c48ea91ae58?sid=3785c9dd-f0e5-484d-abf4-cc4b2cee980f";
  }, []);

  // Fallback content in case redirect doesn't work
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <Play className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">FitClient Demo</CardTitle>
          <CardDescription>
            Redirecting you to our demo video...
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            You should be redirected to our demo video automatically. If not, click the button below.
          </p>
          
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
            <Star className="h-4 w-4 text-yellow-500" />
            <span>2-minute walkthrough</span>
          </div>
          
          <Button 
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            onClick={() => window.open("https://www.loom.com/share/5c5dbae5eced4f0caf3d5c48ea91ae58?sid=3785c9dd-f0e5-484d-abf4-cc4b2cee980f", "_blank")}
          >
            <Play className="mr-2 h-4 w-4" />
            Watch Demo Video
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Zap className="h-3 w-3" />
            <span>Opens in new tab</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DemoPortal; 