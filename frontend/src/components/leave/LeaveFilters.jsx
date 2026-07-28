function LeaveFilters({
    status,
    setStatus,
}) {
    return (
        <div className="employee-filters">

            <select
                value={status}
                onChange={(e) =>
                    setStatus(e.target.value)
                }
            >
                <option value="">
                    All Status
                </option>

                <option value="Pending">
                    Pending
                </option>

                <option value="Approved">
                    Approved
                </option>

                <option value="Rejected">
                    Rejected
                </option>

            </select>

        </div>
    );
}

export default LeaveFilters;