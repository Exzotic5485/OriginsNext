import { Card, Text, Grid, Link, Button, Col, Row, Divider, User } from "@nextui-org/react";
import NextLink from 'next/link'
import axios from "axios";
import Page from "../components/Page";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { HeartIcon } from "../components/icons/heart";
import { DownloadIcon } from "../components/icons/download";
import { FlagIcon } from "../components/icons/flag";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { UploadIcon } from "../components/icons/upload";
import UploadFileModal from "../components/modals/UploadFileModal";

import parseVersions from "../../shared/parseVersions";
import { TrashIcon } from "../components/icons/trash";
import { EditIcon } from "../components/icons/edit";

export async function getServerSideProps(context) {
    const { req } = context;

    return {
        props: {
            datapack: context.query.datapack || null,
            isLoggedIn: req?.user ? true : false,
        },
    };
}

export default function DatapackPage({ datapack, isLoggedIn }) {
    const [likes, setLikes] = useState(datapack.likes);
    const [liked, setLiked] = useState(datapack.userLiked);

    const [files, setFiles] = useState(datapack.files);

    const [uploadModalVisible, setUploadModalVisible] = useState(false);

    const handeLikeButton = (e) => {
        if(!isLoggedIn) return toast.error(`You must be logged in to like a post!`)

        axios.post(`/api/datapack/${datapack.id}/like`, {}).then(({ data }) => {
            toast.success(`${data.liked ? "Liked" : "Unliked"} datapack!`)

            setLikes(data.liked ? likes + 1 : likes - 1)
            setLiked(data.liked)
        }).catch((e) => {
            toast.error(`Failed to like datapack!`)
        })
    }

    const handleDeleteFile = (id) => {
        axios.delete(`/api/datapack/${datapack.id}/file/${id}`).then((res) => {
            toast.success(`Successfully deleted file!`)

            setFiles(files.filter(file => file.id !== id))
        }).catch((e) => {
            toast.error(`Failed to delete file!`)
        })
    }

    return (
        <Page>
            <Grid.Container justify="center" gap={2}>
                <Grid xs={24} sm={7} md={6.5} css={{}}>
                    <Card css={{ height: 'max-content', padding: "5px 10px"  }}>
                        <Card.Header css={{ flexDirection: 'column' }}>
                            <Text h6 size={22} css={{ alignSelf: 'self-start'}}>
                                {datapack.title}
                            </Text>
                            <Divider />
                        </Card.Header>
                        <Card.Body>
                            <ReactMarkdown remarkPlugins={[remarkGfm]} children={datapack.description.replace(/\\n/g, '\n').replace(/(\r\n|\n|\r)/gm, "  \n")} />
                        </Card.Body>
                    </Card>
                </Grid>
                <Grid xs={12} sm={3} md={2}>
                    <Card css={{ height: 'max-content' }}>
                        <Card.Header css={{ justifyContent: 'center', flexDirection: 'column' }}>
                            <Button size={"md"} color={'primary'} css={{ m: 'auto' }} icon={<DownloadIcon />}>Download</Button>
                            <Divider css={{ mt: 10, mb: 10 }} />
                            <div style={{ flexDirection: 'row', display: 'flex'}}>
                                <HeartIcon />
                                <Text b css={{ justifySelf: 'center', ml: 5 }}>{likes}</Text>
                            </div>
                            <div style={{ flexDirection: 'row', display: 'flex'}}>
                                <DownloadIcon />
                                <Text b css={{ justifySelf: 'center', ml: 5 }}>{datapack.downloads || 0}</Text>
                            </div>
                            <Divider css={{ mt: 10, mb: 10 }} />
                            <div style={{ flexDirection: 'row', display: 'flex', justifyContent: 'space-evenly', width: "100%" }}>
                                <Button size={"xs"} color={liked ? "disabled" : "error"} icon={<HeartIcon width={18} />} onClick={handeLikeButton}>Like</Button>
                                <Button size={"xs"} css={{ backgroundColor: '#FF6466' }} icon={<FlagIcon />}>Report</Button>
                            </div>
                            { datapack.isOwner ? (
                            <Row css={{ justifyContent: 'center', mt: 10 }}>
                                <Button size={"xs"} css={{ backgroundColor: '#ea5c30' }} icon={<EditIcon />}>Edit</Button>
                            </Row>
                            ) : null}
                            <Divider css={{ mt: 10 }} />
                        </Card.Header>
                        <Card.Body>
                            <Card isHoverable isPressable variant="bordered">
                                <Card.Body>
                                    <User src={`/uploads/user/${datapack.owner.image}`} name={datapack.owner.username} />
                                </Card.Body>
                            </Card>
                            <Divider css={{ mt: 10, mb: 10 }} />
                            <Row>
                                <Text h4>Versions</Text>
                                {datapack.isOwner ? (
                                    <>
                                        <Button auto bordered css={{ ml: 'auto', w: 5, h: 20, mt: 8 }} color={"primary"} onClick={() => setUploadModalVisible(true)}>+</Button>
                                        <UploadFileModal visible={uploadModalVisible} setVisible={setUploadModalVisible} />
                                    </>
                                ) : null}
                            </Row>
                            {files.map((file) => {
                                if(!file.featured) return;

                                return (
                                    <Card variant="bordered" css={{ height: 100, display: 'flex', mb: 10 }} key={file.id}>
                                        <Card.Body css={{ overflow: 'unset' }}>
                                            <Row>
                                                <Text b css={{ fontSize: 16}}>{file.displayName}</Text>
                                                {datapack.isOwner ? (
                                                    <Button auto color={"error"} css={{ width: 5, height: 25, ml: 'auto', top: -10 }} onClick={() => handleDeleteFile(file.id)}><TrashIcon width={16} /></Button>
                                                ) : null}
                                            </Row>
                                            <Row css={{ justifyContent: 'space-between' }}>
                                                <Text i css={{ fontSize: 14 }}>{parseVersions(file.supportedVersions)}</Text>
                                                <Button size={"xs"} style={{ width: 15 }}><DownloadIcon /></Button>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                )
                            })}
                        </Card.Body>
                    </Card>
                </Grid>
            </Grid.Container>
        </Page>
    );
}
