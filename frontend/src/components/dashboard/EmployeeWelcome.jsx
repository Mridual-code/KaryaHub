function EmployeeWelcome({ employee }) {

    const hour = new Date().getHours();

    let greeting = "Good Evening";

    if (hour < 12) {
        greeting = "Good Morning";
    } else if (hour < 17) {
        greeting = "Good Afternoon";
    }

    return (

        <section className="dashboard-welcome">

            <div>

                <h2>
                    {greeting},{" "}
                    {employee?.name || "Employee"} 👋
                </h2>

                <p>
                    Welcome back to KaryaHub
                </p>

            </div>

            <div className="welcome-info">

                <p>
                    <strong>ID:</strong>{" "}
                    {employee?.employeeId}
                </p>

                <p>
                    <strong>Department:</strong>{" "}
                    {employee?.department}
                </p>

                <p>
                    <strong>Designation:</strong>{" "}
                    {employee?.designation}
                </p>

            </div>

        </section>

    );

}

export default EmployeeWelcome;