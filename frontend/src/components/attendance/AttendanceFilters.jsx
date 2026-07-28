import { FaFilter, FaUndo } from "react-icons/fa";

function AttendanceFilters({
    status,
    setStatus,
    department,
    setDepartment,
    onReset,
}) {

    return (

        <div className="attendance-filters">

            <div className="filter-group">

                <FaFilter />

                <select
                    value={status}
                    onChange={(e) =>
                        setStatus(e.target.value)
                    }
                >
                    <option value="">
                        All Status
                    </option>

                    <option value="Present">
                        Present
                    </option>

                    <option value="Absent">
                        Absent
                    </option>

                    <option value="Half Day">
                        Half Day
                    </option>

                    <option value="On Leave">
                        On Leave
                    </option>

                </select>

                <select
                    value={department}
                    onChange={(e) =>
                        setDepartment(e.target.value)
                    }
                >
                    <option value="">
                        All Departments
                    </option>

                    <option value="HR">
                        HR
                    </option>

                    <option value="IT">
                        IT
                    </option>

                    <option value="Finance">
                        Finance
                    </option>

                    <option value="Marketing">
                        Marketing
                    </option>

                </select>

            </div>

            <button
                className="secondary-btn"
                onClick={onReset}
            >
                <FaUndo />
                Reset
            </button>

        </div>

    );

}

export default AttendanceFilters;