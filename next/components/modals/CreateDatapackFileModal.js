import { Modal, Button, Text, Input } from "@nextui-org/react";
import { useState, useRef } from "react";
import VersionsDropdown from "../dropdowns/VersionsDropdown";

export default function CreateDatapackFileModal({ visible, setVisible, handleFile, file }) {
    const [displayName, setDisplayName] = useState("");
    const [versions, setVersions] = useState([]);

    const fileInputRef = useRef(null);

    return (
        <Modal css={{ zIndex: 0 }} closeButton blur open={visible} onClose={() => setVisible(false)}>
            <Modal.Header>
                <Text b size={22}>Upload File</Text>
            </Modal.Header>
            <Modal.Body>
                <Input clearable bordered label="Display Name" placeholder="Example Pack v1" onInput={(e) => setDisplayName(e.target.value)} />
                <VersionsDropdown value={versions} setValue={setVersions} />
                <Button bordered onClick={() => fileInputRef.current.click()} >Choose File</Button>
                <input type="file" ref={fileInputRef} accept=".zip" onChange={(e) => handleFile(e, displayName, versions)} style={{ display: 'none' }} />
            </Modal.Body>
        </Modal>
    )
}