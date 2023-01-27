import { Modal, useModal, Button, Text, Input, Loading, Textarea, Image, Col, Row, Divider } from "@nextui-org/react";
import axios from "axios";
import { useRouter } from "next/router";
import { useState, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import { DiscordIcon } from "../icons/discord";
import { LockIcon } from "../icons/lock";
import { UserIcon } from "../icons/user";

export default function UserDetailsModal({ info, setInfo }) {
    if (!info.user) return null;

    return (
        <Modal css={{ zIndex: 0 }} closeButton blur open={info.open} onClose={() => setInfo({ open: false, user: null })}>
            <Modal.Header>
                <Text b size={22}>
                    {info.user.username}
                </Text>
            </Modal.Header>
            <Modal.Body css={{ flexDirection: "column", textAlign: "center" }}>
                <Image src={`/uploads/user/${info.user.image}`} width={180} height={180} css={{ borderRadius: 4 }} />
                <Row justify="center">
                    <DiscordIcon height={18} width={18} />
                    <code onClick={() => navigator.clipboard.writeText(info.user.discordId)}>{info.user.discordId || "Not Linked"}</code>
                </Row>
                <Divider />
                <Text h4>Username History</Text>
                <Text>{info.user.usernameHistory.join(", ")}</Text>
            </Modal.Body>
            <Modal.Footer></Modal.Footer>
        </Modal>
    );
}
