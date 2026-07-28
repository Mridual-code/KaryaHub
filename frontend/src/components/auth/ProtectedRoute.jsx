import {
  Navigate,
  Outlet
} from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";

function ProtectedRoute() {
  const {
    isAuthenticated,
    loading
  } = useAuth();

  if (loading) {
    return (
      <div className="auth-loading">
        Loading KaryaHub...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return <Outlet />;
}

export default ProtectedRoute;