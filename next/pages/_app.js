import { useState } from "react";
import Head from "next/head";

import { SSRProvider } from "@react-aria/ssr";

import { NextUIProvider, createTheme } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Toaster } from "react-hot-toast";

import { UserContext } from "../utils/context/User";

const lightTheme = createTheme({
    type: "light",
    theme: {
        colors: {},
    },
});

const darkTheme = createTheme({
    type: "dark",
    theme: {
        colors: {},
    },
});

export default function App({ Component, pageProps, userx }) {
    return (
        <SSRProvider>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <NextThemesProvider defaultTheme="dark" attribute="class" value={{ light: lightTheme.className, dark: darkTheme.className }}>
                <Toaster position="bottom-left" containerStyle={{ zIndex: 10000 }} toastOptions={{ error: { duration: 3000, style: { backgroundColor: '#FF6466', color: '#FFFFFF' }}, success: { duration: 3000, style: { backgroundColor: '#58cf93', color: '#FFFFFF'}} }} />
                <NextUIProvider>
                    <Component {...pageProps} />
                </NextUIProvider>
            </NextThemesProvider>
        </SSRProvider>
    );
}
