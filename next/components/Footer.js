import { Col, Divider, Link, Row } from "@nextui-org/react";

export default function Footer() {
    return (
        <>
            <footer>
                <Divider css={{ mt: 10 }} />
                <Row css={{ width: '100%' }}>
                    <div style={{ marginLeft: 'auto', justifyContent: "flex-end" }}>
                        <Link href="/tos" color="text">Terms of Service</Link>
                        <Link href="/privacy" color="text" css={{ ml: 10 }}>Privacy Policy</Link>
                    </div>
                </Row>
            </footer>
        </>
    );
}
