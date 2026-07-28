import {
    useEffect,
    useState,
} from "react";

import {
    toast,
} from "react-toastify";

import NotificationList from "../../components/notifications/NotificationList";

import {
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearNotifications,
} from "../../services/notificationService";

function Notifications() {

    const [
        notifications,
        setNotifications,
    ] = useState([]);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const fetchNotifications =
        async () => {

            try {

                setLoading(true);

                const res =
                    await getNotifications();

                setNotifications(
                    res.notifications || []
                );

            } catch (err) {

                toast.error(
                    err.response?.data
                        ?.message ||
                        "Failed to fetch notifications."
                );

            } finally {

                setLoading(false);

            }

        };

    useEffect(() => {

        fetchNotifications();

    }, []);

    const handleRead =
        async (id) => {

            try {

                await markAsRead(id);

                toast.success(
                    "Notification marked as read."
                );

                fetchNotifications();

            } catch (err) {

                toast.error(
                    err.response?.data
                        ?.message ||
                        "Failed to update notification."
                );

            }

        };

    const handleDelete =
        async (id) => {

            if (
                !window.confirm(
                    "Delete this notification?"
                )
            )
                return;

            try {

                await deleteNotification(
                    id
                );

                toast.success(
                    "Notification deleted."
                );

                fetchNotifications();

            } catch (err) {

                toast.error(
                    err.response?.data
                        ?.message ||
                        "Failed to delete notification."
                );

            }

        };

    const handleReadAll =
        async () => {

            try {

                await markAllAsRead();

                toast.success(
                    "All notifications marked as read."
                );

                fetchNotifications();

            } catch {

                toast.error(
                    "Failed to mark notifications as read."
                );

            }

        };

    const handleClear =
        async () => {

            if (
                !window.confirm(
                    "Clear all notifications?"
                )
            )
                return;

            try {

                await clearNotifications();

                toast.success(
                    "Notifications cleared."
                );

                fetchNotifications();

            } catch {

                toast.error(
                    "Failed to clear notifications."
                );

            }

        };

    return (

        <div className="page-container">

            <div className="page-header">

                <h1>
                    Notifications
                </h1>

                <div className="page-actions">

                    <button
                        className="primary-btn"
                        onClick={
                            handleReadAll
                        }
                    >
                        Mark All Read
                    </button>

                    <button
                        className="danger-btn"
                        onClick={
                            handleClear
                        }
                    >
                        Clear All
                    </button>

                </div>

            </div>

            {loading ? (

                <p>
                    Loading...
                </p>

            ) : (

                <NotificationList
                    notifications={
                        notifications
                    }
                    onRead={
                        handleRead
                    }
                    onDelete={
                        handleDelete
                    }
                />

            )}

        </div>

    );
}

export default Notifications;