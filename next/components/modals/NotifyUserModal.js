import { Button, Dropdown, Input, Modal, Text, Textarea } from "@nextui-org/react";
import axios from "axios";
import { useMemo, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import SendIcon from "../icons/send";

export default function NotifyUserModal({ info, setInfo }) {
    const colors = ["default", "primary", "success", "warning", "error"];
    const [color, setColor] = useState(["default"]);

    const selectedColor = useMemo(() => Array.from(color)[0], [color]);

    const titleRef = useRef();
    const messageRef = useRef();
    const linkRef = useRef();

    const handleSubmit = (e) => {
        axios
            .post(`/api/admin/user/${info.user.id}/notify`, {
                title: titleRef.current.value,
                message: messageRef.current.value,
                color: selectedColor,
                link: linkRef.current.value,
            })
            .then(() => {
                toast.success("Successfully notified user!");
                setInfo({ open: false, user: null });
            })
            .catch((err) => {
                toast.error("Error notifying user!");
            });
    };

    if(!info.user) return null;

    return (
        <Modal css={{ zIndex: 0 }} closeButton blur open={info.open} onClose={() => setInfo({ open: false, user: null })}>
            <Modal.Header>
                <Text b size={22}>
                    Notify User: {info.user.username}
                </Text>
            </Modal.Header>
            <Modal.Body css={{ flexDirection: "column", textAlign: "center" }}>
                <Input bordered label="Title" ref={titleRef} required />
                <Input bordered label="Link" ref={linkRef} />
                <Textarea bordered label="Message" ref={messageRef} required />
                <Dropdown>
                    <Dropdown.Button flat color={selectedColor == "default" ? "gray" : selectedColor}>
                        {"Color: " + selectedColor}
                    </Dropdown.Button>
                    <Dropdown.Menu selectionMode="single" disallowEmptySelection selectedKeys={color} onSelectionChange={setColor}>
                        {colors.map((color) => (
                            <Dropdown.Item color={color} key={color}>
                                {color}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
            </Modal.Body>
            <Modal.Footer justify="end">
                <Button bordered auto icon={<SendIcon size={20} />} onClick={handleSubmit}>
                    Send
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
