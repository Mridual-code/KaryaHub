import { useState } from "react";

function ApplyLeaveModal({
  open,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState({
    leaveType: "Casual",
    startDate: "",
    endDate: "",
    reason: "",
  });

  if (!open) return null;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit(form);

    setForm({
      leaveType: "Casual",
      startDate: "",
      endDate: "",
      reason: "",
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Apply Leave</h2>

        <form
          onSubmit={handleSubmit}
          className="form-grid"
        >
          <select
            name="leaveType"
            value={form.leaveType}
            onChange={handleChange}
          >
            <option value="Casual Leave">Casual Leave</option>
<option value="Sick Leave">Sick Leave</option>
<option value="Earned Leave">Earned Leave</option>
<option value="Maternity Leave">Maternity Leave</option>
<option value="Paternity Leave">Paternity Leave</option>
<option value="Unpaid Leave">Unpaid Leave</option>
<option value="Other">Other</option>
          </select>

          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            required
          />

          <input
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
            required
          />

          <textarea
            name="reason"
            placeholder="Reason"
            value={form.reason}
            onChange={handleChange}
            rows={4}
            required
          />

          <div className="modal-actions">
            <button
              type="submit"
              className="primary-btn"
            >
              Apply
            </button>

            <button
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default ApplyLeaveModal;