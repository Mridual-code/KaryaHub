function NotificationToolbar({

    unread,

    search,

    onSearch,

    onReadAll,

    onClear,

}) {

    return (

        <div className="page-header notification-toolbar">

            <div>

                <h1>
                    Notifications
                </h1>

                <p>
                    {unread} unread notification
                    {unread !== 1 ? "s" : ""}
                </p>

            </div>

            <div className="notification-toolbar-actions">

                <input
                    type="text"
                    placeholder="Search notifications..."
                    value={search}
                    onChange={(e) =>
                        onSearch(
                            e.target.value
                        )
                    }
                    className="notification-search"
                />

                <button
                    className="primary-btn"
                    onClick={onReadAll}
                >
                    Mark All Read
                </button>

                <button
                    className="danger-btn"
                    onClick={onClear}
                >
                    Clear All
                </button>

            </div>

        </div>

    );

}

export default NotificationToolbar;