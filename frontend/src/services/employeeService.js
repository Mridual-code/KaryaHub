import API from "../api/axios";

const getAllEmployees = async () => {
  const response = await API.get("/employees");

  return (
    response.data.employees ||
    response.data.data ||
    response.data
  );
};

const getEmployeeById = async (id) => {
  const response = await API.get(
    `/employees/${id}`
  );

  return response.data;
};

const createEmployee = async (data) => {
  const response = await API.post(
    "/employees",
    data
  );

  return response.data;
};

const updateEmployee = async (
  id,
  data
) => {
  const response = await API.put(
    `/employees/${id}`,
    data
  );

  return response.data;
};

const deleteEmployee = async (id) => {
  const response = await API.delete(
    `/employees/${id}`
  );

  return response.data;
};

export default {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};