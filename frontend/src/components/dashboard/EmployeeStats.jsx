function EmployeeStats({ statistics }) {

    const cards = [

        {
            title: "Present Days",
            value: statistics?.presentDays || 0
        },

        {
            title: "Absent Days",
            value: statistics?.absentDays || 0
        },

        {
            title: "Pending Leaves",
            value: statistics?.pendingLeaves || 0
        },

        {
            title: "Attendance %",
            value: `${statistics?.attendancePercentage || 0}%`
        }

    ];

    return (

        <section className="dashboard-stats">

            {

                cards.map((card) => (

                    <div
                        key={card.title}
                        className="stat-card"
                    >

                        <h3>{card.value}</h3>

                        <p>{card.title}</p>

                    </div>

                ))

            }

        </section>

    );

}

export default EmployeeStats;