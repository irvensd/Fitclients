import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Landing from "@/pages/Landing";
import { LoadingScreen } from "@/components/ui/loading";

export const LandingRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen text="Loading..." />;
  }

  // If user is authenticated, redirect to admin dashboard
  if (user) {
    return <Navigate to="/admin" replace />;
  }

  // If not authenticated, show landing page
  return <Landing />;
};
