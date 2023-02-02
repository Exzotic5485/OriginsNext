import { Badge, Button, Card, Checkbox, Col, Divider, Link, Row, Table, Text, Tooltip } from "@nextui-org/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { CheckmarkIcon } from "react-hot-toast";
import AdminPage from "../../components/AdminPage";
import { CheckIcon } from "../../components/icons/check";
import { EyeIcon } from "../../components/icons/eye";
import { TrashIcon } from "../../components/icons/trash";
import ReportDetailsModal from "../../components/modals/ReportDetailsModal";
import { IconButton } from "../../components/styled/IconButton";
export async function getServerSideProps(context) {
    return {
        props: {
            initialReports: context?.query?.reports || [],
        },
    };
}

export default function AdminPageReports({ initialReports }) {
    const columns = ["DATAPACK", "REASON", "ACTIONS"];

    const [reportDetailsModal, setReportDetailsModal] = useState({ open: false, report: null });
    const [reports, setReports] = useState(initialReports);
    const [showResolved, setShowResolved] = useState(false);

    const refreshReports = () => {
        axios
            .get("/api/admin/reports?showResolved=" + showResolved)
            .then((res) => {
                setReports(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => refreshReports(), [showResolved]);

    return (
        <AdminPage currentPage="reports">
            <Card css={{ height: "max-content", mw: "800px" }}>
                <Card.Body>
                    <Text h3>Reports</Text>
                    <Divider css={{ mb: 10 }} />
                    <Row css={{ mb: 10 }}>
                        <Checkbox size="sm" css={{ ml: "auto" }} value={showResolved} onChange={setShowResolved}>
                            Show Resolved
                        </Checkbox>
                    </Row>
                    <Table selectionMode="none" bordered headerLined lined aria-label="Users table">
                        <Table.Header>
                            {columns.map((column) => {
                                return (
                                    <Table.Column key={column.toLowerCase()} hideHeader={column == "ACTIONS"}>
                                        {column}
                                    </Table.Column>
                                );
                            })}
                        </Table.Header>
                        <Table.Body>
                            {reports.map((report) => (
                                <Table.Row key={report.id}>
                                    <Table.Cell>
                                        <Link color={report.resolved ? "text" : "default"} href={`/datapack/${report.datapack.slug}`}>{report.datapack.title}</Link>
                                    </Table.Cell>
                                    <Table.Cell>{report.reason}</Table.Cell>
                                    <Table.Cell>
                                        <Row justify="center" align="center">
                                            <Col css={{ d: "flex" }}>
                                                <Tooltip content="View" color="default">
                                                    <IconButton onClick={() => setReportDetailsModal({ open: true, report })}>
                                                        <EyeIcon size={22} fill="#979797" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Col>
                                        </Row>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                </Card.Body>
            </Card>
            <ReportDetailsModal info={reportDetailsModal} setInfo={setReportDetailsModal} refreshReports={refreshReports} />
        </AdminPage>
    );
}
