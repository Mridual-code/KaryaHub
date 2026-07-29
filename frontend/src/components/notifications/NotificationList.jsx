import NotificationCard from "./NotificationCard";

function NotificationList({
    notifications,
    loading,
    onRead,
    onDelete,
}) { if (loading) {
    return (
        <div className="table-card">
            <p>Loading notifications...</p>
        </div>
    );
}

    if (
        notifications.length === 0
    ) {
        return (

            <div className="table-card notification-empty">

    <div className="notification-empty-icon">
    🔔
</div>

<h3>
You're all caught up!
</h3>

<p>
No new notifications right now.
We'll notify you whenever something important happens.
</p>

    <p>
        No notifications found.
    </p>

</div>
        );
    }

    return (

        <div className="notification-list">

            {notifications.map(
                (notification) => (

                    <NotificationCard
                        key={notification._id}
                        notification={
                            notification
                        }
                        onRead={onRead}
                        onDelete={onDelete}
                    />

                )
            )}

        </div>

/* Pagination will be added here */

    );
}

export default NotificationList;