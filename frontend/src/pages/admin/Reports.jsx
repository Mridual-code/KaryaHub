import { useState } from "react";

import {
  exportAttendanceCsv,
  exportEmployeesCsv,
  exportLeavesCsv,
} from "../../services/reportService";

import ReportToolbar from "../../components/reports/ReportToolbar";
import ReportFilters from "../../components/reports/ReportFilters";
import ReportTable from "../../components/reports/ReportTable";

function Reports() {

    const [department, setDepartment] =
        useState("");

    const [fromDate, setFromDate] =
        useState("");

    const [toDate, setToDate] =
        useState("");

    const downloadFile = (blob, filename) => {

        const url =
            window.URL.createObjectURL(blob);

        const link =
            document.createElement("a");

        link.href = url;

        link.download = filename;

        document.body.appendChild(link);

        link.click();

        link.remove();

        window.URL.revokeObjectURL(url);

    };

    const filters = {
        department,
        fromDate,
        toDate,
    };

    const handleEmployeeExport =
        async () => {

            try {

                const blob =
                    await exportEmployeesCsv(
                        filters
                    );

                downloadFile(
                    blob,
                    "employees.csv"
                );

            } catch (err) {

                console.error(err);

            }

        };

    const handleAttendanceExport =
        async () => {

            try {

                const blob =
                    await exportAttendanceCsv(
                        filters
                    );

                downloadFile(
                    blob,
                    "attendance.csv"
                );

            } catch (err) {

                console.error(err);

            }

        };

    const handleLeaveExport =
        async () => {

            try {

                const blob =
                    await exportLeavesCsv(
                        filters
                    );

                downloadFile(
                    blob,
                    "leaves.csv"
                );

            } catch (err) {

                console.error(err);

            }

        };

    return (

        <div>

            <ReportToolbar
                title="Reports"
                description="Export HR reports"
            />

            <ReportFilters
                department={department}
                setDepartment={setDepartment}
                fromDate={fromDate}
                setFromDate={setFromDate}
                toDate={toDate}
                setToDate={setToDate}
            />

            <ReportTable
                exportEmployees={
                    handleEmployeeExport
                }
                exportAttendance={
                    handleAttendanceExport
                }
                exportLeaves={
                    handleLeaveExport
                }
            />

        </div>

    );

}

export default Reports;