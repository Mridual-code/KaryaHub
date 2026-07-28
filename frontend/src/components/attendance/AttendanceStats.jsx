function AttendanceStats({ stats }) {

    return (

        <div className="attendance-stats">

            <div className="stat-card">
                <h3>{stats?.present || 0}</h3>
                <p>Present</p>
            </div>

            <div className="stat-card">
                <h3>{stats?.absent || 0}</h3>
                <p>Absent</p>
            </div>

            <div className="stat-card">
                <h3>{stats?.onleave || 0}</h3>
                <p>On Leave</p>
            </div>

            <div className="stat-card">
                <h3>{stats?.halfDay || 0}</h3>
                <p>Half Day</p>
            </div>

        </div>

    );

}

export default AttendanceStats;