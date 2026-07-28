import API from "../api/axios";

export const getActivityLogs = async (
    params = {}
) => {

    const response =
        await API.get(
            "/activity-logs",
            {
                params
            }
        );

    return response.data;

};