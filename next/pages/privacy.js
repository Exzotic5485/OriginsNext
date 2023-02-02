import { Card, Col, Divider, Row, Text } from "@nextui-org/react";
import React from "react";

import Page from "../components/Page";

export default function PrivacyPage({}) {
    return (
        <Page>
            <Row css={{ justifyContent: "center", flexWrap: "wrap", mt: 10 }}>
                <Card css={{ height: "max-content", mw: 1000 }}>
                    <Card.Header>
                        <Col>
                            <Text h2 css={{ alignSelf: "self-start" }}>
                                Privacy Policy
                            </Text>
                            <Divider />
                        </Col>
                    </Card.Header>
                    <Card.Body>
                        {/* Generated with https://www.gdprprivacypolicy.net/ */}
                        <p>At Origins Datapacks, accessible from originsdatapacks.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Origins Datapacks and how we use it. At Origins Datapacks, accessible from originsdatapacks.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Origins Datapacks and how we use it.</p>
                        <Text h3>General Data Protection Regulation (GDPR)</Text>
                        <p>We are a Data Controller of your information.</p>
                        <p>Origins Datapacks legal basis for collecting and using the personal information described in this Privacy Policy depends on the Personal Information we collect and the specific context in which we collect the information:</p>
                        <ul>
                            <li>Origins Datapacks needs to perform a contract with you</li>
                            <li>You have given Origins Datapacks permission to do so</li>
                            <li>Processing your personal information is in Origins Datapacks legitimate interests</li>
                            <li>Origins Datapacks needs to comply with the law</li>
                        </ul>
                        <p>Origins Datapacks will retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your information to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our policies.</p>
                        <p>If you are a resident of the European Economic Area (EEA), you have certain data protection rights. If you wish to be informed what Personal Information we hold about you and if you want it to be removed from our systems, please contact us.</p>
                        <p>In certain circumstances, you have the following data protection rights:</p>
                        <ul>
                            <li>The right to access, update or to delete the information we have on you.</li>
                            <li>The right of rectification.</li>
                            <li>The right to object.</li>
                            <li>The right of restriction.</li>
                            <li>The right to data portability</li>
                            <li>The right to withdraw consent</li>
                        </ul>
                        <Text h3>Log Files</Text>
                        <p>
                            Origins Datapacks follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users'
                            movement on the website, and gathering demographic information.
                        </p>
                        <Text h3>Cookies and Web Beacons</Text>
                        <p>Like any other website, Origins Datapacks uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.</p>
                        <Text h3>Privacy Policies</Text>
                        <p>You may consult this list to find the Privacy Policy for each of the advertising partners of Origins Datapacks.</p>
                        <p>Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on Origins Datapacks, which are sent directly to users' browser. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.</p>
                        <p>Note that Origins Datapacks has no access to or control over these cookies that are used by third-party advertisers.</p>
                        <Text h3>Third Party Privacy Policies</Text>
                        <p>Origins Datapacks's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options. </p>
                        <p>You can choose to disable cookies through your individual browser options. To know more detailed information about cookie management with specific web browsers, it can be found at the browsers' respective websites.</p>
                        <Text h3>Children's Information</Text>
                        <p>Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.</p>
                        <p>Origins Datapacks does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.</p>
                        <Text h3>Online Privacy Policy Only</Text>
                        <p>Our Privacy applies only to our online activities and is valid for visitors to our website with regards to the information that they shared and/or collect in Origins Datapacks. This policy is not applicable to any information collected offline or via channels other than this website.</p>
                        <Text h3>Consent</Text>
                        <p>By using our website, you hereby consent to our Privacy Policy and agree to its terms.</p>
                    </Card.Body>
                </Card>
            </Row>
        </Page>
    );
}
