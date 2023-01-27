import { Modal, useModal, Button, Text, Input, Loading } from "@nextui-org/react";
import axios from "axios";
import { useState } from "react";
import toast, { Toaster } from 'react-hot-toast';

import { DiscordIcon } from "../icons/discord";

export default function LoginModal({ visible, setVisible }) {

    const [username, setUsername] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()

    const [loading, setLoading] = useState(false)

    const handleUsername = (e) => {
        const value = e.target.value.replace(/[^a-zA-Z0-9-_]/g, '');

        if(value.length > 25) return toast.error('Username must be less than 25 characters!')

        setUsername(value)
    }

    const registerClick = (e) => {

        const errorToast = () => {
            setLoading(false)
            toast.error('Something went wrong, try again soon!')
        }


        if(!username || !password || !email) {
            return toast.error('You must fill out the all the fields!')
        }

        if(!email.match(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) return toast.error("Invalid email!")

        if(password.length < 8) return toast.error('Password must be at least 8 characters long!')

        setLoading(true)

        axios.post('/auth/register', {
            username: username,
            email: email,
            password: password
        }).then((res) => {
            if(res.data.invalid == true) {
                setLoading(false)
                return toast.error('Username / email is already in use!', { duration: 3000, style: { backgroundColor: '#FF6466', color: '#FFFFFF' }})
            }

            if(res.data.success) {
                return setVisible(false)
            }

            errorToast()
        }).catch((e) => {
            console.log(e)

            errorToast()
        })
    }

    return (
        <Modal closeButton blur open={visible} onClose={() => setVisible(false)}>
            <Modal.Header>
                <Text b size={22}>Register</Text>
            </Modal.Header>
            <Modal.Body>
                <Input clearable bordered label="Username" value={username} onInput={handleUsername} />
                <Input clearable bordered label="Email" type="email" value={email} onInput={(e) => setEmail(e.target.value.replace(/[^a-zA-Z0-9-@.+]/g, ''))} />
                <Input bordered label="Password" type={"password"} value={password} onInput={(e) => setPassword(e.target.value)} />
            </Modal.Body>
            <Modal.Footer>
                <Button auto css={{ backgroundColor: "#7289da" }} icon={<DiscordIcon />} iconLeftCss={{ color: 'white' }} onClick={() => window.location.href = "/auth/discord"}>Discord Login</Button>
                <Button auto onClick={registerClick} disabled={loading}>{loading ? <Loading type="points" color="currentColor" size="sm" /> : "Register"}</Button>
            </Modal.Footer>
        </Modal>
    )
}