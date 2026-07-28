function ReportFilters({

    department,
    setDepartment,

    fromDate,
    setFromDate,

    toDate,
    setToDate,

}) {

    return (

        <div className="employee-filters">

            <input
                type="date"
                value={fromDate}
                onChange={(e)=>
                    setFromDate(e.target.value)
                }
            />

            <input
                type="date"
                value={toDate}
                onChange={(e)=>
                    setToDate(e.target.value)
                }
            />

            <input
                placeholder="Department"
                value={department}
                onChange={(e)=>
                    setDepartment(e.target.value)
                }
            />

        </div>

    );

}

export default ReportFilters;