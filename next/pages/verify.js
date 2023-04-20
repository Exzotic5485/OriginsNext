import { Button, Card, Link, Text } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import SendIcon from "../components/icons/send";
import { CheckIcon } from "../components/icons/check";
import axios from "axios";

export default function VerifyPage({}) {

    useEffect(() => {
        setInterval(() => {
            axios.get('/api/user').then((data) => {
                if(data.data.username) {
                    window.location.href = "/"
                }
            }).catch(() => {})
        }, 5000)
    }, [])

    return (
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100dvh" }}>
            <Card css={{ width: "fit-content", p: 20 }}>
                <Card.Body css={{ width: "100%", display: "flex", flexDirection: "column", gap: 10, alignItems: 'center' }}>
                    <Text b size={22}>
                        Verify Account
                    </Text>
                    <Text>Please check your email for the verification link or press resend below!</Text>
                    <Button flat icon={<SendIcon />} css={{ width: '100%' }}>
                        Resend
                    </Button>
                    <Button as={'a'} href="/auth/logout" color="error" flat>
                        Logout
                    </Button>
                </Card.Body>
            </Card>
        </div>
    );
}
