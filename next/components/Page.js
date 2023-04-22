import { Container } from '@nextui-org/react'

import Footer from "./Footer";
import Navbar from "./Navbar";
import Head from 'next/head';

export default function Page({ children, currentPage, containerStyle, pageTitle = "Origins Datapacks" }) {
    return (
        <>
            <Head>
                <title>{pageTitle}</title>
            </Head>
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
