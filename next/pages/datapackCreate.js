import { Card, Divider, Grid, Input, Text, Textarea, Image, Row, Button,  Switch, Loading } from "@nextui-org/react";
import Page from "../components/Page";
import { useState, useRef } from "react";
import TagDropdown from "../components/dropdowns/TagDropdown";
import { TrashIcon } from "../components/icons/trash";
import { toast } from "react-hot-toast";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function DatapackCreatePage({  }) {
    const defaultImagePath = "/uploads/datapack/default.png"

    const [creating, setCreating] = useState(false);

    const [title, setTitle] = useState('')
    const [slug, setSlug] = useState('')
    const [summary, setSummary] = useState('')
    const [description, setDescription] = useState('')
    const [image, setImage] = useState()

    const [imagePreview, setImagePreview] = useState(defaultImagePath)

    const [tags, setTags] = useState([])

    const [previewState, setPreviewState] = useState(false);
    const [previewText, setPreviewText] = useState("");

    const descriptionTextAreaRef = useRef(null);

    const fileInputRef = useRef(null);

    const handleImage = (e) => {
        const file = e.target.files[0];

        setImage(file)

        const reader = new FileReader()

        reader.onloadend = () => {
            setImagePreview(reader.result)
        };
        
        reader.readAsDataURL(file);
    }

    const handlePreview = (e) => {
        const value = e.target.checked;

        if(value) {
            setPreviewText(descriptionTextAreaRef.current.value);
            return setPreviewState(value);
        }

        setPreviewState(value);

        setTimeout(() => {
            descriptionTextAreaRef.current.value = previewText;
            setPreviewText("")
        }, 100)
    }

    const handleSlugChange = (e) => {
        const value = e.target.value;

        setSlug(value.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase())
    }

    const handleCreate = () => {
        if(!title || !slug || !summary || !description || tags.length === 0) {
            return toast.error("Please fill out all fields (Check tags)")
        }

        const formData = new FormData()

        formData.append('title', title)
        formData.append('slug', slug)
        formData.append('summary', summary)
        formData.append('description', description)
        formData.append('image', image)
        formData.append('tags', JSON.stringify(Array.from(tags)))

        setCreating(true)

        axios.post('/api/datapack/create', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        }).then((res) => {

            if(res?.data?.error) {
                return toast.error(res.data.error)
            }

            if(res.status == 200) {
                setTimeout(() => {
                    window.location.href = `/datapack/${slug}`
                    toast.success("Datapack created successfully")
                }, 3000)
            } else {
                toast.error("Something went wrong")
            }
        }).catch((e) => {
            setCreating(false)
            toast.error("Something went wrong")
        })
    }

    if(creating) return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            width: '100%',
            height: '100vh',
            display: 'grid',
            placeContent: 'center',
        }}>
            <Loading type="points" size="xl" />
            <Text h6 size={26} css={{ mt: 10 }}>Creating Datapack...</Text>
        </div>
    )

    return (
        <Page>
            <Grid.Container justify="center" gap={2}>
                <Grid xs={24} sm={7}>
                    <Card css={{ mh: 1000, padding: "5px 10px" }}>
                        <Card.Header>
                            <Text h6 size={22}>
                                Create a Datapack
                            </Text>
                        </Card.Header>
                        <Card.Body>
                            <Input clearable bordered label={<><span>Title</span><Text b style={{color: "red", marginLeft: 2}}>*</Text></>} value={title} onInput={(e) => setTitle(e.target.value)} />
                            <Input clearable bordered label="Slug" labelLeft="https://domain/datapacks/" css={{ mt: 15 }} value={slug} onInput={handleSlugChange} />
                            <Divider css={{ mt: 20, mb: 20 }} />
                            <Input clearable bordered label="Summary" placeholder="Short description about your datapack" maxLength={125} onInput={(e) => setSummary(e.target.value)} />
                            <Divider css={{ mt: 20, mb: 20 }} />
                            <Row justify="flex-end">
                                <Text b>Preview</Text>
                                <Switch bordered checked={previewState} onChange={handlePreview} css={{ ml: 5 }} />
                            </Row>
                            {
                                previewState ? (
                                    <Card variant="bordered" css={{ mt: 10 }}><Card.Body><ReactMarkdown remarkPlugins={[remarkGfm]} children={description.replace(/\\n/g, '\n').replace(/(\r\n|\n|\r)/gm, "  \n")} /></Card.Body></Card>
                                ) : (
                                    <Textarea ref={descriptionTextAreaRef} maxLength={4000} rows={20} bordered label="Description" placeholder="Longer, more descriptive information about your datapack" helperText="You can use markdown in your description" css={{ mt: 25 }} onChange={(e) => setDescription(e.target.value)} />
                                )
                            }
                        </Card.Body>
                    </Card>
                </Grid>
                <Grid xs={12} sm={2} style={{ maxWidth: "fit-content" }}>
                    <Card css={{ height: 'max-content' }}>
                        <Card.Body css={{ flexDirection: 'column' }}>
                            <Text h6 size={22} css={{ textAlign: 'center' }}>Image</Text>
                            <Card isHoverable isPressable onPress={() => fileInputRef.current.click()} variant="flat" css={{ width: 125, height: 125, alignSelf: 'center', backgroundColor: "$accents2" }}><Image src={imagePreview} width={125} height={125} /></Card>
                            <Row css={{ justifyContent: 'space-evenly', mt: 10 }}>
                                <input type="file" ref={fileInputRef} accept=".png,.jpg,.jpeg" onChange={handleImage} style={{ display: 'none' }} />

                                <Button size="xs" css={{margin: "5px auto 10px auto"}} color={"error"} onClick={() => { setImagePreview(defaultImagePath); setImage(null); }}><TrashIcon /></Button>
                            </Row>
                            <Divider css={{ mt: 0, mb: 20 }} />
                            <TagDropdown value={tags} setValue={setTags} />
                            <Button css={{ mt: 30 }} color="success" size={"lg"} onClick={handleCreate}>Create</Button>
                        </Card.Body>
                    </Card>
                </Grid>
            </Grid.Container>
        </Page>
    )
}