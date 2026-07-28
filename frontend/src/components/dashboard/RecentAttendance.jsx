function RecentAttendance({ attendance }) {

    return (

        <section className="dashboard-card">

            <h3>Recent Attendance</h3>

            {

                attendance?.length ? (

                    <table className="table">

                        <thead>

                            <tr>

                                <th>Date</th>

                                <th>Status</th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                attendance.map((item) => (

                                    <tr key={item._id}>

                                        <td>

                                            {

                                                new Date(
                                                    item.date
                                                ).toLocaleDateString()

                                            }

                                        </td>

                                        <td>

                                            {item.status}

                                        </td>

                                    </tr>

                                ))

                            }

                        </tbody>

                    </table>

                ) : (

                    <p>No attendance found.</p>

                )

            }

        </section>

    );

}

export default RecentAttendance;