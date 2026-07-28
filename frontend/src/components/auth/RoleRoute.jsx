import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function RoleRoute({ allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="auth-loading">Loading KaryaHub...</div>;
  }

  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}

export default RoleRoute;