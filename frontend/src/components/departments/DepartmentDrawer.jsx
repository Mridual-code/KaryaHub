function DepartmentDrawer({
  department,
  onClose,
}) {
  if (!department) return null;

  return (
    <div className="drawer-overlay">

      <div className="drawer">

        <h2>
          {department.name}
        </h2>

        <p>
          <b>Code:</b>{" "}
          {department.code}
        </p>

        <p>
          <b>Status:</b>{" "}
          {department.isActive
            ? "Active"
            : "Inactive"}
        </p>

        <p>
          <b>Head:</b>{" "}
          {department.departmentHead?.user
            ?.name || "Not Assigned"}
        </p>

        <button
          className="primary-btn"
          onClick={onClose}
        >
          Close
        </button>

      </div>

    </div>
  );
}

export default DepartmentDrawer;