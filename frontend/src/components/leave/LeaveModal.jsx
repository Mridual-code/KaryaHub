function LeaveModal({
    open,
    onClose,
    onApprove,
    onReject,
}) {
    if (!open) return null;

    return (
        <div className="modal-overlay">

            <div className="modal">

                <h2>
                    Update Leave Request
                </h2>

                <div className="modal-actions">

                    <button
                        className="primary-btn"
                        onClick={onApprove}
                    >
                        Approve
                    </button>

                    <button
                        onClick={onReject}
                    >
                        Reject
                    </button>

                    <button
                        onClick={onClose}
                    >
                        Cancel
                    </button>

                </div>

            </div>

        </div>
    );
}

export default LeaveModal;