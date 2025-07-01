import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Cookie, Settings, Check, Info, Shield, BarChart3, Target } from "lucide-react";
import { Link } from "react-router-dom";

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

interface CookieCategory {
  id: keyof CookiePreferences;
  name: string;
  description: string;
  icon: any;
  required: boolean;
  retention: string;
  purposes: string[];
}

export const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true, // Always required
    analytics: false,
    marketing: false,
    functional: false,
  });

  const cookieCategories: CookieCategory[] = [
    {
      id: 'essential',
      name: 'Essential Cookies',
      description: 'These cookies are necessary for the website to function properly and cannot be disabled.',
      icon: Shield,
      required: true,
      retention: 'Session to 1 year',
      purposes: ['Authentication', 'Security', 'Basic functionality', 'Session management']
    },
    {
      id: 'functional',
      name: 'Functional Cookies',
      description: 'These cookies enable enhanced functionality and personalization.',
      icon: Settings,
      required: false,
      retention: '1 month to 1 year',
      purposes: ['User preferences', 'Language settings', 'Form data', 'Enhanced features']
    },
    {
      id: 'analytics',
      name: 'Analytics Cookies',
      description: 'These cookies help us understand how visitors interact with our website.',
      icon: BarChart3,
      required: false,
      retention: '2 years',
      purposes: ['Website usage analysis', 'Performance monitoring', 'User behavior insights', 'Service improvement']
    },
    {
      id: 'marketing',
      name: 'Marketing Cookies',
      description: 'These cookies are used to deliver relevant advertisements and measure campaign effectiveness.',
      icon: Target,
      required: false,
      retention: '1 year',
      purposes: ['Ad personalization', 'Campaign measurement', 'Cross-site tracking', 'Social media integration']
    }
  ];

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem("fitclients-cookie-consent");
    if (!consent) {
      // Show banner after a short delay
      setTimeout(() => setShowBanner(true), 1000);
    } else {
      // Load existing preferences
      try {
        const savedConsent = JSON.parse(consent);
        if (savedConsent.preferences) {
          setPreferences(savedConsent.preferences);
        }
      } catch (error) {
        console.error('Error parsing saved cookie consent:', error);
        // If parsing fails, show banner again
        setTimeout(() => setShowBanner(true), 1000);
      }
    }
  }, []);

  const handleAcceptAll = () => {
    const allPreferences = {
      essential: true,
      functional: true,
      analytics: true,
      marketing: true,
    };
    savePreferences(allPreferences);
    setShowBanner(false);
  };

  const handleAcceptEssential = () => {
    const essentialOnly = {
      essential: true,
      functional: false,
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
    const consentData = {
      preferences: prefs,
      timestamp: new Date().toISOString(),
      version: "2.0",
      ipAddress: "anonymized", // In production, you'd get this from your backend
      userAgent: navigator.userAgent
    };

    localStorage.setItem("fitclients-cookie-consent", JSON.stringify(consentData));

    // Initialize services based on preferences
    if (prefs.analytics) {
      // Initialize analytics (Google Analytics, etc.)
      console.log("Analytics cookies enabled");
      // In production: initializeGoogleAnalytics();
    }
    
    if (prefs.marketing) {
      // Initialize marketing pixels (Facebook, etc.)
      console.log("Marketing cookies enabled");
      // In production: initializeMarketingPixels();
    }

    if (prefs.functional) {
      // Initialize functional features
      console.log("Functional cookies enabled");
      // In production: initializeFunctionalFeatures();
    }

    // Always log essential cookies as they're required
    console.log("Essential cookies enabled (required)");
  };

  const handleWithdrawConsent = () => {
    localStorage.removeItem("fitclients-cookie-consent");
    setShowBanner(true);
    setPreferences({
      essential: true,
      functional: false,
      analytics: false,
      marketing: false,
    });
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
                    We value your privacy
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    We use cookies to enhance your experience and analyze site usage. 
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
                {cookieCategories.map((category) => (
                  <div key={category.id} className="flex items-start justify-between p-3 bg-muted rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <category.icon className="h-4 w-4 text-primary" />
                        <h4 className="font-medium text-sm">{category.name}</h4>
                        {category.required && (
                          <Badge variant="secondary" className="text-xs">Required</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {category.description}
                      </p>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div><strong>Purposes:</strong> {category.purposes.join(', ')}</div>
                        <div><strong>Retention:</strong> {category.retention}</div>
                      </div>
                    </div>
                    <div className="ml-3">
                      {category.required ? (
                        <div className="w-10 h-5 bg-primary rounded-full flex items-center justify-end px-1">
                          <div className="w-3 h-3 bg-white rounded-full"></div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setPreferences(prev => ({ ...prev, [category.id]: !prev[category.id] }))}
                          className={`w-10 h-5 rounded-full flex items-center transition-colors ${
                            preferences[category.id] ? 'bg-primary justify-end' : 'bg-gray-300 justify-start'
                          }`}
                        >
                          <div className="w-3 h-3 bg-white rounded-full mx-1"></div>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
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

              <div className="text-center pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleWithdrawConsent}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Withdraw Consent
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}; 