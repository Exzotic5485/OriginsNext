import { Badge, Button, Card, Col, Divider, Link, Row, Table, Text, Tooltip } from "@nextui-org/react";
import AdminPage from "../../components/AdminPage";
export async function getServerSideProps(context) {
    return {
        props: {
            reports: context?.query?.reports || [],
        },
    };
}

export default function AdminPageReports({ reports }) {
    const columns = ["DATAPACK", "REASON", "ACTIONS"];

    return (
        <AdminPage currentPage="reports">
            <Card css={{ height: "max-content", mw: "800px" }}>
                <Card.Body>
                    <Text h3>Reports</Text>
                    <Divider css={{ mb: 10 }} />
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
                                        <Link href={`/datapack/${report.datapack.slug}`}>{report.datapack.title}</Link>
                                    </Table.Cell>
                                    <Table.Cell>{report.reason}</Table.Cell>
                                    <Table.Cell> </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                </Card.Body>
            </Card>
        </AdminPage>
    );
}
