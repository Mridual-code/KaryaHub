import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";

function CheckInOutCard({
  today,
  onCheckIn,
  onCheckOut,
  loading
}) {
  const checkedIn = Boolean(today?.checkIn);
  const checkedOut = Boolean(today?.checkOut);

  return (
    <div className="attendance-card">

      <h3>Today's Attendance</h3>

      <div className="attendance-status">
        <span>Status</span>

        <strong>
          {today?.status || "Not Marked"}
        </strong>
      </div>

      <div className="attendance-times">

        <div>
          <label>Check In</label>

          <p>
            {today?.checkIn
              ? new Date(
                  today.checkIn
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit"
                })
              : "--"}
          </p>
        </div>

        <div>
          <label>Check Out</label>

          <p>
            {today?.checkOut
              ? new Date(
                  today.checkOut
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit"
                })
              : "--"}
          </p>
        </div>

      </div>

      <div className="attendance-actions">

        <button
          className="btn btn-primary"
          disabled={
            checkedIn || loading
          }
          onClick={onCheckIn}
        >
          <FaSignInAlt />
          Check In
        </button>

        <button
          className="btn btn-danger"
          disabled={
            !checkedIn ||
            checkedOut ||
            loading
          }
          onClick={onCheckOut}
        >
          <FaSignOutAlt />
          Check Out
        </button>

      </div>

    </div>
  );
}

export default CheckInOutCard;