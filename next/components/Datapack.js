import { Button, Card, Grid, Text, Link, Row } from '@nextui-org/react'
import { DownloadIcon } from './icons/download';

export default function Datapack({ name, downloads, author, imageSrc, slug, summary }) {

    const downloadClick = (e) => {
        window.location.href = `/datapack/${slug}/download`
    }
    
    return (
        <Card isPressable css={{mb: 15}} onClick={() => window.location.href = `/datapack/${slug}`}>
          <Grid.Container gap={0} justify="flex-start">
              <Grid xs={1} justify="center" style={{ width: "fit-content", maxWidth: "fit-content", padding: "10px 5px 10px 15px", boxSizing: "content-box", flexBasis: "auto" }}>
                  <img src={imageSrc} width={60} height={60} style={{ alignSelf: 'center', borderRadius: 4, width: 60, height: 60 }}/>
              </Grid>
              <Grid style={{flex: 1}}>
                  <Card.Header css={{ flex: 1, mh: 10, mt: 10 }}>
                    <Text b size={22}>{name}</Text>
                    <Button size="xs" color="gradient" onClick={downloadClick} css={{ ml: 'auto' }} >Download</Button>
                  </Card.Header>
                  <Card.Body css={{pt: 0}}>
                      <Link href={`/user/${author}`}>
                        <Text h6 css={{mb: 0, fontSize: 14}}>By <Text b i>{author}</Text></Text>
                      </Link>
                      <Row css={{ width: '100%' }}>
                        <Text size={15} color="gray" css={{ pt: 1 }}>
                            {summary}
                        </Text>
                        <Row css={{ ml: 'auto', justifyContent: "flex-end" }}>
                          <DownloadIcon />
                          <Text size={15}>
                            {downloads}
                          </Text>
                        </Row>
                      </Row>
                  </Card.Body>
              </Grid>
          </Grid.Container>
        </Card>
      );
}