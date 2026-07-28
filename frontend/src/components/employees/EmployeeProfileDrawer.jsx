function EmployeeProfileDrawer({
  open,
  employee,
  onClose,
}) {
  if (!open || !employee)
    return null;

  return (
    <div className="drawer-overlay">
      <div className="profile-drawer">

        <div className="drawer-header">

          <h2>Employee Details</h2>

          <button onClick={onClose}>
            ✕
          </button>

        </div>

        <div className="drawer-content">

          <div className="profile-avatar">
            {employee.user?.name
              ?.charAt(0)
              ?.toUpperCase()}
          </div>

          <h3>
            {employee.user?.name}
          </h3>

          <p>
            {employee.user?.email}
          </p>

          <hr />

          <div className="profile-grid">

            <div>
              <strong>
                Employee ID
              </strong>

              <p>
                {employee.employeeId}
              </p>
            </div>

            <div>
              <strong>
                Department
              </strong>

              <p>
                {
                  employee.department
                    ?.name
                }
              </p>
            </div>

            <div>
              <strong>
                Designation
              </strong>

              <p>
                {
                  employee.designation
                }
              </p>
            </div>

            <div>
              <strong>Status</strong>

              <p>
                {
                  employee.employmentStatus
                }
              </p>
            </div>

            <div>
              <strong>
                Joining Date
              </strong>

              <p>
                {new Date(
                  employee.joiningDate
                ).toLocaleDateString()}
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default EmployeeProfileDrawer;