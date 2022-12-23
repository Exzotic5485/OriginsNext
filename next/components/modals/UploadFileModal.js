import { Modal, useModal, Button, Text, Input, Loading, Switch, Col } from "@nextui-org/react";
import axios from "axios";
import { useRouter } from "next/router";
import { useState, useRef } from "react";
import toast, { Toaster } from 'react-hot-toast';
import VersionsDropdown from "../dropdowns/VersionsDropdown";
import { UploadIcon } from "../icons/upload";

export default function UploadFileModal({ visible, setVisible }) {
    const [loading, setLoading] = useState(false);

    const [displayName, setDisplayName] = useState("");
    const [versions, setVersions] = useState([]);
    const [file, setFile] = useState();

    const [fileName, setFileName] = useState("Choose File");

    const fileInputRef = useRef(null);

    const handleFile = (e) => {
        const file = e.target.files[0];

        setFileName(file.name);
        setFile(file);
    }

    const handleSubmit = () => {
        setLoading(true);

        const formData = new FormData();

        formData.append("displayName", displayName);
        formData.append("versions", JSON.stringify(Array.from(versions)));
        formData.append("file", file);

        axios.post(`/api/datapack/${window.location.pathname.split("/")[2]}/upload`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }).then(res => {
            toast.success("Successfully uploaded file!");
            setLoading(false);
            setVisible(false);

            window.location.reload();
        }).catch(e => {
            toast.error("Failed to upload file!");
            setLoading(false);
        })
    }

    return (
        <Modal css={{ zIndex: 0 }} closeButton blur open={visible} onClose={() => setVisible(false)}>
            <Modal.Header>
                <Text b size={22}>Upload File</Text>
            </Modal.Header>
            <Modal.Body>
                <Input clearable bordered label="Display Name" placeholder="Example Pack v1" onInput={(e) => setDisplayName(e.target.value)} />
                <VersionsDropdown value={versions} setValue={setVersions} />
                <Button bordered onClick={() => fileInputRef.current.click()} >{fileName}</Button>
                <input type="file" ref={fileInputRef} accept=".zip" onChange={handleFile} style={{ display: 'none' }} />
            </Modal.Body>
            <Modal.Footer>
                <Button auto flat icon={<UploadIcon height={20} width={20} />} color={"success"} disabled={loading} onClick={handleSubmit}>{loading ? <Loading type="points" color="currentColor" size="sm" /> : "Upload"}</Button>
            </Modal.Footer>
        </Modal>
    )
}