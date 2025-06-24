import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Cookie, Settings, Check } from "lucide-react";
import { Link } from "react-router-dom";

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

export const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true, // Always required
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem("fitclients-cookie-consent");
    if (!consent) {
      // Show banner after a short delay
      setTimeout(() => setShowBanner(true), 2000);
    }
  }, []);

  const handleAcceptAll = () => {
    const allPreferences = {
      essential: true,
      analytics: true,
      marketing: true,
    };
    savePreferences(allPreferences);
    setShowBanner(false);
  };

  const handleAcceptEssential = () => {
    const essentialOnly = {
      essential: true,
      analytics: false,
      marketing: false,
    };
    savePreferences(essentialOnly);
    setShowBanner(false);
  };

  const handleSavePreferences = () => {
    savePreferences(preferences);
    setShowBanner(false);
    setShowSettings(false);
  };

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem("fitclients-cookie-consent", JSON.stringify({
      preferences: prefs,
      timestamp: new Date().toISOString(),
      version: "1.0"
    }));

    // Here you would typically initialize analytics/marketing scripts based on preferences
    if (prefs.analytics) {
      // Initialize analytics (Google Analytics, etc.)
      console.log("Analytics cookies enabled");
    }
    
    if (prefs.marketing) {
      // Initialize marketing pixels (Facebook, etc.)
      console.log("Marketing cookies enabled");
    }
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <Card className="max-w-4xl mx-auto shadow-lg border-2">
        <CardContent className="p-4 sm:p-6">
          {!showSettings ? (
            // Main banner
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="bg-primary/10 p-2 rounded-lg flex-shrink-0">
                  <Cookie className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm sm:text-base mb-1">
                    We use cookies to enhance your experience
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    We use essential cookies to make our site work. We'd also like to set optional cookies to help us improve our site and show you relevant content. 
                    <Link to="/privacy" className="text-primary hover:underline ml-1">
                      Learn more in our Privacy Policy
                    </Link>
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSettings(true)}
                  className="text-xs"
                >
                  <Settings className="h-3 w-3 mr-1" />
                  Customize
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAcceptEssential}
                  className="text-xs"
                >
                  Essential Only
                </Button>
                <Button
                  size="sm"
                  onClick={handleAcceptAll}
                  className="text-xs"
                >
                  <Check className="h-3 w-3 mr-1" />
                  Accept All
                </Button>
              </div>
            </div>
          ) : (
            // Settings panel
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-base">Cookie Preferences</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettings(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                {/* Essential Cookies */}
                <div className="flex items-start justify-between p-3 bg-muted rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm">Essential Cookies</h4>
                      <Badge variant="secondary" className="text-xs">Required</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Necessary for the website to function properly. These cookies cannot be disabled.
                    </p>
                  </div>
                  <div className="ml-3">
                    <div className="w-10 h-5 bg-primary rounded-full flex items-center justify-end px-1">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="flex items-start justify-between p-3 bg-muted rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm mb-1">Analytics Cookies</h4>
                    <p className="text-xs text-muted-foreground">
                      Help us understand how visitors interact with our website to improve user experience.
                    </p>
                  </div>
                  <div className="ml-3">
                    <button
                      onClick={() => setPreferences(prev => ({ ...prev, analytics: !prev.analytics }))}
                      className={`w-10 h-5 rounded-full flex items-center transition-colors ${
                        preferences.analytics ? 'bg-primary justify-end' : 'bg-gray-300 justify-start'
                      }`}
                    >
                      <div className="w-3 h-3 bg-white rounded-full mx-1"></div>
                    </button>
                  </div>
                </div>

                {/* Marketing Cookies */}
                <div className="flex items-start justify-between p-3 bg-muted rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm mb-1">Marketing Cookies</h4>
                    <p className="text-xs text-muted-foreground">
                      Used to show you relevant advertisements and measure the effectiveness of our campaigns.
                    </p>
                  </div>
                  <div className="ml-3">
                    <button
                      onClick={() => setPreferences(prev => ({ ...prev, marketing: !prev.marketing }))}
                      className={`w-10 h-5 rounded-full flex items-center transition-colors ${
                        preferences.marketing ? 'bg-primary justify-end' : 'bg-gray-300 justify-start'
                      }`}
                    >
                      <div className="w-3 h-3 bg-white rounded-full mx-1"></div>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAcceptEssential}
                  className="text-xs flex-1"
                >
                  Essential Only
                </Button>
                <Button
                  size="sm"
                  onClick={handleSavePreferences}
                  className="text-xs flex-1"
                >
                  Save Preferences
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}; 