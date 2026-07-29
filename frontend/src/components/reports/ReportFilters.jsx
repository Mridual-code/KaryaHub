function ReportFilters({

    department,
    setDepartment,

    fromDate,
    setFromDate,

    toDate,
    setToDate,

}) {

    return (

        <div className="report-filters">

            <div className="report-filter">
    <label>From Date</label>
    <input
        type="date"
        value={fromDate}
        onChange={(e)=>setFromDate(e.target.value)}
    />
</div>

<div className="report-filter">
    <label>To Date</label>
    <input
        type="date"
        value={toDate}
        onChange={(e)=>setToDate(e.target.value)}
    />
</div>

<div className="report-filter">
    <label>Department</label>
    <input
        placeholder="Department"
        value={department}
        onChange={(e)=>setDepartment(e.target.value)}
    />
</div>

        </div>

    );

}

export default ReportFilters;