import { Modal, Button, Text, Divider, Link } from "@nextui-org/react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { CheckIcon } from "../icons/check";

export default function ReportDetailsModal({ info, setInfo, reports, setReports }) {
    if (!info.report) return null;

    const handleResolve = () => {
        axios
            .post(`/api/admin/report/${info.report.id}/resolve`)
            .then(() => {
                toast.success("Successfully updated report");
                setInfo({ open: false, report: null });
                setReports((reports) => reports.filter((report) => report.id !== info.report.id));
            })
            .catch((err) => {
                toast.error("Error updating report!");
            });
    }

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
            <Modal.Footer>
                <Button auto color="success" icon={<CheckIcon />} onClick={handleResolve}>
                    Resolve
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
