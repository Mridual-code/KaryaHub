function DeleteEmployeeModal({
  open,
  employee,
  onClose,
  onDelete,
}) {
  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div
        className="modal"
        style={{ maxWidth: "420px" }}
      >
        <h2>Delete Employee</h2>

        <p
          style={{
            margin: "20px 0",
            lineHeight: 1.6,
          }}
        >
          Are you sure you want to delete

          <strong>
            {" "}
            {employee?.user?.name}
          </strong>

          ?
        </p>

        <div className="modal-actions">
          <button onClick={onClose}>
            Cancel
          </button>

          <button
            className="danger-btn"
            onClick={() =>
              onDelete(employee._id)
            }
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteEmployeeModal;