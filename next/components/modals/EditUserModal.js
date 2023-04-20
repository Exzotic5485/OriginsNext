import { Button, Card, Input, Loading, Modal, Text, Col, Image, Divider } from "@nextui-org/react";
import axios from "axios";
import { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { TrashIcon } from "../icons/trash";

export default function EditUserModal({ visible, setVisible, user }) {
    const [loading, setLoading] = useState(false);

    const [username, setUsername] = useState(user.username);

    const fileInputRef = useRef(null);
    const emailRef = useRef(null);

    const [imagePreview, setImagePreview] = useState(`/uploads/user/${user.image}`);
    const [image, setImage] = useState();

    const usernameDisabled = user.usernameLastChanged ? new Date(user.usernameLastChanged).getTime() + 2592000000 > new Date().getTime() : false;

    const handleUsername = (e) => {
        const value = e.target.value.replace(/[^a-zA-Z0-9-]/g, '');

        if(value.length > 25) return toast.error('Username must be less than 25 characters!')

        setUsername(value)
    }

    const handleImage = (e) => {
        const file = e.target.files[0];

        setImage(file)

        const reader = new FileReader()

        reader.onloadend = () => {
            setImagePreview(reader.result)
        };
        
        reader.readAsDataURL(file);
    }

    const handleSumbit = () => {
        setLoading(true);

        const formData = new FormData();
        formData.append("username", username);
        formData.append("email", emailRef.current.value);

        if(image) formData.append("image", image);

        axios.post(`/api/user/${user.id}/edit`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        }).then(res => {
                if(res.data.success) {
                    toast.success("Successfully updated user!");
                    setVisible(false);
                } else if (res?.data?.error) {
                    toast.error(res.data.error); 
                } else {
                    toast.error("Failed to update user!");
                }
            }).catch(err => {
                toast.error("Failed to update user!");
            }).finally(() => {
                setLoading(false);
            });
    }

    return (
        <Modal css={{ zIndex: 0 }} closeButton blur open={visible} onClose={() => setVisible(false)}>
            <Modal.Header>
                <Text b size={22}>Edit Profile</Text>
            </Modal.Header>
            <Modal.Body>
                <input type="file" ref={fileInputRef} accept=".png,.jpg,.jpeg" onChange={handleImage} style={{ display: 'none' }} />
                <Col css={{ display: 'flex', justifyContent: 'center', gap: 5 }}>
                    <Card isHoverable isPressable onPress={() => fileInputRef.current.click()} variant="flat" css={{ width: 125, height: 125, backgroundColor: "$accents2" }}><Image src={imagePreview} width={125} height={125} /></Card>
                    <Button size="xs" css={{ alignSelf: 'center' }} color={"error"} onClick={() => {
                        const defaultImagePath = `/uploads/user/default.png`;
                        if(imagePreview == defaultImagePath && user.image != defaultImagePath) return setImagePreview(`/uploads/user/${user.image}`);
                        if(imagePreview != defaultImagePath) setImagePreview(`/uploads/user/default.png`)
                    }}><TrashIcon /></Button>
                </Col>
                <Divider css={{ mt: 5, mb: 5 }} />
                <Input bordered label="Username" value={username} onInput={handleUsername} />
                <Input bordered type="email" ref={emailRef} label="Email" initialValue={user.email} />
            </Modal.Body>
            <Modal.Footer>
                <Button auto onClick={handleSumbit} disabled={loading}>{loading ? <Loading type="points" color="currentColor" size="sm" /> : "Save"}</Button>
            </Modal.Footer>
        </Modal>
    )
}