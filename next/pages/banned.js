import { Link } from '@nextui-org/react'

export default function BanPage({  }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <h1>You have been banned!</h1>
            <a href="/auth/logout">Logout</a>
        </div>
    )
}