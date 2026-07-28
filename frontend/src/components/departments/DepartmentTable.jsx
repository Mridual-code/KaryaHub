import { FaEdit, FaEye } from "react-icons/fa";

function DepartmentTable({
  departments,
  onView,
  onEdit,
}) {
  return (
    <div className="table-card">

      <table className="dashboard-table">

        <thead>
          <tr>
            <th>Name</th>
            <th>Code</th>
            <th>Head</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>

          {departments.length === 0 ? (
            <tr>
              <td colSpan="5">
                No Departments Found
              </td>
            </tr>
          ) : (
            departments.map((dept) => (
              <tr key={dept._id}>

                <td>{dept.name}</td>

                <td>{dept.code}</td>

                <td>
                  {dept.departmentHead?.user?.name ||
                    "Not Assigned"}
                </td>

                <td>
                  <span
                    className={`status-badge ${
                      dept.isActive
                        ? "active"
                        : "inactive"
                    }`}
                  >
                    {dept.isActive
                      ? "Active"
                      : "Inactive"}
                  </span>
                </td>

                <td>

                  <button
                    onClick={() =>
                      onView(dept)
                    }
                  >
                    <FaEye />
                  </button>

                  <button
                    onClick={() =>
                      onEdit(dept)
                    }
                  >
                    <FaEdit />
                  </button>

                </td>

              </tr>
            ))
          )}

        </tbody>

      </table>

    </div>
  );
}

export default DepartmentTable;