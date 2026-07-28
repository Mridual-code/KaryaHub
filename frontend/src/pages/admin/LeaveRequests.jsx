import { useEffect, useMemo, useState } from "react";

import leaveService from "../../services/leaveService";

import LeaveToolbar from "../../components/leave/LeaveToolbar";
import LeaveFilters from "../../components/leave/LeaveFilters";
import LeaveTable from "../../components/leave/LeaveTable";
import LeaveModal from "../../components/leave/LeaveModal";

function LeaveRequests() {

    const [leaves, setLeaves] = useState([]);

    const [search, setSearch] = useState("");

    const [status, setStatus] = useState("");

    const [selectedLeave, setSelectedLeave] =
        useState(null);

    const [modalOpen, setModalOpen] =
        useState(false);

    const fetchLeaves = async () => {

        try {

            const data =
                await leaveService.getLeaves();

            setLeaves(data.leaves || []);

        } catch (err) {

            console.log(err);

        }

    };

    useEffect(() => {

        fetchLeaves();

    }, []);

    const filteredLeaves =
        useMemo(() => {

            return leaves.filter((leave) => {

                const matchesSearch =
                    leave.employee?.user?.name
                        ?.toLowerCase()
                        .includes(
                            search.toLowerCase()
                        );

                const matchesStatus =
                    !status ||
                    leave.status === status;

                return (
                    matchesSearch &&
                    matchesStatus
                );

            });

        }, [
            leaves,
            search,
            status,
        ]);

    const openModal = (leave) => {

        setSelectedLeave(leave);

        setModalOpen(true);

    };

    const approveLeave = async () => {

        await leaveService.updateLeave(
            selectedLeave._id,
            {
                status: "Approved",
            }
        );

        setModalOpen(false);

        fetchLeaves();

    };

    const rejectLeave = async () => {

        await leaveService.updateLeave(
            selectedLeave._id,
            {
                status: "Rejected",
            }
        );

        setModalOpen(false);

        fetchLeaves();

    };

    return (

        <div>

            <LeaveToolbar
                search={search}
                setSearch={setSearch}
            />

            <LeaveFilters
                status={status}
                setStatus={setStatus}
            />

            <LeaveTable
                leaves={filteredLeaves}
                onApprove={openModal}
                onReject={openModal}
            />

            <LeaveModal
                open={modalOpen}
                onClose={() =>
                    setModalOpen(false)
                }
                onApprove={approveLeave}
                onReject={rejectLeave}
            />

        </div>

    );

}

export default LeaveRequests;