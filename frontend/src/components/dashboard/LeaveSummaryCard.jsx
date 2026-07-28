function LeaveSummaryCard({ statistics }) {

    return (

        <section className="dashboard-card">

            <h3>Leave Summary</h3>

            <p>

                <strong>Approved:</strong>{" "}

                {statistics?.approvedLeaves || 0}

            </p>

            <p>

                <strong>Pending:</strong>{" "}

                {statistics?.pendingLeaves || 0}

            </p>

            <p>

                <strong>Rejected:</strong>{" "}

                {statistics?.rejectedLeaves || 0}

            </p>

        </section>

    );

}

export default LeaveSummaryCard;