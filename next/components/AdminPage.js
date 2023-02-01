import { Button, Card, Col, Divider, Row, Text } from "@nextui-org/react";
import Page from "./Page";

export default function AdminPage({ children, currentPage }) {

    const isCurrentPage = (page) => {
        return currentPage === page;
    }

    return (
        <Page>
            <Row justify="center" css={{ mt: 10, gap: 10 }}>
                <Card css={{ height: "max-content", mw: "300px" }}>
                    <Card.Header>
                        <Col>
                            <Text h3>Moderation</Text>
                            <Divider />
                        </Col>
                    </Card.Header>
                    <Card.Body css={{ gap: 10 }}>
                        <Button flat={!isCurrentPage("users")} bordered={isCurrentPage("users")} onClick={() => window.location.href = "/admin/users"} size="lg">
                            Users
                        </Button>
                        <Button flat={!isCurrentPage("reports")} bordered={isCurrentPage("reports")} onClick={() => window.location.href = "/admin/reports"} size="lg">
                            Reports
                        </Button>
                    </Card.Body>
                </Card>
                {children}
            </Row>
        </Page>
    );
}
