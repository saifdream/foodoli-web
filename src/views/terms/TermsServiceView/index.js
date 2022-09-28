import React, {memo} from "react";
import Header from "../../../layouts/Header";
import Footer from "../../../layouts/Footer";
import {Box, Container, makeStyles, Typography, withStyles} from "@material-ui/core";
import Page from "../../../components/Page";

const useStyles = makeStyles((theme) => ({
    root: {
        paddingTop: 60,
        paddingBottom: 30,
        minHeight: '75vh'
    }
}));

const TermsServiceView = memo(
    () => {
        const classes = useStyles();
        return (
            <Page title={'Foodoli | Terms of Services'}>
                <Header/>
                <Container component="main" maxWidth="lg" className={classes.root}>
                    <Box className={classes.root}>
                        <Typography variant="h3" style={{paddingBottom: 20}}>Terms of Services</Typography>
                        <Box>
                            <Typography variant="body1">
                                Intoiit Inc, (hereinafter "Foodoli.com") provides the Foodoli.com website and its associated
                                content and services (collectively "Website") on a limited basis. The following terms and
                                conditions contained within this agreement (hereinafter "Agreement") govern your use of and
                                access to the Website and contain important information about your rights, duties, and
                                obligations when using the Website. If you do not agree with the terms and conditions
                                contained within this Agreement, you are expressly prohibited from using the Website and
                                must discontinue your use of the Website immediately.
                            </Typography>
                            <br/>
                            <Typography>
                                FOODOLI.COM MAY, FROM TIME TO TIME, MODIFY, LIMIT, CHANGE, DISCONTINUE, OR REPLACE THE
                                WEBSITE. FOODOLI.COM RESERVES THE RIGHT TO MODIFY, LIMIT, CHANGE, DISCONTINUE, OR REPLACE
                                THE WEBSITE IN ITS SOLE AND ABSOLUTE DISCRETION. IN THE EVENT FOODOLI.COM MODIFIES, LIMITS,
                                CHANGES, OR REPLACES THE WEBSITE, YOUR USE OF THE WEBSITE AFTER SAID MODIFICATION,
                                LIMITATION, CHANGE, OR REPLACEMENT CONSTITUTES YOUR MANIFESTATION OF ASSENT TO THE
                                MODIFICATION, LIMITATION, CHANGE, OR REPLACEMENT.
                            </Typography>
                            <br/>
                            <Typography variant="h5">Warranties and Representations</Typography>
                            <br/>
                            <Typography variant={"body1"}>
                                You warrant and agree that you have the right, power, and legal capacity to enter into this
                                Agreement and to adhere to the terms and conditions hereunder and that you are not
                                prohibited from entering into this Agreement by any preexisting agreement. You warrant and
                                agree that you are a human individual that is eighteen (18) years of age or older and that
                                you are not a bot, script, or other computer or machine, excluding search engine spiders. If
                                you are under the age of eighteen but are at least sixteen years of age or above, you may
                                only use the Website with parental consent. If you are between the age of sixteen and
                                seventeen, you warrant that you have obtained the authorization of your parent or guardian
                                before using the Website.
                            </Typography>
                            <br/>
                            <Typography variant={"body1"}>
                                If you are entering into this Agreement on behalf of a third party, you warrant and agree
                                that you are an authorized representative of that third party and have the authority to bind
                                that third party to the terms of this Agreement. You warrant and agree that you will access
                                the Website from your own computer or mobile device and that you will not impersonate any
                                person or entity or forge any identifiers or origin or source, such as IP addresses or
                                packet headers, in accessing or using the Website. You agree to comply, in good faith, with
                                the terms of this Agreement.
                            </Typography>
                            <br/>
                            <Typography variant={"h5"}>Privacy Policy</Typography>
                            <br/>
                            <Typography variant="body1">
                                Foodoli.com has adopted its Privacy Policy to provide you with notification of its
                                collection
                                and use of your personal and personally identifiable information. Foodoli.com hereby
                                incorporates its Privacy Policy into this Agreement by reference.
                            </Typography>
                            <br/>
                            <Typography variant="h5">Limited License</Typography>
                            <br/>
                            <Typography variant="body1">
                                You acknowledge and agree that the Website is the property of Foodoli.com and is protected
                                by
                                all applicable laws, intellectual property or otherwise. The Website may not be used,
                                modified, copied, distributed, framed, reproduced, crawled, aggregated, reverse engineered,
                                republished, downloaded, scraped, displayed, posted, transmitted, or sold in any form or by
                                any means, in whole or in part, without the prior written consent of Foodoli.com. The
                                foregoing prohibition on crawling and aggregation will not apply to search engines or
                                non-commercial and publicly available archives that appropriately comply with Foodoli.com'
                                robots.txt file.
                            </Typography>
                            <br/>
                            <Typography variant="body1">
                                Foodoli.com hereby grants you a limited, non-exclusive, non-sublicensable, royalty free,
                                non-assignable, and revocable license to use the Website for your personal and
                                non-commercial use. You are expressly prohibited from reproducing, modifying, distributing,
                                publishing, licensing, creating derivative works of, selling, publicly displaying, or
                                publicly performing the Website outside of the uses expressly stated in this Agreement.
                            </Typography>
                            <br/>
                            <Typography variant="h5">Member Accounts</Typography>
                            <br/>
                            <Typography variant="body1">
                                Foodoli.com may provide you with the ability to register a member account, which may provide
                                you with access to additional areas and features of the Website that are not accessible to
                                non-members, such as the ability to contact other foodoli.com users, to upload data or
                                content in different business pages. (hereinafter "Member Account"). Your Member Account is
                                protected by a username and password. You acknowledge that you are solely responsible for
                                maintaining the security and confidentiality of your username and password and for any
                                access to your Member Account, whether authorized or unauthorized. In the event your Member
                                Account is accessed without your authorization, you agree to immediately provide notice to
                                Foodoli.com.
                            </Typography>
                            <br/>
                            <Typography variant="body1">
                                You have a duty to ensure that the information that you provide through your Member Account
                                is truthful, current, complete, and accurate. You understand and agree that you have an
                                ongoing duty to update and keep current the information provided through your Member Account
                                if and when that information changes. You are expressly prohibited from creating a Member
                                Account that impersonates another person, contains offensive or obscene language, or
                                otherwise violates the rights of a third party. You expressly agree that you will not
                                register more than one Member Account and that you will not use your Member Account to
                                interfere with or disrupt a third party's enjoyment and use of the Website. Foodoli.com
                                reserves the right to restrict access to, suspend, disable, or delete your Member Account at
                                any time, in its sole discretion, and without prior warning. You are expressly prohibited
                                from selling, leasing, lending, assigning, or otherwise transferring your Member
                                Account.
                            </Typography>
                            <br/>
                            <Typography variant="body1">
                                You understand and agree that your Member Account may provide you with the ability to upload
                                User Generated Content and provide that content to third parties. By creating a Member
                                Account, you agree that Foodoli.com may contact you by any available means, including but
                                not limited to by email.
                            </Typography>
                            <br/>
                            <Typography variant="body1">
                                By creating a Member Account, you represent and warrant that you are not bound by or a party
                                to any exclusive arrangement or agreement, whether contractual or otherwise, that would
                                prohibit you from using the Website and its associated services.
                            </Typography>
                            <br/>
                            <Typography variant="h5">Selling Services Through Member Accounts</Typography>
                            <br/>
                            <Typography variant="body1">
                                Foodoli.com may provide you with the ability to sell or advertise products or services
                                through your registration of a Business Member Account. You warrant and agree that the
                                information that you provide on the Website through your Business Member Account, including
                                but not limited to information concerning your products or services, will be accurate,
                                current, and complete. You agree to indemnify, defend, and hold harmless Foodoli.com from
                                and against any and all claims arising out of or in relation to your sale of goods or
                                services through the Website. Your duty to defend Foodoli.com pursuant to this section will
                                not provide you with the ability to control Foodoli.com' defense, and Foodoli.com reserves
                                the right to control its defense, including the choice to settle or litigate a claim.
                            </Typography>
                            <br/>
                            <Typography variant="h5">Purchasing Subscription Accounts</Typography>
                            <br/>
                            <Typography variant="body1">
                                Foodoli.com may provide you with the ability to purchase a subscription to use certain areas
                                and feature of the Website. Foodoli.com may charge fees or charges to you for your purchase
                                of a Subscription Account. You agree to pay all fees or charges on time, and Foodoli.com may
                                terminate or disable your access to the Website or your Business Member Account if you fail
                                to pay any amount owing to Foodoli.com when due.
                            </Typography>
                            <br/>
                            <Typography variant="body1">
                                You agree to pay all applicable taxes or charges imposed by any governmental entity anywhere
                                in the world in connection with your use of the Website. All costs and fees are quoted and
                                payable in United States dollars.
                            </Typography>
                            <br/>
                            <Typography variant="body1">
                                You agree that you will not initiate any chargebacks to Foodoli.com unless otherwise
                                authorized by Foodoli.com in writing. You understand and agree that you will be responsible
                                and required to pay for any costs associated with any chargebacks that you have initiated
                                against Foodoli.com.
                            </Typography>
                            <br/>
                            <Typography variant="body1">
                                In the event you dispute the amount or validity of any payments made under this Agreement,
                                you must notify Foodoli.com within ten (10) days of any such dispute. You understand that
                                your failure to notify Foodoli.com of any dispute within ten (10) days will constitute your
                                express waiver of any claims related to the disputed payment.
                            </Typography>
                            <br/>
                            <Typography variant="body1">
                                Foodoli.com reserves the right at any time to modify or discontinue the Website or any of
                                its
                                associated services without notice and in its sole and absolute discretion. Foodoli.com
                                reserves the right at any time to modify the price charged for the goods offered through the
                                Website.
                            </Typography>
                            <br/>
                            <Typography variant="h5">User Generated Content</Typography>
                            <br/>
                            <Typography variant="body1">
                                You are responsible for any user generated content that you submit to Foodoli.com or the
                                Website, including but not limited to any text, photos, profile information, name, likeness,
                                music, video, advertisements, listings, information, photographs, designs, ideas,
                                selections, or other content (collectively "User Generated Content"). Your User Generated
                                Content belongs to you, subject to copyright, trademark, or other intellectual property
                                rights, including but not limited to Foodoli.com' rights as outlined below.
                            </Typography>
                            <br/>
                            <Typography variant="body1">
                                If you submit User Generated Content to the Website or create User Generated Content through
                                the Website, you agree to grant Foodoli.com an irrevocable, royalty free, and non-exclusive
                                license to use that User Generated Content for the purposes of the Website. The purposes of
                                the
                                Website may include but are not limited to making copies of your User Generated Content for
                                archival purposes and reproducing, displaying, publicly performing, creating derivative
                                works
                                of, or distributing your User Generated Content to third parties. You agree to waive all
                                moral
                                rights in your User Generated Content across the world, whether you have or have not
                                asserted
                                moral rights in or to your User Generated Content.
                            </Typography>
                            <br/>
                            <Typography variant="h5">User Conduct</Typography>
                            <br/>
                            <Typography variant="body1">
                                You expressly agree that you will not use the Website or your Member Account to violate any
                                law, statute, ordinance, regulation, or treaty, to violate the rights of third parties, or
                                for a use outside of the customary and intended use of the Website or your Member Account.
                                Specifically, you are expressly prohibited from:
                            </Typography>
                            <br/>
                            <ul style={{listStyle: 'disc', marginLeft: '30px'}}>
                                <li className="odd first-child">Using a robot, spider, scraper, or other automated
                                    technology to access the Website;
                                </li>
                                <li className="even">Imposing a disproportionate load on the Website or its server
                                    infrastructure or otherwise attempting to interfere with the operation of the Website;
                                </li>
                                <li className="odd">Circumventing Foodoli.com' commissions, fees, or other charges;</li>
                                <li className="even">Circumventing Foodoli.com' technological and physical security
                                    measures;
                                </li>
                                <li className="odd">Impersonating another;</li>
                                <li className="even">Posting or transmitting content that threatens or encourages bodily
                                    harm or destruction of property;
                                </li>
                                <li className="odd">Posting or transmitting content that infringes upon the intellectual
                                    property rights of other users or third parties;
                                </li>
                                <li className="even">Posting or transmitting that content that is offensive, derogatory, or
                                    obscene;
                                </li>
                                <li className="odd">Posting or transmitting content that constitutes fraud, an unwanted
                                    commercial solicitation, a phishing scam, a pyramid scheme, or a chain letter; and
                                </li>
                                <li className="even last-child">Posting or transmitting content intended to collect personal
                                    or personally identifiable information from users or third parties.
                                </li>
                            </ul>
                            <br/>
                            <Typography variant="h5">Term and Termination</Typography>
                            <br/>
                            <Typography variant="body1">
                                This Agreement will remain in full force and effect until terminated under the terms of this
                                Agreement. You may terminate your Member Account through your Member Account control panel.
                                Foodoli.com may terminate this Agreement without liability at any time, without notice, and
                                for any reason, including but not limited to for your violation of a term or condition of
                                this Agreement.
                            </Typography>
                            <br/>
                            <Typography>Third Party Content</Typography>
                            <br/>
                            <Typography variant="body1">
                                The Website may contain links to third party content and websites that are not owned or
                                controlled by Foodoli.com. You acknowledge and agree that Foodoli.com is not responsible and
                                cannot be held liable for third party content and websites.
                            </Typography>
                            <br/>
                            <Typography variant="h5">Disclaimer of Warranties</Typography>
                            <br/>
                            <Typography variant="body1">
                                FOODOLI.COM DISCLAIMS ANY RESPONSIBILITY FOR ANY HARM OR LIABILITY ARISING OUT OF OR RELATED
                                TO YOUR USE OF THE WEBSITE OR ANY GOODS OR SERVICES PURCHASED THROUGH THE WEBSITE.
                                FOODOLI.COM PROVIDES THE WEBSITEON AN AS-IS BASIS AND WITH NO WARRANTIES OF ANY KIND,
                                WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING BUT NOT LIMITED TO WARRANTIES OF
                                MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, ACCURACY, NON-INFRINGEMENT, OR
                                QUALITY. SOME JURISDICTIONS DO NOT ALLOW AN EXCLUSION OF IMPLIED WARRANTIES. IF YOU ARE
                                LOCATED IN SUCH A JURISDICTION, THIS EXCLUSION MAY NOT APPLY.
                            </Typography>
                            <br/>
                            <Typography variant="body1">
                                YOU ALSO, AGREE THAT USE OF THE SITE AS AT YOUR SOLE RISK. NONE OF THE FOODOLI, IT’S
                                SUBSIDIARIES, AFFILIATES, THEIR OFFICERS, DIRECTORS , EMPLOYEES OR AGENTS, GURANTEE THAT USE
                                OF THE SITE WILL BE COMPLETELY SECURE, VIRUS OR ERROR FREE, EVENTHOUGH FOODOLI TAKES
                                SECURITY AND UNINTERRUPTED, ERROR AND VIRUS FREE SERVICE FOR ITS USERS VERY SERIOULSY.
                                FOODOLI ALSO MAKE NO WARRENTY THE ACCURACY, COMPLETENESS OR RELIABILITY OF THE CONTENT ON
                                THE SITE, INCLUDING, WITHOUT LIMITATION, BUSINESS OFFERINGS, PRODUCTS OR OTHER AVAILABLE
                                PROGRAMS, DESCRIPTIONS OF MERCHANT OFFERINGS, PRODUCTS OR OTHER AVAILABLE PROGRAMS,
                                FOODOLI.COM WILL NOT BE HELD RESPONSIBLE OR LIABLE FOR ANY CONTENT POSTED ON THE WEBSITE,
                                ANY THIRD PARTY LINKS POSTED ON THE WEBSITE, ANY TRANSACTIONS ENTERED INTO THROUGH THE
                                WEBSITE, OR ANY CONTENT TRANSMITTED THROUGH THE WEBSITE WHETHER OR NOT THAT CONTENT IS
                                TRANSMITTED THROUGH MEMBER ACCOUNTS. FOODOLI.COM DOES NOT ASSUME RESPONSIBILITY FOR ANY
                                ERROR, OMISSION, INTERRUPTION, DELETION, DEFECT, DESTRUCTION OF IDENTITY, UNAUTHORIZED
                                ACCESS TO A MEMBER ACCOUNT, OR ALTERATION THEREOF. FOODOLI.COM RESERVES THE RIGHT TO
                                DISCONTINUE THE WEBSITE AT ANY TIME.
                            </Typography>
                            <br/>
                            <Typography variant="h5">Limitation of Liability</Typography>
                            <br/>
                            <Typography variant="body1">
                                YOU ACKNOWLEDGE AND AGREE THAT FOODOLI.COM WILL NOT BE LIABLE TO YOU UNDER ANY LEGAL THEORY
                                FOR ANY DAMAGES, CLAIMS, INJURIES, JUDGMENTS, OR LIABILITIES ARISING OUT OF OR RELATED TO
                                YOUR USE OR MISUSE OF THE WEBSITE OR OUT OF ANY TRANSACTION ENTERED INTO THROUGH THE
                                WEBSITE, INCLUDING BUT NOT LIMITED TO LOSS OF BUSINESS, LOSS OF INCOME, SPECIAL DAMAGES,
                                INCIDENTAL DAMAGES, CONSEQUENTIAL DAMAGES, PUNATIVE DAMAGES, OR EXEMPLARY DAMAGES. SOME
                                STATES OR PROVINCES DO NOT ALLOW THE EXCLUSION OR LIMITATION OF DAMAGES. IF YOUR STATE OR
                                PROVINCE DOES NOT ALLOW THE EXCLUSION OR LIMITATION OF DAMAGES, YOU SHOULD SEEK LEGAL
                                COUNSEL TO UNDERSTAND YOUR LEGAL RIGHTS UNDER THE LAW OF YOUR STATE.
                            </Typography>
                            <br/>
                            <Typography variant="h5">Indemnification</Typography>
                            <br/>
                            <Typography variant="body1">
                                You agree to hold harmless, indemnify, and defend Foodoli.com, its officers, employees,
                                agents, successors, and assigns, from any and all claims, demands, losses, damages, rights,
                                and actions of any kind, including without limitation property damage, infringement,
                                personal injury, and death, that either directly or indirectly arises out of or is related
                                to your use of the Website, any transactions entered into through the Website, your
                                violation of any term or condition of this Agreement, your violation of any applicable law,
                                statute, ordinance, regulation, or treaty, whether local, state, national, or international,
                                or your violation of the rights of a third party. Your obligation to defend Foodoli.com
                                under the terms of this Agreement will not provide you with the right to control
                                Foodoli.com' defense, and Foodoli.com reserves the right to control its defense regardless
                                of your contractual requirement to defend Foodoli.com.
                            </Typography>
                            <br/>
                            <Typography variant="h5">Assignment</Typography>
                            <br/>
                            <Typography variant="body1">
                                You hereby understand and agree that you are prohibited from assigning your rights and
                                obligations under this Agreement. Foodoli.com may assign its rights and obligations under
                                this Agreement at any time, including but not limited to in a sale of the Website.
                            </Typography>
                            <br/>
                            <Typography variant="h5">Resolution of Disputes and Governing Law</Typography>
                            <br/>
                            <Typography variant="body1">
                                This Agreement will be interpreted under and governed by the laws of the State of Texas
                                without giving effect to any conflicts of laws principles. You agree that any claim or
                                dispute that you may have against Foodoli.com will be exclusively resolved through
                                arbitration.
                            </Typography>
                            <br/>
                            <Typography variant="body1">
                                YOU AND FOODOLI.COM AGREE THAT ARBITRATION WILL BE THE EXCLUSIVE FORUM AND REMEDY AT LAW FOR
                                ANY DISPUTES ARISING OUT OF OR RELATING TO THIS AGREEMENT, YOUR USE OF THE WEBSITE,OR YOUR
                                PURCHASE OF ANY GOODS OR SERVICES THROUGH THE WEBSITE, INCLUDING ANY DISPUTES CONCERNING THE
                                VALIDITY, INTERPRETATION, VIOLATION, BREACH, OR TERMINATION OF THIS AGREEMENT. ARBITRATION
                                UNDER THIS AGREEMENT WILL BE HELD IN WYLIE, TEXAS AND IN ACCORDANCE WITH THE MOST RECENTLY
                                EFFECTIVE COMMERCIAL ARBITRATION RULES OF THE AMERICAN ARBITRATION ASSOCIATION. THE
                                ARBITRATION PROCEEDING WILL BE DECIDED BY A SINGLE ARBITRATOR AND THE ARBITRATOR WILL DECIDE
                                THE ARBITRATION PROCEEDING BY APPLYING THE LAWS AND LEGAL PRINCIPLES OF THE STATE OF TEXAS
                                AND THE FEDERAL LAWS OF THE UNITED STATES. THE LOSING PARTY WILL BE REQUIRED TO PAY THE
                                PREVAILING PARTY'S REASONABLE ATTORNEYS' FEES. YOU AND FOODOLI.COM AGREE THAT BOTH PARTIES
                                WILL BE REQUIRED TO BE PRESENT WITHIN THE STATE OF TEXAS IN ORDER TO PERFORM THEIR
                                OBLIGATIONS UNDER THIS AGREEMENT. YOU AND FOODOLI.COM AGREE TO SUBMIT TO THE PERSONAL
                                JURISDICTION OF ANY SUCH ARBITRATOR OR ARBITRATION PROCEEDING.
                            </Typography>
                            <br/>
                            <Typography variant="h5">Additional Provisions</Typography>
                            <br/>
                            <Typography variant="body1">
                                A finding that any term or provision of this Agreement is invalid or unenforceable will not
                                affect the validity or enforceability of this Agreement. Any term or provision of this
                                Agreement that is found to be invalid or unenforceable will be reformed to the extent
                                necessary to make it valid and enforceable.
                            </Typography>
                            <br/>
                            <Typography variant="body1">
                                You understand and agree that no term or provision of this Agreement will be deemed to have
                                been waived and no breach will be deemed to have been consented to unless said waiver or
                                consent is in writing and signed by the party to be charged.
                            </Typography>
                            <br/>
                            <Typography variant="body1">
                                This Agreement and the Privacy Policy incorporated by reference constitute the entire
                                agreement between you and Foodoli.com with respect to the Website. You understand and agree
                                that there are no further understandings, agreements, or representations with respect to the
                                Website that are not specified in this Agreement. You understand and agree that any
                                additional provisions that may appear in any communication from you will not bind
                                Foodoli.com.
                            </Typography>
                            <br/>
                            <Typography variant="body1">
                                The Website is not directed to persons under the age of sixteen (16) and Foodoli.com will
                                not
                                knowingly collect personally identifiable information from individuals under the age of
                                eighteen (18) without parental consent. If Foodoli.com inadvertently collects personally
                                identifiable information, Foodoli.com will delete the personally identifiable information in
                                accordance with its security protocols.
                            </Typography>
                            <br/>
                            <Typography variant="body1">
                                FOODOLI.COM AND YOU BOTH AGREE THAT ANY CAUSE OF ACTION ARISING OUT OF OR RELATED TO THE
                                WEBSITE OR ANY GOODS PURCHASED THROUGH THE WEBSITE MUST COMMENCE WITHIN ONE YEAR AFTER THE
                                CAUSE OF ACTION ACCRUES. FAILURE TO ASSERT SAID CAUSE OF ACTION WITHIN ONE YEAR WILL
                                PERMANENTLY BAR ANY AND ALL RELIEF.
                            </Typography>
                            <br/>
                            <Typography>All rights not expressly granted herein are reserved to Foodoli.com.</Typography>
                        </Box>
                    </Box>
                </Container>
                <Footer/>
            </Page>
        )
    }
)

export default TermsServiceView;

