import {
  FaEdit,
  FaEye,
  FaTrash,
} from "react-icons/fa";

function EmployeeTable({
  employees = [],
  onView,
  onEdit,
  onDelete,
}) {
  return (
    <div className="table-card">

      <table className="dashboard-table">

        <thead>

          <tr>

            <th>Name</th>

            <th>Employee ID</th>

            <th>Department</th>

            <th>Designation</th>

            <th>Status</th>

            <th>Actions</th>

          </tr>

        </thead>

        <tbody>

          {employees.length === 0 ? (

            <tr>

              <td
                colSpan="6"
                style={{
                  textAlign: "center",
                  padding: "25px",
                }}
              >
                No Employees Found
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

                <td>

                  <div className="table-actions">

                    <button
                      onClick={() =>
                        onView(emp)
                      }
                    >
                      <FaEye />
                    </button>

                    <button
                      onClick={() =>
                        onEdit(emp)
                      }
                    >
                      <FaEdit />
                    </button>

                    <button
                      onClick={() =>
                        onDelete(emp)
                      }
                    >
                      <FaTrash />
                    </button>

                  </div>

                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>
  );
}

export default EmployeeTable;