import {
    FaBell,
    FaCheck,
    FaTrash,
} from "react-icons/fa";

function NotificationCard({
    notification,
    onRead,
    onDelete,
}) {
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

            </div>

            <p>
                {notification.message}
            </p>

            {notification.sender && (

                <small>
                    From:
                    {" "}
                    {notification.sender.name}
                </small>

            )}

            <small>
                {new Date(
                    notification.createdAt
                ).toLocaleString()}
            </small>

            <div className="notification-actions">

                {!notification.isRead && (

                    <button
                        className="primary-btn"
                        onClick={() =>
                            onRead(notification._id)
                        }
                    >
                        <FaCheck />
                    </button>

                )}

                <button
                    className="danger-btn"
                    onClick={() =>
                        onDelete(notification._id)
                    }
                >
                    <FaTrash />
                </button>

            </div>

        </div>
    );
}

export default NotificationCard;