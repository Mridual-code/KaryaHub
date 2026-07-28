function TodayAttendanceCard({ attendance }) {

    return (

        <section className="dashboard-card">

            <h3>Today's Attendance</h3>

            {

                attendance ? (

                    <>

                        <p>

                            <strong>Status:</strong>{" "}

                            {attendance.status}

                        </p>

                        <p>

                            <strong>Check In:</strong>{" "}

                            {

                                attendance.checkIn

                                    ? new Date(
                                          attendance.checkIn
                                      ).toLocaleTimeString()

                                    : "--"

                            }

                        </p>

                        <p>

                            <strong>Check Out:</strong>{" "}

                            {

                                attendance.checkOut

                                    ? new Date(
                                          attendance.checkOut
                                      ).toLocaleTimeString()

                                    : "--"

                            }

                        </p>

                    </>

                ) : (

                    <p>No attendance recorded today.</p>

                )

            }

        </section>

    );

}

export default TodayAttendanceCard;