import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import LeaveFilters from "../../components/leave/LeaveFilters";
import MyLeaveTable from "../../components/leave/MyLeaveTable";
import ApplyLeaveModal from "../../components/leave/ApplyLeaveModal";

import {
  getMyLeaves,
  applyLeave,
  cancelLeave,
} from "../../services/leaveService";

function Leaves() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState("");

  const [showModal, setShowModal] =
    useState(false);

  const fetchLeaves = async () => {
    try {
      setLoading(true);

      const res =
        await getMyLeaves({
          status,
        });

      setLeaves(
        res.leaves || res.data || []
      );
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to load leave requests."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [status]);

  const handleApply = async (data) => {
    try {
      await applyLeave(data);

      toast.success(
        "Leave request submitted."
      );

      setShowModal(false);

      fetchLeaves();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Unable to apply leave."
      );
    }
  };

  const handleCancel = async (id) => {
    if (
      !window.confirm(
        "Cancel this leave request?"
      )
    )
      return;

    try {
      await cancelLeave(id);

      toast.success(
        "Leave request cancelled."
      );

      fetchLeaves();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Unable to cancel leave."
      );
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>My Leaves</h1>

        <button
          className="primary-btn"
          onClick={() =>
            setShowModal(true)
          }
        >
          Apply Leave
        </button>
      </div>

      <LeaveFilters
        status={status}
        setStatus={setStatus}
      />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <MyLeaveTable
          leaves={leaves}
          onCancel={handleCancel}
        />
      )}

      <ApplyLeaveModal
        open={showModal}
        onClose={() =>
          setShowModal(false)
        }
        onSubmit={handleApply}
      />
    </div>
  );
}

export default Leaves;