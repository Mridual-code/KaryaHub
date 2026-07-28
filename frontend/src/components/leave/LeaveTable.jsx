import {
    FaCheck,
    FaTimes,
} from "react-icons/fa";

function LeaveTable({
    leaves,
    onApprove,
    onReject,
}) {
    return (
        <div className="table-card">

            <table className="dashboard-table">

                <thead>

                    <tr>

                        <th>Name</th>

                        <th>Leave Type</th>

                        <th>From</th>

                        <th>To</th>

                        <th>Status</th>

                        <th>Actions</th>

                    </tr>

                </thead>

                <tbody>

                    {leaves.length === 0 ? (

                        <tr>

                            <td colSpan="6">
                                No Leave Requests
                            </td>

                        </tr>

                    ) : (

                        leaves.map((leave) => (

                            <tr key={leave._id}>

                                <td>
                                    {leave.employee?.user?.name}
                                </td>

                                <td>
                                    {leave.leaveType}
                                </td>

                                <td>
                                    {new Date(
                                        leave.startDate
                                    ).toLocaleDateString()}
                                </td>

                                <td>
                                    {new Date(
                                        leave.endDate
                                    ).toLocaleDateString()}
                                </td>

                                <td>

                                    <span
                                        className={`status-badge ${leave.status.toLowerCase()}`}
                                    >
                                        {leave.status}
                                    </span>

                                </td>

                               <td>
    {leave.status === "Pending" ? (
        <>
            <button onClick={() => onApprove(leave)}>
                <FaCheck />
            </button>

            <button onClick={() => onReject(leave)}>
                <FaTimes />
            </button>
        </>
    ) : (
        "-"
    )}
</td>

                            </tr>

                        ))

                    )}

                </tbody>

            </table>

        </div>
    );
}

export default LeaveTable;