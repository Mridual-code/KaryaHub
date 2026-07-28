function TodayAttendanceCard({
  today
}) {
  return (
    <div className="attendance-summary-card">

      <h3>Today's Summary</h3>

      <div className="summary-grid">

        <div>
          <span>Status</span>

          <strong>
            {today?.status ||
              "Not Marked"}
          </strong>
        </div>

        <div>
          <span>Working Time</span>

          <strong>
            {today?.workingMinutes
              ? `${Math.floor(
                  today.workingMinutes /
                    60
                )}h ${
                  today.workingMinutes %
                  60
                }m`
              : "--"}
          </strong>
        </div>

      </div>

    </div>
  );
}

export default TodayAttendanceCard;