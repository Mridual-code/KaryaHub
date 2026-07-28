function ActivityTable({

    activities

}) {

    return (

        <div className="table-card">

            <table className="dashboard-table">

                <thead>

                    <tr>

                        <th>User</th>

                        <th>Role</th>

                        <th>Action</th>

                        <th>Module</th>

                        <th>Date</th>

                    </tr>

                </thead>

                <tbody>

                    {activities.length === 0 ? (

                        <tr>

                            <td
                                colSpan="5"
                                style={{
                                    textAlign:"center",
                                    padding:"25px"
                                }}
                            >

                                No Activity Found

                            </td>

                        </tr>

                    ) : (

                        activities.map((activity)=>(

                            <tr
                                key={activity._id}
                            >

                                <td>

                                    {activity.user?.name}

                                </td>

                                <td>

                                    {activity.user?.role}

                                </td>

                                <td>

                                    {activity.action}

                                </td>

                                <td>

                                    {activity.module}

                                </td>

                                <td>

                                    {new Date(
                                        activity.createdAt
                                    ).toLocaleString()}

                                </td>

                            </tr>

                        ))

                    )}

                </tbody>

            </table>

        </div>

    );

}

export default ActivityTable;