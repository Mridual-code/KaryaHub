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
  getNotifications,
  getUnreadCount
} from "../../services/notificationService";
function Navbar({ toggleSidebar }) {

  const {
    user,
    logout
  } = useAuth();

  const navigate = useNavigate();

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

  const notificationRef =
    useRef(null);

  const profileRef =
    useRef(null);

  useEffect(() => {

    const loadNotifications = async () => {

      try {

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

    logout();

    navigate("/");

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

  <div
    className="notification-wrapper"
    ref={notificationRef}
  >
    <button
      type="button"
      className="navbar-icon-button"
      onClick={() =>
        setNotificationOpen(!notificationOpen)
      }
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
          onClick={() =>
            setProfileOpen(false)
          }
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