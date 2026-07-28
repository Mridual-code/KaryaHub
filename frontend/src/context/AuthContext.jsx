import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import * as authService from "../services/authService";
import {
  TOKEN_KEY,
  USER_KEY
} from "../utils/constants";

export const AuthContext =
  createContext(null);

export function AuthProvider({
  children
}) {
  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [
    isAuthenticated,
    setIsAuthenticated
  ] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | Initialize Authentication
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth =
    async () => {
      const token =
        localStorage.getItem(
          TOKEN_KEY
        );

      if (!token) {
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        const data =
          await authService.getProfile();

        if (!data?.user) {
          throw new Error(
            "User profile not returned."
          );
        }

        setUser(data.user);
        setIsAuthenticated(true);

        localStorage.setItem(
          USER_KEY,
          JSON.stringify(data.user)
        );
      } catch (error) {
        console.error(
          "Authentication initialization failed:",
          error
        );

        authService.logout();

        localStorage.removeItem(
          USER_KEY
        );

        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

  /*
  |--------------------------------------------------------------------------
  | Login
  |--------------------------------------------------------------------------
  */

  const login = async (
    email,
    password
  ) => {
    const data =
      await authService.login({
        email: email.trim(),
        password
      });

    if (!data?.token) {
      throw new Error(
        "Token was not returned."
      );
    }

    if (!data?.user) {
      throw new Error(
        "User information was not returned."
      );
    }

    localStorage.setItem(
      TOKEN_KEY,
      data.token
    );

    localStorage.setItem(
      USER_KEY,
      JSON.stringify(data.user)
    );

    setUser(data.user);
    setIsAuthenticated(true);

    return data.user;
  };

  /*
  |--------------------------------------------------------------------------
  | Logout
  |--------------------------------------------------------------------------
  */

  const logout = () => {
    authService.logout();

    localStorage.removeItem(
      USER_KEY
    );

    setUser(null);
    setIsAuthenticated(false);
  };

  /*
  |--------------------------------------------------------------------------
  | Refresh Logged-in User
  |--------------------------------------------------------------------------
  */

  const refreshProfile =
    async () => {
      try {
        const data =
          await authService.getProfile();

        if (!data?.user) return;

        setUser(data.user);

        localStorage.setItem(
          USER_KEY,
          JSON.stringify(data.user)
        );
      } catch (error) {
        console.error(
          "Failed to refresh profile:",
          error
        );
      }
    };

  /*
  |--------------------------------------------------------------------------
  | Update Local User
  |--------------------------------------------------------------------------
  */

  const updateUser = (
    updatedUser
  ) => {
    setUser(updatedUser);

    localStorage.setItem(
      USER_KEY,
      JSON.stringify(updatedUser)
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Context Value
  |--------------------------------------------------------------------------
  */

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    updateUser,
    refreshProfile
  };

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}