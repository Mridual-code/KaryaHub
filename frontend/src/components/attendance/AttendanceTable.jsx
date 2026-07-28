import {
    FaEdit,
    FaCalendarAlt,
    FaUserCircle,
} from "react-icons/fa";

function AttendanceTable({
    attendance,
    onEdit,
    onViewCalendar,
}) {

    const calculateHours = (checkIn, checkOut) => {

        if (!checkIn || !checkOut)
            return "--";

        const start = new Date(checkIn);
        const end = new Date(checkOut);

        const diff =
            (end - start) /
            (1000 * 60 * 60);

        return `${diff.toFixed(1)} hrs`;
    };

    return (

        <div className="table-card">

            <table className="dashboard-table">

                <thead>

                    <tr>

                        <th>Employee</th>

                        <th>ID</th>

                        <th>Department</th>

                        <th>Date</th>

                        <th>Check In</th>

                        <th>Check Out</th>

                        <th>Working Hours</th>

                        <th>Status</th>

                        <th>Actions</th>

                    </tr>

                </thead>

                <tbody>

                    {attendance.length === 0 ? (

                        <tr>

                            <td
                                colSpan="9"
                                className="table-empty"
                            >
                                No attendance records found.
                            </td>

                        </tr>

                    ) : (

                        attendance.map((item) => (

                            <tr key={item._id}>

                                <td>

                                    <div className="employee-cell">

                                        <FaUserCircle
                                            className="employee-avatar"
                                        />

                                        <div>

                                            <strong>
                                                {
                                                    item.employee?.user
                                                        ?.name
                                                }
                                            </strong>

                                        </div>

                                    </div>

                                </td>

                                <td>
                                    {
                                        item.employee
                                            ?.employeeId
                                    }
                                </td>

                                <td>
                                    {item.employee
                                        ?.department
                                        ?.name ||
                                        "--"}
                                </td>

                                <td>

                                    {new Date(
                                        item.date
                                    ).toLocaleDateString()}

                                </td>

                                <td>

                                    {item.checkIn
                                        ? new Date(
                                              item.checkIn
                                          ).toLocaleTimeString(
                                              [],
                                              {
                                                  hour: "2-digit",
                                                  minute:
                                                      "2-digit",
                                              }
                                          )
                                        : "--"}

                                </td>

                                <td>

                                    {item.checkOut
                                        ? new Date(
                                              item.checkOut
                                          ).toLocaleTimeString(
                                              [],
                                              {
                                                  hour: "2-digit",
                                                  minute:
                                                      "2-digit",
                                              }
                                          )
                                        : "--"}

                                </td>

                                <td>

                                    {calculateHours(
                                        item.checkIn,
                                        item.checkOut
                                    )}

                                </td>

                                <td>

                                    <span
                                        className={`status-badge ${item.status
                                            .toLowerCase()
                                            .replace(
                                                " ",
                                                "-"
                                            )}`}
                                    >
                                        {item.status}
                                    </span>

                                </td>

                                <td>

                                    <div className="table-actions">

                                        <button
                                            className="icon-btn"
                                            title="Edit Attendance"
                                            onClick={() =>
                                                onEdit(
                                                    item
                                                )
                                            }
                                        >
                                            <FaEdit />
                                        </button>

                                        <button
                                            className="icon-btn"
                                            title="View Calendar"
                                            onClick={() =>
                                                onViewCalendar?.(
                                                    item.employee
                                                        ?._id
                                                )
                                            }
                                        >
                                            <FaCalendarAlt />
                                        </button>

                                    </div>

                                </td>

                            </tr>

                        ))

                    )}

                </tbody>

            </table>

        </div>

    );

}

export default AttendanceTable;