import { useEffect, useState } from "react";

import {
  clearNotifications,
  deleteNotification,
  getNotifications,
  getUnreadCount,
  markAllAsRead,
  markAsRead,
} from "../../services/notificationService";
import NotificationToolbar from "../../components/notifications/NotificationToolbar";
import NotificationList from "../../components/notifications/NotificationList";
import NotificationFilters from "../../components/notifications/NotificationFilters";
function Notifications() {

    const [notifications, setNotifications] =
        useState([]);

    const [unread, setUnread] =
        useState(0);
        const [loading, setLoading] =
    useState(true);

const [search, setSearch] =
    useState("");

const [filter, setFilter] =
    useState("all");

    const loadNotifications =
    async () => {

        try {

            setLoading(true);

            const params = {};

            if (search) {
                params.search = search;
            }

            if (filter === "read") {
                params.isRead = true;
            }

            if (filter === "unread") {
                params.isRead = false;
            }

            const [
                notificationData,
                unreadData,
            ] = await Promise.all([

                getNotifications(params),

                getUnreadCount(),

            ]);

            setNotifications(
                notificationData.notifications || []
            );

            setUnread(
                unreadData.unreadCount || 0
            );

        } catch (err) {

            console.log(err);

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadNotifications();

    }, [search, filter]);

    const handleRead =
        async (notification) => {

            try {

                await markAsRead(
                    notification._id
                );

                loadNotifications();

            } catch (err) {

                console.log(err);

            }

        };

    const handleDelete =
        async (notification) => {

            try {

                await deleteNotification(
                    notification._id
                );

                loadNotifications();

            } catch (err) {

                console.log(err);

            }

        };

    const handleReadAll =
        async () => {

            try {

                await markAllAsRead();

                loadNotifications();

            } catch (err) {

                console.log(err);

            }

        };

    const handleClear =
        async () => {

            try {

                await clearNotifications();

                loadNotifications();

            } catch (err) {

                console.log(err);

            }

        };

    return (

        <div className="notifications-page">

            <NotificationToolbar

    unread={unread}

    search={search}

    onSearch={setSearch}

    onReadAll={
        handleReadAll
    }

    onClear={
        handleClear
    }

/>
<NotificationFilters
    filter={filter}
    onFilterChange={setFilter}
/>

           <NotificationList

    loading={loading}

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
        </div>

    );

}

export default Notifications;