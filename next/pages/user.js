import { Avatar, Card, Row, Text } from "@nextui-org/react";
import Page from "../components/Page";

export async function getServerSideProps(context) {
    console.log(context.query.user)
    return {
        props: {
            user: context.query.user || null
        }
    }
}

export default function UserPage({ user }) {
    console.log(user)
    return (
        <Page>
            <Row css={{ justifyContent: 'center', flexWrap: 'wrap', mt: 10, gap: 10 }}>
                <Card css={{ height: "max-content", mw: "400px" }}>
                    <Card.Header>
                        <Avatar src={`/uploads/user/${user.image}`}/>
                        <Text h3 css={{ ml: 10 }}>{user.username}</Text>
                    </Card.Header>
                </Card>
                <Card css={{ height: "max-content", mw: "800px" }}>
                    <Card.Header>
                        Test
                    </Card.Header>
                </Card>
            </Row>
        </Page>
    )
}