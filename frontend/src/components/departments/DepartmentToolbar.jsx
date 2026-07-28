function DepartmentToolbar({
  search,
  setSearch,
  onAdd,
}) {
  return (
    <div className="toolbar">

      <input
        type="text"
        placeholder="Search department..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      <button
        className="primary-btn"
        onClick={onAdd}
      >
        + Add Department
      </button>

    </div>
  );
}

export default DepartmentToolbar;