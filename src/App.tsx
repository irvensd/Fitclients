import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";
import { SubscriptionProvider } from "./contexts/SubscriptionContext";
import { MarketingProvider } from "./contexts/MarketingContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { LandingRedirect } from "./components/LandingRedirect";
import { Layout } from "./components/Layout";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Sessions from "./pages/Sessions";
import Workouts from "./pages/Workouts";
import Payments from "./pages/Payments";
import Progress from "./pages/Progress";
import Settings from "./pages/Settings";
import Features from "./pages/Features";
import ClientPortal from "./pages/ClientPortal";
import DemoPortal from "./pages/DemoPortal";
import ClientPortalManager from "./pages/ClientPortalManager";
import AIRecommendations from "./pages/AIRecommendations";
import Marketing from "./pages/Marketing";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";
import SupportPortal from "./pages/SupportPortal";
import Onboarding from "./pages/Onboarding";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import { CookieConsent } from "./components/CookieConsent";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <SubscriptionProvider>
        <DataProvider>
          <MarketingProvider>
                          <TooltipProvider>
                <Toaster />
                <Sonner />
                <CookieConsent />
                <BrowserRouter>
                <Routes>
                  {/* Home route - shows landing or redirects to admin if authenticated */}
                  <Route path="/" element={<LandingRedirect />} />

                  {/* Public Routes */}
                  <Route path="/landing" element={<Landing />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/onboarding" element={<Onboarding />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/privacy" element={<Privacy />} />

                  {/* Demo Client Portal - No Authentication Required */}
                  <Route
                    path="/demo-portal"
                    element={<DemoPortal />}
                  />

                  {/* Public Client Portal - No Authentication Required */}
                  <Route
                    path="/client-portal/:clientId"
                    element={<ClientPortal />}
                  />

                  {/* Protected Admin Routes */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <Dashboard />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/clients"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <Clients />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/sessions"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <Sessions />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/workouts"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <Workouts />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/payments"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <Payments />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/progress"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <Progress />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/settings"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <Settings />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/client-portals"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <ClientPortalManager />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/ai-recommendations"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <AIRecommendations />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/features"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <Features />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/marketing"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <Marketing />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/help-support"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <Help />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/support-portal"
                    element={<SupportPortal />}
                  />

                  {/* 404 Route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </MarketingProvider>
        </DataProvider>
      </SubscriptionProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
