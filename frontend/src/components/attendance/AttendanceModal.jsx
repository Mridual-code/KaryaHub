import { useEffect, useState } from "react";

function AttendanceModal({
    open,
    onClose,
    onSave,
    initialData,
}) {

    const [status, setStatus] =
        useState("Present");

    const [checkIn, setCheckIn] =
        useState("");

    const [checkOut, setCheckOut] =
        useState("");

    useEffect(() => {

        if (initialData) {

            setStatus(
                initialData.status || "Present"
            );

            setCheckIn(
                initialData.checkIn
                    ? initialData.checkIn.slice(11, 16)
                    : ""
            );

            setCheckOut(
                initialData.checkOut
                    ? initialData.checkOut.slice(11, 16)
                    : ""
            );

        } else {

            setStatus("Present");
            setCheckIn("");
            setCheckOut("");

        }

    }, [initialData]);

    if (!open) return null;

    const handleSubmit = () => {

        onSave({
            status,
            checkIn,
            checkOut,
        });

    };

    return (

        <div className="modal-overlay">

            <div className="attendance-modal">

                <h2>

                    {initialData
                        ? "Update Attendance"
                        : "Mark Attendance"}

                </h2>

                <div className="form-group">

                    <label>Status</label>

                    <select
                        value={status}
                        onChange={(e) =>
                            setStatus(e.target.value)
                        }
                    >

                        <option value="Present">
                            Present
                        </option>

                        <option value="Absent">
                            Absent
                        </option>

                        <option value="Half Day">
                            Half Day
                        </option>

                        <option value="On Leave">
                            On Leave
                        </option>

                    </select>

                </div>

                <div className="attendance-time-grid">

                    <div className="form-group">

                        <label>Check In</label>

                        <input
                            type="time"
                            value={checkIn}
                            onChange={(e) =>
                                setCheckIn(
                                    e.target.value
                                )
                            }
                        />

                    </div>

                    <div className="form-group">

                        <label>Check Out</label>

                        <input
                            type="time"
                            value={checkOut}
                            onChange={(e) =>
                                setCheckOut(
                                    e.target.value
                                )
                            }
                        />

                    </div>

                </div>

                <div className="modal-actions">

                    <button
                        className="secondary-btn"
                        onClick={onClose}
                    >
                        Cancel
                    </button>

                    <button
                        className="primary-btn"
                        onClick={handleSubmit}
                    >
                        Save Attendance
                    </button>

                </div>

            </div>

        </div>

    );

}

export default AttendanceModal;