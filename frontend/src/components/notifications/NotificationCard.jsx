import {
    FaBell,
    FaCheck,
    FaTrash,
} from "react-icons/fa";

function NotificationCard({
    notification,
    onRead,
    onDelete,
})   { 
    const formatTimeAgo = (date) => {

    const seconds = Math.floor(
        (Date.now() - new Date(date)) / 1000
    );

    if (seconds < 60)
        return "Just now";

    const minutes = Math.floor(seconds / 60);

    if (minutes < 60)
        return `${minutes} min ago`;

    const hours = Math.floor(minutes / 60);

    if (hours < 24)
        return `${hours} hr ago`;

    const days = Math.floor(hours / 24);

    if (days === 1)
        return "Yesterday";

    return `${days} days ago`;

};
    return (
        <div
            className={`notification-card ${
                !notification.isRead
                    ? "unread"
                    : ""
            }`}
        >
            <div className="notification-header">

                <div className="notification-title">

                    <FaBell />

                    <h3>
                        {notification.title}
                    </h3>

                </div>

                <span
                    className={`status-badge ${notification.type.toLowerCase()}`}
                >
                    {notification.type}
                </span>
                 {!notification.isRead && (
        <span className="notification-dot" />
    )}

            </div>

            <p>
                {notification.message}
            </p>

            {notification.sender && (

               <small className="notification-sender">

    From:
    {" "}
    <strong>
        {notification.sender.name}
    </strong>

</small>
            )}

            <small className="notification-time">
    {formatTimeAgo(
        notification.createdAt
    )}
</small>

            <div className="notification-actions">

                {!notification.isRead && (

                    <button
                        className="primary-btn"
                        onClick={(e) => {

    e.stopPropagation();

    onRead(notification._id);

}}
                    >
                        <FaCheck />
                    </button>

                )}

                <button
                    className="danger-btn"
                    onClick={(e) => {

    e.stopPropagation();

    onDelete(notification._id);

}}
                >
                    <FaTrash />
                </button>

            </div>

        </div>
    );
}

export default NotificationCard;