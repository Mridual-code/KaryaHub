import API from "../api/axios";

/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
*/

// Login
export const login = async (credentials) => {
  const res = await API.post("/auth/login", credentials);
  return res.data;
};

// Register (if enabled)
export const register = async (data) => {
  const res = await API.post("/auth/register", data);
  return res.data;
};

// Logged-in user profile
export const getProfile = async () => {
  const res = await API.get("/auth/profile");
  return res.data;
};

// Change password
export const changePassword = async (data) => {
  const res = await API.put("/auth/change-password", data);
  return res.data;
};

// Logout
export const logout = () => {
  localStorage.removeItem("token");
};