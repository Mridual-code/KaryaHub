import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";
import { USER_ROLES } from "../../utils/constants";

function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] =
    useState(false);

  const handleChange = (e) => {
    setForm((previousForm) => ({
      ...previousForm,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.email.trim() ||
      !form.password
    ) {
      toast.error(
        "Please enter your email and password"
      );
      return;
    }

    try {
      setLoading(true);

      const loggedInUser =
        await login(
          form.email,
          form.password
        );

      toast.success(
        "Login successful"
      );

      switch (
        loggedInUser.role
      ) {
        case USER_ROLES.ADMIN:
          navigate("/admin");
          break;

        case USER_ROLES.HR:
          navigate("/hr");
          break;

        case USER_ROLES.EMPLOYEE:
          navigate("/employee");
          break;

        default:
          toast.error(
            "Invalid user role"
          );
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Unable to login"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form
        className="login-card"
        onSubmit={handleSubmit}
      >
        <div className="login-brand">
          <div className="login-logo">
            K
          </div>

          <div>
            <h1>KaryaHub</h1>

            <p>
              Modern HR &
              Workforce
              Management
            </p>
          </div>
        </div>

        <div className="login-heading">
          <h2>
            Welcome back
          </h2>

          <p>
            Sign in to continue
            to your workspace.
          </p>
        </div>

        <div className="form-group">
          <label htmlFor="email">
            Email Address
          </label>

          <input
            id="email"
            type="email"
            name="email"
            placeholder="name@company.com"
            value={form.email}
            onChange={
              handleChange
            }
            autoComplete="email"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">
            Password
          </label>

          <input
            id="password"
            type="password"
            name="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={
              handleChange
            }
            autoComplete="current-password"
            required
          />
        </div>

        <button
          className="login-button"
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Signing In..."
            : "Sign In"}
        </button>
      </form>
    </div>
  );
}

export default Login;