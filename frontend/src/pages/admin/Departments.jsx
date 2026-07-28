import { useEffect, useMemo, useState } from "react";

import departmentService from "../../services/departmentService";

import DepartmentToolbar from "../../components/departments/DepartmentToolbar";
import DepartmentTable from "../../components/departments/DepartmentTable";
import DepartmentDrawer from "../../components/departments/DepartmentDrawer";
import DepartmentModal from "../../components/departments/DepartmentModal";

function Departments() {

    const [departments, setDepartments] = useState([]);

    const [search, setSearch] = useState("");

    const [selectedDepartment, setSelectedDepartment] =
        useState(null);

    const [editingDepartment, setEditingDepartment] =
        useState(null);

    const [modalOpen, setModalOpen] =
        useState(false);

    const fetchDepartments = async () => {

        try {

            const data =
                await departmentService.getDepartments();

            setDepartments(
                data.departments || []
            );

        } catch (err) {

            console.log(err);

        }

    };

    useEffect(() => {

        fetchDepartments();

    }, []);

    const filteredDepartments = useMemo(() => {

        return departments.filter((dept) =>
            dept.name
                ?.toLowerCase()
                .includes(search.toLowerCase())
        );

    }, [departments, search]);

    const handleAdd = () => {

        setEditingDepartment(null);

        setModalOpen(true);

    };

    const handleEdit = (department) => {

        setEditingDepartment(department);

        setModalOpen(true);

    };

    const handleView = (department) => {

        setSelectedDepartment(department);

    };

    const handleSave = async (form) => {

        try {

            if (editingDepartment) {

                await departmentService.updateDepartment(
                    editingDepartment._id,
                    form
                );

            } else {

                await departmentService.createDepartment(
                    form
                );

            }

            setModalOpen(false);

            fetchDepartments();

        } catch (err) {

            console.log(err);

        }

    };

    return (

        <div>

            <DepartmentToolbar
                search={search}
                setSearch={setSearch}
                onAdd={handleAdd}
            />

            <DepartmentTable
                departments={filteredDepartments}
                onView={handleView}
                onEdit={handleEdit}
            />

            <DepartmentDrawer
                department={selectedDepartment}
                onClose={() =>
                    setSelectedDepartment(null)
                }
            />

            <DepartmentModal
                open={modalOpen}
                initialData={editingDepartment}
                onClose={() =>
                    setModalOpen(false)
                }
                onSave={handleSave}
            />

        </div>

    );

}

export default Departments;