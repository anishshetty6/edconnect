import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedUserType: string;
}

const ProtectedRoute = ({ children, allowedUserType }: ProtectedRouteProps) => {
  const { isAuthenticated, userType, isInitialized } = useAuth();
  const location = useLocation();

  if (!isInitialized) {
    return <div>Loading...</div>; // Or a proper loading component
  }

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (userType !== allowedUserType) {
    // Redirect to their respective dashboard if wrong user type
    return <Navigate to={`/${userType}/dashboard`} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
