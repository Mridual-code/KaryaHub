import { Link } from "react-router-dom";

function Unauthorized() {
  return (
    <div
      style={{
        height: "100vh",
        display: "grid",
        placeItems: "center",
        textAlign: "center"
      }}
    >
      <div>
        <h1>403</h1>

        <h2>Access Denied</h2>

        <p>
          You don't have permission to access
          this page.
        </p>

        <Link to="/">
          Go to Login
        </Link>
      </div>
    </div>
  );
}

export default Unauthorized;