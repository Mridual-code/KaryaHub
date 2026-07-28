import {
    useEffect,
    useState
} from "react";

import ActivityToolbar from "../../components/activity/ActivityToolbar";
import ActivityTable from "../../components/activity/ActivityTable";

import {
    getActivityLogs
} from "../../services/activityLogService";

function ActivityLogs() {

    const [activities,setActivities] =
        useState([]);

    const [search,setSearch] =
        useState("");

    useEffect(()=>{

        loadActivities();

    },[]);

    const loadActivities =
        async ()=>{

        try{

            const data =
                await getActivityLogs();

            setActivities(
                data.activities || []
            );

        }

        catch(err){

            console.log(err);

        }

    };

    const filteredActivities =
        activities.filter((activity)=>{

            return (

                activity.action
                    ?.toLowerCase()
                    .includes(
                        search.toLowerCase()
                    )

                ||

                activity.module
                    ?.toLowerCase()
                    .includes(
                        search.toLowerCase()
                    )

                ||

                activity.user?.name
                    ?.toLowerCase()
                    .includes(
                        search.toLowerCase()
                    )

            );

        });

    return (

        <div>

            <div className="page-header">

                <h1>

                    Activity Logs

                </h1>

            </div>

            <ActivityToolbar

                search={search}

                setSearch={setSearch}

            />

            <ActivityTable

                activities={
                    filteredActivities
                }

            />

        </div>

    );

}

export default ActivityLogs;