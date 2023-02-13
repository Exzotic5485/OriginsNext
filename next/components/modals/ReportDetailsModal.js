import { Modal, Button, Text, Divider, Link } from "@nextui-org/react";
import axios from "axios";
import { toast } from "react-hot-toast";
import swal from "sweetalert";
import { CheckIcon } from "../icons/check";
import { TrashIcon } from "../icons/trash";
import { UndoIcon } from "../icons/undo";

export default function ReportDetailsModal({ info, setInfo, refreshReports }) {
    if (!info.report) return null;

    const handleResolve = () => {
        axios
            .post(`/api/admin/report/${info.report.id}/resolve?undo=${info.report.resolved}`)
            .then(() => {
                toast.success("Successfully updated report");
                setInfo({ open: false, report: null });
                refreshReports();
            })
            .catch((err) => {
                toast.error("Error updating report!");
            });
    };

    const handleDelete = () => {
        swal({
            title: "Are you sure?",
            text: `You are trying to delete the datapack: "${info.report.datapack.title}"!`,
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((value) => {
            if (value) {
                axios
                    .post(`/api/admin/report/${info.report.id}/action`)
                    .then((res) => {
                        toast.success(`Successfully deleted and notified!`);
                    })
                    .catch((e) => {
                        toast.error(`Failed to delete datapack!`);
                    });
            }
        });
    };

    return (
        <Modal css={{ zIndex: 0 }} closeButton blur open={info.open} onClose={() => setInfo({ open: false, report: null })}>
            <Modal.Header>
                <Link href={`/datapack/${info.report.datapack.slug}`}>
                    <Text b size={22}>
                        {info.report.datapack.title}
                    </Text>
                </Link>
            </Modal.Header>
            <Modal.Body css={{ flexDirection: "column", textAlign: "center" }}>
                <Text h5>
                    Reported By:{" "}
                    <Link href={`/user/${info.report.reporter.username}`}>
                        <code>{info.report.reporter.username}</code>
                    </Link>
                </Text>
                <Divider css={{ mb: 5 }} />
                <Text h5>
                    Reason: <Text>{info.report.reason}</Text>
                </Text>
                <Text h5>
                    Description: <Text>{info.report.description}</Text>
                </Text>
            </Modal.Body>
            <Modal.Footer justify="space-between">
                <Button auto bordered color="error" icon={<TrashIcon />} onClick={handleDelete}>
                    Delete Pack & Notify
                </Button>
                <Button auto bordered color="success" icon={info.report.resolved ? <UndoIcon /> : <CheckIcon />} onClick={handleResolve}>
                    {info.report.resolved ? "UnResolve" : "Resolve"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
