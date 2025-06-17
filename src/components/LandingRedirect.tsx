import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Landing from "@/pages/Landing";

export const LandingRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is authenticated, redirect to admin dashboard
  if (user) {
    return <Navigate to="/admin" replace />;
  }

  // If not authenticated, show landing page
  return <Landing />;
};
