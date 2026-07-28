function RecentEmployees({ employees = [] }) {
  return (
    <div className="table-card">
      <div className="table-header">
        <h3>Recent Employees</h3>
      </div>

      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Employee ID</th>
            <th>Department</th>
            <th>Designation</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {employees.length === 0 ? (
            <tr>
              <td
                colSpan="5"
                style={{
                  textAlign: "center",
                  padding: "25px",
                }}
              >
                No employees found
              </td>
            </tr>
          ) : (
            employees.map((emp) => (
              <tr key={emp._id}>
                <td>{emp.user?.name}</td>

                <td>{emp.employeeId}</td>

                <td>
                  {emp.department?.name}
                </td>

                <td>
                  {emp.designation}
                </td>

                <td>
                  <span
                    className={`status-badge ${
                      emp.employmentStatus ===
                      "Active"
                        ? "active"
                        : "inactive"
                    }`}
                  >
                    {emp.employmentStatus}
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

export default RecentEmployees;