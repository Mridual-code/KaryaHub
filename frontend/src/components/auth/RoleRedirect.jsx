import {
  Navigate
} from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import getRolePath from "../../utils/getRolePath";

function RoleRedirect() {
  const {
    user,
    loading,
    isAuthenticated
  } = useAuth();

  if (loading) {
    return (
      <div className="page-loader">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return (
    <Navigate
      to={getRolePath(user?.role)}
      replace
    />
  );
}

export default RoleRedirect;