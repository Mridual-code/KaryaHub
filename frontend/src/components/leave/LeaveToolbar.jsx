function LeaveToolbar({
    search,
    setSearch,
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

        </div>
    );
}

export default LeaveToolbar;