import {
  FaBars,
  FaBell,
  FaChevronDown,
  FaSearch,
  FaUser,
  FaSignOutAlt,
  FaSun,
  FaMoon
} from "react-icons/fa";

import {
  Link,
  useNavigate
} from "react-router-dom";

import {
  useEffect,
  useRef,
  useState
} from "react";

import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../context/ThemeContext";

import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead
} from "../../services/notificationService";
function Navbar({ toggleSidebar }) {

  const {
    user,
    logout
  } = useAuth();

  const navigate = useNavigate();
  const {
  theme,
  toggleTheme
} = useTheme();

  const firstLetter =
    user?.name?.charAt(0)?.toUpperCase() ||
    "U";

  const rolePath =
    user?.role?.toLowerCase() || "";

  const notificationPath =
    `/${rolePath}/notifications`;

  const profilePath =
    `/${rolePath}/profile`;

  const [notifications, setNotifications] =
    useState([]);

  const [unread, setUnread] =
    useState(0);

  const [notificationOpen, setNotificationOpen] =
    useState(false);

  const [profileOpen, setProfileOpen] =
    useState(false);

  const [loading, setLoading] =
   useState(false);

  const notificationRef =
    useRef(null);

  const profileRef =
    useRef(null);

  useEffect(() => {

    const loadNotifications = async () => {

  try {

    setLoading(true);

    const unreadData =
      await getUnreadCount();

    setUnread(
      unreadData.unreadCount || 0
    );

    const notificationData =
      await getNotifications();

    setNotifications(
      notificationData.notifications || []
    );

  } catch (err) {

    console.error(err);

  } finally {

    setLoading(false);

  }

};

    loadNotifications();

  }, []);

  useEffect(() => {

    const closeMenus = (e) => {

      if (
        notificationRef.current &&
        !notificationRef.current.contains(
          e.target
        )
      ) {
        setNotificationOpen(false);
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(
          e.target
        )
      ) {
        setProfileOpen(false);
      }

    };

    document.addEventListener(
      "mousedown",
      closeMenus
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        closeMenus
      );

  }, []);

  const handleLogout = () => {

  setProfileOpen(false);

  logout();

  navigate("/");

};
  const handleNotificationClick =
  async (notification) => {

    try {

      if (!notification.isRead) {

        await markAsRead(
          notification._id
        );

        setNotifications((prev) =>
          prev.map((item) =>
            item._id === notification._id
              ? {
                  ...item,
                  isRead: true
                }
              : item
          )
        );

        setUnread((prev) =>
          Math.max(prev - 1, 0)
        );

      }

      setNotificationOpen(false);

      navigate(notificationPath);

    } catch (err) {

      console.error(err);

    }

  };


const handleMarkAllRead =
  async () => {

    try {

      await markAllAsRead();

      setNotifications((prev) =>
        prev.map((item) => ({
          ...item,
          isRead: true
        }))
      );

      setUnread(0);

    } catch (err) {

      console.error(err);

    }

  };
  const formatTimeAgo = (date) => {

  const seconds =
    Math.floor(
      (Date.now() - new Date(date)) / 1000
    );

  if (seconds < 60)
    return "Just now";

  const minutes =
    Math.floor(seconds / 60);

  if (minutes < 60)
    return `${minutes} min ago`;

  const hours =
    Math.floor(minutes / 60);

  if (hours < 24)
    return `${hours} hr ago`;

  const days =
    Math.floor(hours / 24);

  if (days === 1)
    return "Yesterday";

  return `${days} days ago`;

};

  return (
    <header className="dashboard-navbar">
      <div className="navbar-left">
        <button
          type="button"
          className="navbar-menu-button"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <FaBars />
        </button>

        <div className="navbar-search">
          <FaSearch />

          <input
            type="text"
            placeholder="Search..."
          />
        </div>
      </div>

      <div className="navbar-right">
        <button
  type="button"
  className="navbar-icon-button"
  onClick={toggleTheme}
  title={
    theme === "dark"
      ? "Switch to Light Mode"
      : "Switch to Dark Mode"
  }
>
  {theme === "dark"
    ? <FaSun />
    : <FaMoon />}
</button>

  <div
    className="notification-wrapper"
    ref={notificationRef}
  >
    <button
      type="button"
      className="navbar-icon-button"
      onClick={async () => {

  if (!notificationOpen) {

    const unreadData =
      await getUnreadCount();

    setUnread(
      unreadData.unreadCount || 0
    );

    const notificationData =
      await getNotifications();

    setNotifications(
      notificationData.notifications || []
    );

  }

  setNotificationOpen(
    !notificationOpen
  );

}}
    >
      <FaBell />

      {unread > 0 && (
        <span className="notification-badge">
          {unread}
        </span>
      )}
    </button>

    {notificationOpen && (
      <div className="notification-dropdown">

        <div className="notification-header">

  <h4>Notifications</h4>

  {unread > 0 && (
    <button
      type="button"
      className="mark-all-btn"
      onClick={handleMarkAllRead}
    >
      Mark all
    </button>
  )}

</div>

        {notifications.length === 0 ? (
          <div className="notification-empty">

  <FaBell
    className="empty-icon"
  />

  <p>
    You're all caught up!
  </p>

</div>
        ) : (
          notifications
            .slice(0, 5)
            .map((notification) => (
              <div
  key={notification._id}
  className={`notification-item ${
    notification.isRead
      ? ""
      : "unread"
  }`}
  onClick={() =>
    handleNotificationClick(
      notification
    )
  }
>
                <strong>
                  {notification.title}
                </strong>

                <p>
                  {notification.message}
                </p>

                <small>
  {formatTimeAgo(
    notification.createdAt
  )}
</small>
              </div>
            ))
        )}

        <Link
          to={notificationPath}
          className="view-all-btn"
          onClick={() =>
            setNotificationOpen(false)
          }
        >
          View All Notifications
        </Link>

      </div>
    )}

  </div>

  <div
    className="navbar-profile-wrapper"
    ref={profileRef}
  >

    <button
      type="button"
      className="navbar-profile"
      onClick={() =>
        setProfileOpen(!profileOpen)
      }
    >

      <div className="navbar-avatar">
        {firstLetter}
      </div>

      <div className="navbar-user-info">
        <strong>
          {user?.name || "User"}
        </strong>

        <span>
          {user?.role || ""}
        </span>
      </div>

      <FaChevronDown
        className={`navbar-chevron ${
          profileOpen ? "rotate" : ""
        }`}
      />

    </button>

    {profileOpen && (
      <div className="navbar-dropdown">

        <Link
  to={profilePath}
  onClick={() => {

    setProfileOpen(false);

  }}
>
          <FaUser />
          <span>Profile</span>
        </Link>

        <button
          type="button"
          onClick={handleLogout}
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>

      </div>
    )}

  </div>

</div>
    </header>
  );
}

export default Navbar;