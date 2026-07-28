import { useEffect, useState } from "react";
import departmentService from "../../services/departmentService";

function EmployeeFilters({
  department,
  setDepartment,
  status,
  setStatus,
}) {
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res =
await departmentService.getDepartments();

setDepartments(
    res.departments || []
);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDepartments();
  }, []);

  return (
    <div className="employee-filters">

      <select
        value={department}
        onChange={(e) =>
          setDepartment(e.target.value)
        }
      >
        <option value="">
          All Departments
        </option>

        {departments.map((dept) => (
          <option
            key={dept._id}
            value={dept.name}
          >
            {dept.name}
          </option>
        ))}

      </select>

      <select
        value={status}
        onChange={(e) =>
          setStatus(e.target.value)
        }
      >
        <option value="">
          All Status
        </option>

        <option value="Active">
          Active
        </option>

        <option value="Inactive">
          Inactive
        </option>
      </select>

    </div>
  );
}

export default EmployeeFilters;