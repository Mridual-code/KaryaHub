function AttendanceHistory({
    attendance = [],
}) {

    return (

        <div className="table-card">

            <div className="attendance-history-header">

                <h3>
                    Attendance History
                </h3>

            </div>

            <table className="dashboard-table">

                <thead>

                    <tr>

                        <th>Date</th>

                        <th>Check In</th>

                        <th>Check Out</th>

                        <th>Working Hours</th>

                        <th>Status</th>

                    </tr>

                </thead>

                <tbody>

                    {attendance.length === 0 ? (

                        <tr>

                            <td
                                colSpan="5"
                                className="table-empty"
                            >
                                No attendance history available.
                            </td>

                        </tr>

                    ) : (

                        attendance.map((item) => {

                            const hours =
                                item.checkIn &&
                                item.checkOut
                                    ? (
                                          (new Date(
                                              item.checkOut
                                          ) -
                                              new Date(
                                                  item.checkIn
                                              )) /
                                          (1000 *
                                              60 *
                                              60)
                                      ).toFixed(1)
                                    : "--";

                            return (

                                <tr key={item._id}>

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

                                        {hours === "--"
                                            ? "--"
                                            : `${hours} hrs`}

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

                                </tr>

                            );

                        })

                    )}

                </tbody>

            </table>

        </div>

    );

}

export default AttendanceHistory;