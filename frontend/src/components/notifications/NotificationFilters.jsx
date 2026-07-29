function NotificationFilters({

    filter,

    onFilterChange,

}) {

    return (

        <div className="notification-filters">

            <button
                className={
                    filter === "all"
                        ? "active"
                        : ""
                }
                onClick={() =>
                    onFilterChange("all")
                }
            >
                All
            </button>

            <button
                className={
                    filter === "read"
                        ? "active"
                        : ""
                }
                onClick={() =>
                    onFilterChange("read")
                }
            >
                Read
            </button>

            <button
                className={
                    filter === "unread"
                        ? "active"
                        : ""
                }
                onClick={() =>
                    onFilterChange("unread")
                }
            >
                Unread
            </button>

        </div>

    );

}

export default NotificationFilters;