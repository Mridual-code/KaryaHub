import API from "../api/axios";

// Get all notifications
export const getNotifications = async (params = {}) => {

    const response = await API.get(
        "/notifications",
        {
            params
        }
    );

    return response.data;

};

// Get unread notification count
export const getUnreadCount = async () => {
    const response = await API.get(
        "/notifications/unread-count"
    );

    return response.data;
};

// Get notification by ID
export const getNotificationById = async (id) => {
    const response = await API.get(
        `/notifications/${id}`
    );

    return response.data;
};

// Mark one notification as read
export const markAsRead = async (id) => {
    const response = await API.patch(
        `/notifications/${id}/read`
    );

    return response.data;
};

// Mark all notifications as read
export const markAllAsRead = async () => {
    const response = await API.patch(
        "/notifications/read-all"
    );

    return response.data;
};

// Delete one notification
export const deleteNotification = async (id) => {
    const response = await API.delete(
        `/notifications/${id}`
    );

    return response.data;
};

// Clear all notifications
export const clearNotifications = async () => {
    const response = await API.delete(
        "/notifications/clear"
    );

    return response.data;
};