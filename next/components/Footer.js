import { Divider, Link, Row } from "@nextui-org/react";

export default function Footer() {
    return (
        <>
            <footer>
                <Divider css={{ mt: 10 }} />
                <Row css={{ width: '100%' }}>
                    <div style={{ marginLeft: 'auto', justifyContent: "flex-end", display: 'flex', columnGap: 10 }}>
                        <Link href="/discord" color="text">Discord</Link>
                        <Link href="/tos" color="text">Terms of Service</Link>
                        <Link href="/privacy" color="text">Privacy Policy</Link>
                    </div>
                </Row>
            </footer>
        </>
    );
}
