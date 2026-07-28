function EmployeeToolbar({
  search,
  setSearch,
  onAdd,
}) {
  return (
    <div className="employee-toolbar">

      <input
        type="text"
        placeholder="Search employees..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      <button
        className="primary-btn"
        onClick={onAdd}
      >
        + Add Employee
      </button>

    </div>
  );
}

export default EmployeeToolbar;