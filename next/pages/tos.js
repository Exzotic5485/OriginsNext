import { Card, Col, Divider, Row, Text } from "@nextui-org/react";
import React from "react";

import Page from "../components/Page";

export default function TosPage({}) {
    return (
        <Page>
            <Row css={{ justifyContent: "center", flexWrap: "wrap", mt: 10 }}>
                <Card css={{ height: "max-content", mw: 1000 }}>
                    <Card.Header>
                        <Col>
                            <Text h2 css={{ alignSelf: "self-start" }}>
                                Terms of Service
                            </Text>
                            <Divider />
                        </Col>
                    </Card.Header>
                    <Card.Body>
                        {/* Generated with https://www.termsofservicegenerator.net/ */}
                        <Text h3>Terms</Text>
                        <p>By accessing this Website, accessible from originsdatapacks.com, you are agreeing to be bound by these Website Terms and Conditions of Use and agree that you are responsible for the agreement with any applicable local laws. If you disagree with any of these terms, you are prohibited from accessing this site. The materials contained in this Website are protected by copyright and trade mark law.</p>
                        <Text h3>Use License</Text>
                        <p>
                            Permission is granted to temporarily download one copy of the materials on Origins Datapacks's Website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not: modify or copy the materials; use the materials for any commercial purpose or for any public display; attempt to reverse engineer any software contained on Origins Datapacks's Website; remove any copyright or other proprietary notations from the materials; or transferring the materials to another person or "mirror" the
                            materials on any other server. This will let Origins Datapacks to terminate upon violations of any of these restrictions. Upon termination, your viewing right will also be terminated and you should destroy any downloaded materials in your possession whether it is printed or electronic format.
                        </p>
                        <Text h3>Disclaimer</Text>
                        <p>All the materials on Origins Datapacks’s Website are provided "as is". Origins Datapacks makes no warranties, may it be expressed or implied, therefore negates all other warranties. Furthermore, Origins Datapacks does not make any representations concerning the accuracy or reliability of the use of the materials on its Website or otherwise relating to such materials or any sites linked to this Website.</p>
                        <Text h3>Limitations</Text>
                        <p>Origins Datapacks or its suppliers will not be hold accountable for any damages that will arise with the use or inability to use the materials on Origins Datapacks’s Website, even if Origins Datapacks or an authorize representative of this Website has been notified, orally or written, of the possibility of such damage. Some jurisdiction does not allow limitations on implied warranties or limitations of liability for incidental damages, these limitations may not apply to you.</p>
                        <Text h3>Revisions and Errata</Text>
                        <p>The materials appearing on Origins Datapacks’s Website may include technical, typographical, or photographic errors. Origins Datapacks will not promise that any of the materials in this Website are accurate, complete, or current. Origins Datapacks may change the materials contained on its Website at any time without notice. Origins Datapacks does not make any commitment to update the materials.</p>
                        <Text h3>Links</Text>
                        <p>Origins Datapacks has not reviewed all of the sites linked to its Website and is not responsible for the contents of any such linked site. The presence of any link does not imply endorsement by Origins Datapacks of the site. The use of any linked website is at the user’s own risk.</p>
                        <Text h3>Site Terms of Use Modifications</Text>
                        <p>Origins Datapacks may revise these Terms of Use for its Website at any time without prior notice. By using this Website, you are agreeing to be bound by the current version of these Terms and Conditions of Use.</p>
                        <Text h3>Your Privacy</Text>
                        <p>Please read our <a href="/privacy">Privacy Policy</a></p>
                        <Text h3>Governing Law</Text>
                        <p>Any claim related to Origins Datapacks's Website shall be governed by the laws of af without regards to its conflict of law provisions.</p>
                        <Text h3>User Content</Text>
                        <p>The Site allows users to upload, share, and download content (the "User Content"). You are solely responsible for any User Content you make available through the Site. You represent and warrant that: (i) you either own or have the necessary rights and permissions to use and make available any User Content you make available through the Site, including all necessary licenses and clearances; and (ii) the User Content, your use of the User Content, and your making the User Content available through the Site does not and will not infringe, misappropriate, or violate a third party's patent, copyright, trademark, trade secret, moral rights, or other proprietary or intellectual property rights, or rights of publicity or privacy, or result in the violation of any applicable law or regulation.</p>
                    </Card.Body>
                </Card>
            </Row>
        </Page>
    );
}
