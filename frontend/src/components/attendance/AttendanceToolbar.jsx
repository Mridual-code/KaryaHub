function AttendanceToolbar({
    search,
    setSearch,
    date,
    setDate,
}) {
    return (
        <div className="toolbar">

            <input
                type="text"
                placeholder="Search employee..."
                value={search}
                onChange={(e) =>
                    setSearch(e.target.value)
                }
            />

            <input
                type="date"
                value={date}
                onChange={(e) =>
                    setDate(e.target.value)
                }
            />

        </div>
    );
}

export default AttendanceToolbar;