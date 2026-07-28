import {
  Link
} from "react-router-dom";

function NotFound() {
  return (
    <main className="error-page">
      <div className="error-card">
        <span className="error-code">
          404
        </span>

        <h1>Page not found</h1>

        <p>
          The page you requested does
          not exist.
        </p>

        <Link
          to="/"
          className="primary-button"
        >
          Go back
        </Link>
      </div>
    </main>
  );
}

export default NotFound;