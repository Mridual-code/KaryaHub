import API from "../api/axios";

export const exportEmployeesCsv = async (filters = {}) => {

    const res = await API.get(
        "/reports/employees/csv",
        {
            params: filters,
            responseType: "blob",
        }
    );

    return res.data;

};

export const exportAttendanceCsv = async (filters = {}) => {

    const res = await API.get(
        "/reports/attendance/csv",
        {
            params: filters,
            responseType: "blob",
        }
    );

    return res.data;

};

export const exportLeavesCsv = async (filters = {}) => {

    const res = await API.get(
        "/reports/leaves/csv",
        {
            params: filters,
            responseType: "blob",
        }
    );

    return res.data;

};