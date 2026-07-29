import "./../../styles/dashboard.css";

function StatCard({
  title,
  value,
  icon,
  color = "#2563eb",
  subtitle,
}) {
  return (
    <div className="stat-card">
      <div
        className="stat-card-icon"
        style={{
          background: `${color}15`,
          color,
        }}
      >
        {icon}
      </div>

      <div className="stat-card-content">
        <span className="stat-card-title">
          {title}dashbo
        </span>

        <h2 className="stat-card-value">
          {value}
        </h2>

        {subtitle && (
          <span className="stat-card-subtitle">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}

export default StatCard;