import { useState, useEffect } from "react";

function DepartmentModal({
  open,
  onClose,
  onSave,
  initialData,
}) {
  const [form, setForm] = useState({
    name: "",
    code: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm({
        name: "",
        code: "",
      });
    }
  }, [initialData]);

  if (!open) return null;

  return (
    <div className="modal-overlay">

      <div className="modal">

        <h2>
          {initialData
            ? "Edit Department"
            : "Add Department"}
        </h2>

        <input
          placeholder="Department Name"
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
        />

        <input
          placeholder="Department Code"
          value={form.code}
          onChange={(e) =>
            setForm({
              ...form,
              code: e.target.value,
            })
          }
        />

        <div className="modal-actions">

          <button
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="primary-btn"
            onClick={() =>
              onSave(form)
            }
          >
            Save
          </button>

        </div>

      </div>

    </div>
  );
}

export default DepartmentModal;