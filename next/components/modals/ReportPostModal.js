import { Modal, useModal, Button, Text, Input, Loading, Textarea } from "@nextui-org/react";
import axios from "axios";
import { useRouter } from "next/router";
import { useState, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import { DiscordIcon } from "../icons/discord";
import { LockIcon } from "../icons/lock";
import { UserIcon } from "../icons/user";

export default function ReportPostModal({ visible, setVisible, datapackId }) {
    const subjectRef = useRef(null);
    const descriptionRef = useRef(null);

    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        if(!subjectRef.current.value || !descriptionRef.current.value) return toast.error("Please fill out all fields!");

        setLoading(true);

        axios
            .post(`/api/datapack/${datapackId}/report`, {
                reason: subjectRef.current.value,
                description: descriptionRef.current.value,
            })
            .then((res) => {
                setLoading(false);
                toast.success("Reported datapack!");
                setVisible(false);
            })
            .catch((e) => {
                setLoading(false);
                toast.error("Failed to report datapack!");
            });
    };

    return (
        <Modal css={{ zIndex: 0 }} closeButton blur open={visible} onClose={() => setVisible(false)}>
            <Modal.Header>
                <Text b size={22}>
                    Report Datapack
                </Text>
            </Modal.Header>
            <Modal.Body>
                <Input clearable bordered label="Subject" ref={subjectRef} />
                <Textarea bordered label="Description" ref={descriptionRef} />
            </Modal.Body>
            <Modal.Footer>
                <Button auto onClick={handleSubmit} disabled={loading}>
                    {loading ? <Loading type="points" color="currentColor" size="sm" /> : "Submit"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
