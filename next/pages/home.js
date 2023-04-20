import { Button, Row, Text } from "@nextui-org/react";
import React from "react";

import Page from "../components/Page";

export default function HomePage({}) {
    return (
        <Page>
            <Row css={{ flexDirection: "column", alignItems: "center" }}>
                <Text h1 size={60} css={{ textGradient: "45deg, white -20%, $blue800 50%", textAlign: "center" }}>
                    Origins Datapacks
                </Text>
                <Text h4 size={15} css={{ textAlign: "center", color: "$gray800" }}>
                    Easily find and share origins specific minecraft datapacks all in one place!
                </Text>
                <Row justify="center" css={{ gap: 10 }}>
                    <Button size="sm" as="a" bordered href="/datapacks">Find Datapacks...</Button>
                    <Button size="sm" as="a" bordered href="/datapack/new">Upload</Button>
                </Row>
            </Row>
        </Page>
    );
}
