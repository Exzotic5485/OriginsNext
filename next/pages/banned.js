import { Container, Grid, Link } from '@nextui-org/react'
import React from 'react'
import { BanIcon } from '../components/icons/ban'

export default function BanPage({  }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <h1>You have been banned!</h1>
            <Link color="text">Logout</Link>
        </div>
    )
}