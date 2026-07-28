function ReportTable({

    exportEmployees,
    exportAttendance,
    exportLeaves,

}) {

    return (

        <div className="table-card">

            <h2>
                Export Reports
            </h2>

            <div
                style={{
                    display:"flex",
                    gap:"15px",
                    marginTop:"20px",
                }}
            >

                <button
                    className="primary-btn"
                    onClick={exportEmployees}
                >
                    Employee CSV
                </button>

                <button
                    className="primary-btn"
                    onClick={exportAttendance}
                >
                    Attendance CSV
                </button>

                <button
                    className="primary-btn"
                    onClick={exportLeaves}
                >
                    Leave CSV
                </button>

            </div>

        </div>

    );

}

export default ReportTable;