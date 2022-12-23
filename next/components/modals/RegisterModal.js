import { Modal, useModal, Button, Text, Input, Loading } from "@nextui-org/react";
import axios from "axios";
import { useState } from "react";
import toast, { Toaster } from 'react-hot-toast';

export default function LoginModal({ visible, setVisible }) {

    const [username, setUsername] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()

    const [loading, setLoading] = useState(false)

    const registerClick = (e) => {

        const errorToast = () => {
            setLoading(false)
            toast.error('Something went wrong, try again soon!', { duration: 3000, style: { backgroundColor: '#FF6466', color: '#FFFFFF' }})
        }


        if(!username || !password || !email) {
            return toast.error('You must fill out the all the fields!', { duration: 3000, style: { backgroundColor: '#FF6466', color: '#FFFFFF' }})
        }

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
                <Input clearable bordered label="Username" value={username} onInput={(e) => setUsername(e.target.value)} />
                <Input clearable bordered label="Email" type="email" value={email} onInput={(e) => setEmail(e.target.value)} />
                <Input bordered label="Password" type={"password"} value={password} onInput={(e) => setPassword(e.target.value)} />
            </Modal.Body>
            <Modal.Footer>
                <Button auto onClick={registerClick} disabled={loading}>{loading ? <Loading type="points" color="currentColor" size="sm" /> : "Register"}</Button>
            </Modal.Footer>
            <Toaster />
        </Modal>
    )
}