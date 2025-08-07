import React, { Suspense, startTransition } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";
import { SubscriptionProvider } from "./contexts/SubscriptionContext";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { EnhancedErrorBoundary as ErrorBoundary } from "./components/ui/enhanced-error-boundary";
import { LoadingScreen } from "./components/ui/loading";

// Lazy load pages for code splitting
const Landing = React.lazy(() => import("./pages/Landing"));
const Login = React.lazy(() => import("./pages/Login"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const Clients = React.lazy(() => import("./pages/Clients"));
const Sessions = React.lazy(() => import("./pages/Sessions"));
const Workouts = React.lazy(() => import("./pages/Workouts"));
const Payments = React.lazy(() => import("./pages/Payments"));
const Progress = React.lazy(() => import("./pages/Progress"));
const Settings = React.lazy(() => import("./pages/Settings"));
const Help = React.lazy(() => import("./pages/Help"));
const AIRecommendations = React.lazy(() => import("./pages/AIRecommendations"));
const Features = React.lazy(() => import("./pages/Features"));
const SupportPortal = React.lazy(() => import("./pages/SupportPortal"));
const SupportLogin = React.lazy(() => import("./pages/SupportLogin"));
const TrialTest = React.lazy(() => import("./pages/TrialTest"));
const Onboarding = React.lazy(() => import("./pages/Onboarding"));
const ClientPortal = React.lazy(() => import("./pages/ClientPortal"));
const ClientPortalManager = React.lazy(() => import("./pages/ClientPortalManager"));
const Privacy = React.lazy(() => import("./pages/Privacy"));
const Terms = React.lazy(() => import("./pages/Terms"));
const Contact = React.lazy(() => import("./pages/Contact"));

// Staff-only route component
const StaffOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  
  // Only allow FitClient staff emails
  const isStaff = user?.email && [
    'support@fitclients.io',
    'admin@fitclients.io',
    'dev@fitclients.io',
    'staff@fitclients.io',
    'demo@fitclients.io' // Temporary for testing
  ].includes(user.email);
  
  if (!isStaff) {
    return <Navigate to="/support-login" replace />;
  }
  
  return <>{children}</>;
};

// Landing page redirect component with proper Suspense handling
const LandingRedirect = () => {
  const { user, loading } = useAuth();
  
  // Show loading screen for a reasonable time while auth state settles
  if (loading) {
    return <LoadingScreen text="Loading..." size="lg" />;
  }
  
  // If user is authenticated, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // If not authenticated, show landing page
  // Use startTransition to prevent Suspense errors during navigation
  return (
    <Suspense fallback={<LoadingScreen text="Loading..." size="lg" />}>
      <Landing />
    </Suspense>
  );
};

// Protected layout wrapper with loading state
const ProtectedLayout = () => {
  return (
    <ProtectedRoute>
      <Layout>
        <Suspense fallback={<LoadingScreen text="Loading page..." />}>
          <Outlet />
        </Suspense>
      </Layout>
    </ProtectedRoute>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <DataProvider>
            <SubscriptionProvider>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<LandingRedirect />} />
                <Route path="/landing" element={<LandingRedirect />} />
                <Route path="/login" element={
                  <Suspense fallback={<LoadingScreen text="Loading..." size="lg" />}>
                    <Login />
                  </Suspense>
                } />
                <Route path="/support-login" element={
                  <Suspense fallback={<LoadingScreen text="Loading..." size="lg" />}>
                    <SupportLogin />
                  </Suspense>
                } />
                <Route path="/onboarding" element={
                  <Suspense fallback={<LoadingScreen text="Loading..." size="lg" />}>
                    <Onboarding />
                  </Suspense>
                } />
                <Route path="/privacy" element={
                  <Suspense fallback={<LoadingScreen text="Loading..." size="lg" />}>
                    <Privacy />
                  </Suspense>
                } />
                <Route path="/terms" element={
                  <Suspense fallback={<LoadingScreen text="Loading..." size="lg" />}>
                    <Terms />
                  </Suspense>
                } />
                <Route path="/contact" element={
                  <Suspense fallback={<LoadingScreen text="Loading..." size="lg" />}>
                    <Contact />
                  </Suspense>
                } />
                
                {/* Protected routes with layout */}
                <Route element={<ProtectedLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/features" element={<Features />} />
                  <Route path="/clients" element={<Clients />} />
                  <Route path="/sessions" element={<Sessions />} />
                  <Route path="/workouts" element={<Workouts />} />
                  <Route path="/payments" element={<Payments />} />
                  <Route path="/progress" element={<Progress />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/help" element={<Help />} />
                  <Route path="/ai-recommendations" element={<AIRecommendations />} />
                  <Route path="/trial-test" element={<TrialTest />} />
                </Route>
                
                {/* Staff-only routes */}
                <Route path="/support-portal" element={
                  <StaffOnlyRoute>
                    <Suspense fallback={<LoadingScreen text="Loading support portal..." />}>
                      <SupportPortal />
                    </Suspense>
                  </StaffOnlyRoute>
                } />
                
                {/* Client Portal routes (public access) */}
                <Route path="/client-portal/:clientId" element={
                  <Suspense fallback={<LoadingScreen text="Loading client portal..." />}>
                    <ClientPortal />
                  </Suspense>
                } />
                <Route path="/demo-portal" element={
                  <Suspense fallback={<LoadingScreen text="Loading demo portal..." />}>
                    <ClientPortal />
                  </Suspense>
                } />
                
                {/* Client Portal Manager */}
                <Route path="/client-portals" element={
                  <ProtectedRoute>
                    <Layout>
                      <Suspense fallback={<LoadingScreen text="Loading portal manager..." />}>
                        <ClientPortalManager />
                      </Suspense>
                    </Layout>
                  </ProtectedRoute>
                } />
                
                {/* Catch-all route */}
                <Route path="*" element={
                  <Suspense fallback={<LoadingScreen text="Loading..." size="lg" />}>
                    <NotFound />
                  </Suspense>
                } />
              </Routes>
            </SubscriptionProvider>
          </DataProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
