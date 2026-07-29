import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import attendanceService from "../../services/attendanceService";

function AttendanceCalendar({ employeeId = null }) {  const [value, setValue] = useState(new Date());

  const [calendar, setCalendar] =
    useState({});

  const loadCalendar = async (
    date
  ) => {
    try {
      const month =
        date.getMonth() + 1;

      const year =
        date.getFullYear();

      const data = employeeId
  ? await attendanceService.getEmployeeAttendanceCalendar(
      employeeId,
      month,
      year
    )
  : await attendanceService.getMyAttendanceCalendar(
      month,
      year
    );

      setCalendar(
        data.calendar || {}
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadCalendar(value);
  }, []);

  const tileContent = ({
    date,
    view
  }) => {
    if (view !== "month")
      return null;

    const key =
      date
        .toISOString()
        .split("T")[0];

    const attendance =
      calendar[key];

    if (!attendance)
      return null;

    let color = "#9ca3af";

    switch (
      attendance.status
    ) {
      case "Present":
        color = "#22c55e";
        break;

      case "Absent":
        color = "#ef4444";
        break;

      case "Half Day":
        color = "#f59e0b";
        break;

      case "On Leave":
        color = "#3b82f6";
        break;

      default:
        break;
    }

    return (
      <div
        style={{
          marginTop: 4,
          display: "flex",
          justifyContent:
            "center"
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius:
              "50%",
            background:
              color
          }}
        />
      </div>
    );
  };

  return (
    <div className="attendance-calendar-card">

      

      <Calendar
        value={value}
        onChange={setValue}
        onActiveStartDateChange={({
          activeStartDate
        }) =>
          loadCalendar(
            activeStartDate
          )
        }
        tileContent={
          tileContent
        }
      />

      <div className="attendance-calendar-legend">

        <div>
          <span className="legend present" />
          Present
        </div>

        <div>
          <span className="legend absent" />
          Absent
        </div>

        <div>
          <span className="legend halfday" />
          Half Day
        </div>

        <div>
          <span className="legend leave" />
          Leave
        </div>

      </div>

    </div>
  );
}

export default AttendanceCalendar;