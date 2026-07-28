import { FaTimes } from "react-icons/fa";

function MyLeaveTable({
  leaves,
  onCancel,
}) {
  return (
    <div className="table-card">
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>From</th>
            <th>To</th>
            <th>Days</th>
            <th>Status</th>
            <th>Review</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {leaves.length === 0 ? (
            <tr>
              <td colSpan="7">
                No leave requests found.
              </td>
            </tr>
          ) : (
            leaves.map((leave) => (
              <tr key={leave._id}>
                <td>{leave.leaveType}</td>

                <td>
                  {new Date(
                    leave.startDate
                  ).toLocaleDateString()}
                </td>

                <td>
                  {new Date(
                    leave.endDate
                  ).toLocaleDateString()}
                </td>

                <td>{leave.totalDays}</td>

                <td>
                  <span
                    className={`status-badge ${leave.status
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                  >
                    {leave.status}
                  </span>
                </td>

                <td>
                  {leave.reviewComment ||
                    "-"}
                </td>

                <td>
                  {leave.status ===
                  "Pending" ? (
                    <button
                      className="danger-btn"
                      onClick={() =>
                        onCancel(leave._id)
                      }
                    >
                      <FaTimes />
                    </button>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default MyLeaveTable;