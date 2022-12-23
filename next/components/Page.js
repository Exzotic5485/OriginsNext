import { Container } from '@nextui-org/react'

import Footer from "./Footer";
import Navbar from "./Navbar";

export default function Page({ children, currentPage }) {
    return (
        <>
            <main>
                <Navbar currentPage={currentPage} />
                <Container fluid>
                    {children}
                    <Footer />
                </Container>
            </main>
        </>
    );
}
