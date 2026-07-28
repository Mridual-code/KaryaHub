import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  getProfile,
  updateProfile,
  changePassword,
} from "../../services/profileService";

function Profile() {
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    role: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const res = await getProfile();

      const user = res.user || {};

      setProfile({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "",
      });
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to load profile."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleProfileChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await updateProfile({
        name: profile.name,
        email: profile.email,
      });

      toast.success(
        res.message ||
          "Profile updated successfully."
      );

      fetchProfile();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to update profile."
      );
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (
      passwordData.newPassword !==
      passwordData.confirmPassword
    ) {
      return toast.error(
        "Passwords do not match."
      );
    }

    try {
      const res = await changePassword({
        currentPassword:
          passwordData.currentPassword,
        newPassword:
          passwordData.newPassword,
      });

      toast.success(
        res.message ||
          "Password changed successfully."
      );

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to change password."
      );
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="page-container">

      <div className="page-header">
        <h1>My Profile</h1>
      </div>

      {/* Profile */}

      <div className="table-card">

        <h2>Profile Information</h2>

        <form
          onSubmit={handleProfileSubmit}
          className="form-grid"
        >
          <div className="form-group">
            <label>Name</label>

            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={
                handleProfileChange
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={
                handleProfileChange
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Role</label>

            <input
              type="text"
              value={profile.role}
              disabled
            />
          </div>

          <button
            type="submit"
            className="primary-btn"
          >
            Save Changes
          </button>
        </form>

      </div>

      {/* Change Password */}

      <div className="table-card">

        <h2>Change Password</h2>

        <form
          onSubmit={handlePasswordSubmit}
          className="form-grid"
        >
          <div className="form-group">
            <label>
              Current Password
            </label>

            <input
              type="password"
              name="currentPassword"
              value={
                passwordData.currentPassword
              }
              onChange={
                handlePasswordChange
              }
              required
            />
          </div>

          <div className="form-group">
            <label>
              New Password
            </label>

            <input
              type="password"
              name="newPassword"
              value={
                passwordData.newPassword
              }
              onChange={
                handlePasswordChange
              }
              required
            />
          </div>

          <div className="form-group">
            <label>
              Confirm Password
            </label>

            <input
              type="password"
              name="confirmPassword"
              value={
                passwordData.confirmPassword
              }
              onChange={
                handlePasswordChange
              }
              required
            />
          </div>

          <button
            type="submit"
            className="primary-btn"
          >
            Update Password
          </button>
        </form>

      </div>

    </div>
  );
}

export default Profile;