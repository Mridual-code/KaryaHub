import {
  FaBars,
  FaBell,
  FaChevronDown,
  FaSearch,
  FaUser,
  FaSignOutAlt
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

import {
  getUnreadCount,
  getNotifications
} from "../../services/notificationService";

function Navbar({ toggleSidebar }) {
  const {
    user,
    logout
  } = useAuth();
  const navigate = useNavigate();
  console.log("Navbar Rendered");

  const [unread, setUnread] = useState(0);

const [notifications, setNotifications] = useState([]);

const [menuOpen, setMenuOpen] = useState(false);

const [notificationOpen, setNotificationOpen] =
  useState(false);

const menuRef = useRef(null);

const notificationRef = useRef(null);

useEffect(() => {
  const loadNotifications = async () => {
    try {
      console.log("Navbar mounted");

      const unreadData = await getUnreadCount();
      console.log("Unread:", unreadData);

      const notificationData = await getNotifications();
      console.log("Notifications:", notificationData);

      setUnread(unreadData.unreadCount || 0);
      setNotifications(notificationData.notifications || []);
    } catch (err) {
      console.error("Notification Error:", err);
    }
  };

  loadNotifications();
}, []);

  useEffect(() => {
  const loadNotifications = async () => {
    try {
      console.log("Navbar mounted");

      const unreadData = await getUnreadCount();
      console.log("Unread:", unreadData);

      const notificationData = await getNotifications();
      console.log("Notifications:", notificationData);

      setUnread(unreadData.unreadCount || 0);
      setNotifications(notificationData.notifications || []);
    } catch (err) {
      console.error("Notification Error:", err);
    }
  };

  loadNotifications();
}, []);

  const firstLetter =
    user?.name?.charAt(0)?.toUpperCase() ||
    "U";

  const rolePath =
    user?.role?.toLowerCase() || "";

  const notificationPath = `/${rolePath}/notifications`;

  const profilePath = `/${rolePath}/profile`;

  const handleLogout = () => {
    logout();
    navigate("/");
};
console.log("notificationOpen:", notificationOpen);
  return (
    <header className="dashboard-navbar">
      <div className="navbar-left">

        <button
          type="button"
          className="navbar-menu-button"
          onClick={toggleSidebar}
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

       <div
  className="notification-wrapper"
  ref={notificationRef}
>
  <button
  type="button"
  className="navbar-icon-button notification-link"
  onClick={() => {
    console.log("Bell clicked");
    setNotificationOpen(prev => !prev);
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
      </div>

      {notifications.length === 0 ? (
        <div className="notification-empty">
          No notifications
        </div>
      ) : (
        notifications.map((notification) => (
          <div
            key={notification._id}
            className={`notification-item ${
              !notification.isRead
                ? "unread"
                : ""
            }`}
          >
            <strong>
              {notification.title}
            </strong>

            <p>
              {notification.message}
            </p>

            <small>
              {new Date(
                notification.createdAt
              ).toLocaleString()}
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
          ref={menuRef}
        >
          <button
            type="button"
            className="navbar-profile"
            onClick={() =>
              setMenuOpen(
                !menuOpen
              )
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
                {user?.role}
              </span>
            </div>

            <FaChevronDown
              className={`navbar-chevron ${
                menuOpen
                  ? "rotate"
                  : ""
              }`}
            />
          </button>

          {menuOpen && (
            <div className="navbar-dropdown">

              <Link
                to={profilePath}
                onClick={() =>
                  setMenuOpen(false)
                }
              >
                <FaUser />
                Profile
              </Link>

              <button
                type="button"
                onClick={
                  handleLogout
                }
              >
                <FaSignOutAlt />
                Logout
              </button>

            </div>
          )}

        </div>

      </div>
    </header>
  );
}

export default Navbar;