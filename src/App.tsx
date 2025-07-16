import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";
import { SubscriptionProvider } from "./contexts/SubscriptionContext";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Staff-only route component
const StaffOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  
  // Only allow FitClient staff emails
  const isStaff = user?.email && [
    'support@fitclients.com',
    'admin@fitclients.com',
    'dev@fitclients.com',
    'staff@fitclients.com',
    'demo@fitclients.com' // Temporary for testing
  ].includes(user.email);
  
  if (!isStaff) {
    return <Navigate to="/support-login" replace />;
  }
  
  return <>{children}</>;
};

// Import all the pages that the sidebar navigation needs
import Clients from "./pages/Clients";
import Sessions from "./pages/Sessions";
import Workouts from "./pages/Workouts";
import Payments from "./pages/Payments";
import Progress from "./pages/Progress";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import AIRecommendations from "./pages/AIRecommendations";
import Features from "./pages/Features";
import SupportPortal from "./pages/SupportPortal";
import SupportLogin from "./pages/SupportLogin";
import TrialTest from "./pages/TrialTest";
import Onboarding from "./pages/Onboarding";
import ClientPortal from "./pages/ClientPortal";
import ClientPortalManager from "./pages/ClientPortalManager";


// Landing page redirect component
const LandingRedirect = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
    </div>;
  }
  
  return user ? <Navigate to="/dashboard" replace /> : <Landing />;
};

// Layout wrapper component for protected routes
const ProtectedLayout = () => {
  return (
    <ProtectedRoute>
      <Layout>
        <Outlet />
      </Layout>
    </ProtectedRoute>
  );
};

const App = () => {
  console.log('App component rendering...');
  
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <SubscriptionProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<LandingRedirect />} />
              <Route path="/landing" element={<LandingRedirect />} />
              <Route path="/login" element={<Login />} />
              <Route path="/support-login" element={<SupportLogin />} />
              <Route path="/onboarding" element={<Onboarding />} />
              
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
              <Route path="/support-portal" element={<StaffOnlyRoute><SupportPortal /></StaffOnlyRoute>} />
              
              {/* Client Portal routes (public access) */}
              <Route path="/client-portal/:clientId" element={<ClientPortal />} />
              <Route path="/demo-portal" element={<ClientPortal />} />
              
              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </SubscriptionProvider>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
