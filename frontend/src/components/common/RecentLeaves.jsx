function RecentLeaves({ leaves = [] }) {
  return (
    <div className="table-card">
      <div className="table-header">
        <h3>Pending Leave Requests</h3>
      </div>

      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Department</th>
            <th>Leave Type</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {leaves.length === 0 ? (
            <tr>
              <td
                colSpan="4"
                style={{
                  textAlign: "center",
                  padding: "25px",
                }}
              >
                No leave requests found
              </td>
            </tr>
          ) : (
            leaves.map((leave) => (
              <tr key={leave._id}>
                <td>
                  {leave.employee?.user?.name}
                </td>

                <td>
                  {leave.employee?.department?.name}
                </td>

                <td>{leave.leaveType}</td>

                <td>
                  <span className="status-badge pending">
                    {leave.status}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default RecentLeaves;