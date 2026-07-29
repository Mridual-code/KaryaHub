function ReportTable({

    exportEmployees,
    exportAttendance,
    exportLeaves,

}) {

    return (

        <div className="table-card">

            <>
    <h2>Export Reports</h2>

    <p>
        Download employee, attendance and leave reports as CSV files.
    </p>
</>

            <div className="report-actions">

                <div className="report-card">

    <div className="report-icon">
        👥
    </div>

    <div className="report-content">
        <h3>Employee Report</h3>
        <p>
            Export complete employee information.
        </p>
    </div>

    <button
        className="primary-btn"
        onClick={exportEmployees}
    >
        Export CSV
    </button>

</div>

<div className="report-card">

    <div className="report-icon">
        🕒
    </div>

    <div className="report-content">
        <h3>Attendance Report</h3>
        <p>
            Export attendance records by date.
        </p>
    </div>

    <button
        className="primary-btn"
        onClick={exportAttendance}
    >
        Export CSV
    </button>

</div>

<div className="report-card">

    <div className="report-icon">
        📅
    </div>

    <div className="report-content">
        <h3>Leave Report</h3>
        <p>
            Export employee leave history.
        </p>
    </div>

    <button
        className="primary-btn"
        onClick={exportLeaves}
    >
        Export CSV
    </button>

</div>
            </div>

        </div>

    );

}

export default ReportTable;