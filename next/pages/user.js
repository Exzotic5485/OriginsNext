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
            <Row css={{ justifyContent: 'center', flexWrap: 'wrap', mt: 10 }}>
                
            </Row>
        </Page>
    )
}