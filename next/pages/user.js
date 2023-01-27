import { Avatar, Badge, Button, Card, Col, Divider, Row, Text } from "@nextui-org/react";
import { useState } from "react";
import Datapack from "../components/Datapack";
import ModUserActionsDropdown from "../components/dropdowns/ModUserActionsDropdown";
import { DownloadIcon } from "../components/icons/download";
import { EditIcon } from "../components/icons/edit";
import { HeartIcon } from "../components/icons/heart";
import EditUserModal from "../components/modals/EditUserModal";
import Page from "../components/Page";

export async function getServerSideProps(context) {
    return {
        props: {
            user: context.query.user || null,
            isModerator: context?.req?.user?.moderator ? true : false,
        },
    };
}

export default function UserPage({ user, isModerator }) {
    const [editModalVisible, setEditModalVisible] = useState(false);

    return (
        <Page>
            <Row css={{ justifyContent: "center", flexWrap: "wrap", mt: 10, gap: 10 }}>
                <Card css={{ height: "max-content", mw: "400px" }}>
                    <Card.Header>
                        <Col>
                            <Row>
                                <Avatar src={`/uploads/user/${user.image}`} />
                                <Text h3 css={{ ml: 10 }}>
                                    {user.username}
                                </Text>
                                {user.isUser ? (
                                    <>
                                        <Button flat size="xs" css={{ ml: "auto" }} icon={<EditIcon />} onClick={() => setEditModalVisible(true)}>
                                            Edit
                                        </Button>
                                        <EditUserModal visible={editModalVisible} setVisible={setEditModalVisible} user={user} />
                                    </>
                                ) : (
                                    isModerator && (
                                        <>
                                            <ModUserActionsDropdown css={{ ml: "auto" }} userIsBanned={user?.banned} setEditModalVisible={setEditModalVisible} />
                                            <EditUserModal visible={editModalVisible} setVisible={setEditModalVisible} user={user} />
                                        </>
                                    )
                                )}
                            </Row>
                            {user.moderator && (
                                <Badge variant="flat" color="success" borderWeight={0}>
                                    Moderator
                                </Badge>
                            )}
                            <Divider css={user.moderator && { mt: 5 }} />
                            <Row justify="center" css={{ mt: 10 }}>
                                <HeartIcon height={30} width={40} />
                                <Text b css={{ justifySelf: "center", ml: 3 }}>
                                    {user.likes}
                                </Text>
                            </Row>
                            <Row justify="center" css={{ mt: 10 }}>
                                <DownloadIcon height={25} width={40} />
                                <Text b css={{ justifySelf: "center", ml: 5 }}>
                                    {user.downloads}
                                </Text>
                            </Row>
                        </Col>
                    </Card.Header>
                </Card>
                <Col css={{ height: "max-content", mw: "800px" }}>
                    <Card>
                        <Card.Header css={{ justifyContent: "center" }}>
                            <Text h4>Datapacks</Text>
                        </Card.Header>
                    </Card>
                    <br />
                    {user.datapacks.map((datapack) => {
                        return <Datapack name={datapack.title} imageSrc={`/uploads/datapack/${datapack.image}`} slug={datapack.slug} author={user.username} summary={datapack.summary} key={datapack.slug} />;
                    })}
                </Col>
            </Row>
        </Page>
    );
}
