function NotificationToolbar({

    unread,

    onReadAll,

    onClear,

}) {

    return (

        <div className="page-header">

            <div>

                <h1>
                    Notifications
                </h1>

                <p>

                    {unread} unread
                    notifications

                </p>

            </div>

            <div
                style={{
                    display:"flex",
                    gap:"10px",
                }}
            >

                <button
                    className="primary-btn"
                    onClick={onReadAll}
                >
                    Mark All Read
                </button>

                <button
                    onClick={onClear}
                >
                    Clear
                </button>

            </div>

        </div>

    );

}

export default NotificationToolbar;