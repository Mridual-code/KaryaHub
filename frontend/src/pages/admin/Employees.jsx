import {
  useEffect,
  useMemo,
  useState,
} from "react";

import employeeService from "../../services/employeeService";
import EmployeeFilters from "../../components/employees/EmployeeFilters";
import EmployeeToolbar from "../../components/employees/EmployeeToolbar";
import EmployeeTable from "../../components/employees/EmployeeTable";
import EmployeeModal from "../../components/employees/EmployeeModal";
import DeleteEmployeeModal from "../../components/employees/DeleteEmployeeModal";
import EmployeeProfileDrawer from "../../components/employees/EmployeeProfileDrawer";
import departmentService from "../../services/departmentService";

function Employees() {
  const [employees, setEmployees] =
    useState([]);

  const [loading, setLoading] =
    useState(true);
    const [departments, setDepartments] = useState([]);

  const [search, setSearch] =
    useState("");

  const [openModal, setOpenModal] =
    useState(false);

  const [department, setDepartment] =
useState("");

const [status, setStatus] =
useState("");

  const [openDelete, setOpenDelete] =
    useState(false);

  const [openDrawer, setOpenDrawer] =
    useState(false);

  const [selectedEmployee, setSelectedEmployee] =
    useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
  setLoading(true);

  try {
    const [employeeData, departmentData] =
      await Promise.all([
        employeeService.getAllEmployees(),
        departmentService.getDepartments(),
      ]);

    console.log("Employees:", employeeData);
    console.log("Departments:", departmentData);

    setEmployees(
      employeeData.employees ||
      employeeData.data ||
      employeeData ||
      []
    );

    setDepartments(
      departmentData.departments ||
      departmentData.data ||
      departmentData ||
      []
    );
  } catch (error) {
    console.error("Fetch Employees Error:", error);
  } finally {
    setLoading(false);
  }
};
 const filteredEmployees = useMemo(() => {

return employees.filter((emp)=>{

const matchesSearch =
(emp.name || emp.user?.name || "")
  .toLowerCase()
  .includes(search.toLowerCase());
const matchesDepartment =
!department ||
emp.department?.name===department;

const matchesStatus =
!status ||
emp.employmentStatus===status;

return (
matchesSearch &&
matchesDepartment &&
matchesStatus
);

});

},[
employees,
search,
department,
status
]);
  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setOpenModal(true);
  };

  const handleEditEmployee = (emp) => {
    setSelectedEmployee(emp);
    setOpenModal(true);
  };

  const handleViewEmployee = (emp) => {
    setSelectedEmployee(emp);
    setOpenDrawer(true);
  };

  const handleDeleteEmployee = (emp) => {
    setSelectedEmployee(emp);
    setOpenDelete(true);
  };

  const handleSaveEmployee = async (
    formData
  ) => {
    try {
      if (selectedEmployee) {
        await employeeService.updateEmployee(
          selectedEmployee._id,
          formData
        );
      } else {
        await employeeService.createEmployee(
          formData
        );
      }

      setOpenModal(false);

      fetchEmployees();
    } catch (error) {
      console.error(error);
    }
  };

  const confirmDelete = async (id) => {
    try {
      await employeeService.deleteEmployee(
        id
      );

      setOpenDelete(false);

      fetchEmployees();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading)
    return <h2>Loading...</h2>;

  return (
    <div>

      <EmployeeToolbar
        search={search}
        setSearch={setSearch}
        onAdd={handleAddEmployee}
      />
      <EmployeeFilters
department={department}
setDepartment={setDepartment}
status={status}
setStatus={setStatus}
/>

      <EmployeeTable
        employees={filteredEmployees}
        onView={handleViewEmployee}
        onEdit={handleEditEmployee}
        onDelete={handleDeleteEmployee}
      />

      <EmployeeModal
    open={openModal}
    employee={selectedEmployee}
    departments={departments}
    onClose={() => setOpenModal(false)}
    onSave={handleSaveEmployee}
/>

      <DeleteEmployeeModal
        open={openDelete}
        employee={selectedEmployee}
        onClose={() =>
          setOpenDelete(false)
        }
        onDelete={confirmDelete}
      />

      <EmployeeProfileDrawer
        open={openDrawer}
        employee={selectedEmployee}
        onClose={() =>
          setOpenDrawer(false)
        }
      />

    </div>
  );
}

export default Employees;