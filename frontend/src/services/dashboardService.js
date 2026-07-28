import API from "../api/axios";

const getAdminDashboard = async () => {
  const response = await API.get("/dashboard/admin");
  return response.data;
};

const getHRDashboard = async () => {
  const response = await API.get("/dashboard/hr");
  return response.data;
};

const getEmployeeDashboard = async () => {
    const response =
        await API.get("/dashboard/employee");

    return response.data;
};

const getDashboard = (role) => {
  switch (role) {
    case "Admin":
      return getAdminDashboard();

    case "HR":
      return getHRDashboard();

    case "Employee":
      return getEmployeeDashboard();

    default:
      throw new Error("Invalid role");
  }
};

export default {
  getDashboard,
  getAdminDashboard,
  getHRDashboard,
  getEmployeeDashboard,
};