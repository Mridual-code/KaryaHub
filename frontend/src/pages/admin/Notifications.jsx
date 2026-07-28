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

function Notifications() {

    const [notifications, setNotifications] =
        useState([]);

    const [unread, setUnread] =
        useState(0);

    const loadNotifications =
        async () => {

            try {

                const [
                    notificationData,
                    unreadData,
                ] = await Promise.all([
                    getNotifications(),
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

            }

        };

    useEffect(() => {

        loadNotifications();

    }, []);

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

        <div>

            <NotificationToolbar

                unread={unread}

                onReadAll={
                    handleReadAll
                }

                onClear={
                    handleClear
                }

            />

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

        </div>

    );

}

export default Notifications;