import API from "../api/axios";

const getDepartments = async (
    params = {}
) => {
    const response = await API.get(
        "/departments",
        {
            params,
        }
    );

    return response.data;
};

const createDepartment = async (data) => {
  const response = await API.post("/departments", data);
  return response.data;
};

const updateDepartment = async (id, data) => {
  const response = await API.put(`/departments/${id}`, data);
  return response.data;
};

const deleteDepartment = async (id) => {
  const response = await API.delete(`/departments/${id}`);
  return response.data;
};

export default {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};