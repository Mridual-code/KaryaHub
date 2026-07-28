import API from "../api/axios";

const BASE_URL = "/users";

export const getProfile = async () => {
    const response = await API.get(`${BASE_URL}/profile`);
    return response.data;
};

export const updateProfile = async (body) => {
    const response = await API.put(
        `${BASE_URL}/profile`,
        body
    );

    return response.data;
};

export const changePassword = async (body) => {
    const response = await API.put(
        `${BASE_URL}/change-password`,
        body
    );

    return response.data;
};

export default {
    getProfile,
    updateProfile,
    changePassword,
};