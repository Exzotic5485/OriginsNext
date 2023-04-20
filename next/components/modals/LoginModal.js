import { Modal, useModal, Button, Text, Input, Loading } from "@nextui-org/react";
import axios from "axios";
import { useState } from "react";
import toast from 'react-hot-toast';
import { DiscordIcon } from "../icons/discord";
import { LockIcon } from "../icons/lock";
import { UserIcon } from "../icons/user";

export default function LoginModal({ visible, setVisible }) {
    const [username, setUsername] = useState()
    const [password, setPassword] = useState()

    const [loading, setLoading] = useState(false)

    const loginClick = (e) => {
        if(!username || !password) {
            toast.error('No username / password entered!', { duration: 3000, style: { backgroundColor: '#FF6466', color: '#FFFFFF', style: { zIndex: 1000 } }})
            return console.log("No user / pass")
        }

        setLoading(true)

        axios.post('/auth/login', {
            username: username,
            password: password
        }).then((res) => {

            if(res?.data?.shouldVerify) return window.location.href = "/verify"

            setVisible(false)
        }).catch((e) => {
            console.log(e)

            if(e?.code == 'ERR_BAD_REQUEST') {
                setLoading(false)
                return toast.error('Invalid username / password!', { duration: 3000, style: { backgroundColor: '#FF6466', color: '#FFFFFF' }})
            }

            setLoading(false)
            toast.error('Something went wrong, try again soon!', { duration: 3000, style: { backgroundColor: '#FF6466', color: '#FFFFFF' }})
        })
    }

    return (
        <Modal css={{ zIndex: 0 }} closeButton blur open={visible} onClose={() => setVisible(false)}>
            <Modal.Header>
                <Text b size={22}>Login</Text>
            </Modal.Header>
            <Modal.Body>
                <Input clearable bordered contentLeft={<UserIcon />} label="Username / Email" value={username} onChange={(e) => setUsername(e.target.value)} />
                <Input bordered label="Password" contentLeft={<LockIcon />} type={"password"} value={password} onInput={(e) => setPassword(e.target.value)} />
            </Modal.Body>
            <Modal.Footer>
                <Button auto css={{ backgroundColor: "#7289da" }} icon={<DiscordIcon />} iconLeftCss={{ color: 'white' }} onClick={() => window.location.href = "/auth/discord"}>Discord Login</Button>
                <Button auto onClick={loginClick} disabled={loading}>{loading ? <Loading type="points" color="currentColor" size="sm" /> : "Login"}</Button>
            </Modal.Footer>
        </Modal>
    )
}