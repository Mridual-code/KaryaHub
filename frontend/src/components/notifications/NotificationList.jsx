import NotificationCard from "./NotificationCard";

function NotificationList({
    notifications,
    onRead,
    onDelete,
}) {

    if (
        notifications.length === 0
    ) {
        return (

            <div className="table-card">

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

    );
}

export default NotificationList;