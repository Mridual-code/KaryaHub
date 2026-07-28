import API from "../api/axios";

/*
|--------------------------------------------------------------------------
| Employee
|--------------------------------------------------------------------------
*/

// Apply Leave
export const applyLeave = async (data) => {
  const res = await API.post("/leaves", data);

  return res.data;
};

// My Leaves
export const getMyLeaves = async (params = {}) => {
  const res = await API.get("/leaves/my", {
    params,
  });

  return res.data;
};

// Cancel Leave
export const cancelLeave = async (id) => {
  const res = await API.patch(
    `/leaves/${id}/cancel`
  );

  return res.data;
};

// Leave Details
export const getLeaveById = async (id) => {
  const res = await API.get(
    `/leaves/${id}`
  );

  return res.data;
};

/*
|--------------------------------------------------------------------------
| Admin / HR
|--------------------------------------------------------------------------
*/

// All Leaves
export const getLeaves = async (
  params = {}
) => {
  const res = await API.get("/leaves", {
    params,
  });

  return res.data;
};

// Update Status
export const updateLeave = async (
  id,
  data
) => {
  const res = await API.patch(
    `/leaves/${id}/status`,
    data
  );

  return res.data;
};

// Statistics
export const getLeaveStats = async () => {
  const res = await API.get(
    "/leaves/stats"
  );

  return res.data;
};

/*
|--------------------------------------------------------------------------
| Default Export
|--------------------------------------------------------------------------
*/

export default {
  // Employee
  applyLeave,
  getMyLeaves,
  cancelLeave,
  getLeaveById,

  // Admin / HR
  getLeaves,
  updateLeave,
  getLeaveStats,
};