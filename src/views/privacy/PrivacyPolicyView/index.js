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

const PrivacyPolicyView = memo(
    () => {
        const classes = useStyles();
        return (
            <Page
                title={'Foodoli | Terms of Services'}
            >
                <Header/>
                <Container component="main" maxWidth="lg" className={classes.root}>
                    <Box className={classes.root}>
                        <Typography variant="h3" style={{paddingBottom: 20}}>Privacy Policy</Typography>
                        <Box>
                            <Typography variant="body1">
                                Foodoli.com (hereinafter "Foodoli.com") takes your privacy seriously and has adopted this
                                Privacy Policy (hereinafter "Privacy Policy") to inform you of its collection, disclosure,
                                and use of personal and personally identifiable information through your use of the
                                Foodoli.com website and associated content (hereinafter "Website").
                            </Typography>
                            <br/>
                            < Typography variant="body1">
                                Foodoli.com may, from time to time, change, modify, amend, or replace this Privacy
                                Policy. In
                                the event that Foodoli.com changes, modifies, amends, or replaces this Privacy Policy, the
                                Effective Date located above will change. Your use of the Website after a change in the
                                Effective Date constitutes your manifestation of assent to any change, modification,
                                amendment, or replacement of this Privacy Policy and the terms contained
                                therein.
                            </Typography>
                            <br/>
                            <Typography variant="h5">Information Collected</Typography>
                            <br/>
                            <Typography variant="body1">
                                Foodoli.com may collect personal or personally identifiable
                                information from you through your use of the Website, which may include but is not limited
                                to
                                your first name, last name, address, email address, date of birth, country, business name,
                                website URL, IP address, geographical location, comments, links, posts, threads, feedback,
                                reviews, photographs, interests, and preferences (collectively "Personal
                                Information").
                            </Typography>
                            <br/>
                            <Typography variant="body1">
                                Foodoli.com may collect Personal Information from you through various channels,
                                including but
                                not limited to through your voluntary submission of information to the Website, through the
                                collection and analysis of information concerning your computer and browsing activities,
                                through the use of cookies, web beacons, and pixel tags, and through other sources permitted
                                by law.
                            </Typography>
                            <br/>
                            <Typography variant="h5">Use of Personal Information</Typography>
                            <br/>
                            <Typography variant="body1">
                                Foodoli.com may use Personal Information collected from
                                you to provide you with the Website, to respond to requests that you have initiated, to
                                customize the Website or its associated services, to improve your experience on the Website,
                                and
                                to communicate with you to update you on Foodoli.com's Website or services.
                            </Typography>
                            <br/>
                            <Typography variant="body1">
                                By providing any Personal Information to Foodoli.com, you understand and agree that
                                Foodoli.com will collect and process your Personal Information in the United States; you
                                provide your unequivocal consent to the collection and processing of your Personal
                                Information in the United States.
                            </Typography>
                            <br/>
                            < Typography variant="body1">
                                Foodoli.com may share your Personal Information:
                                (1) with third parties where it has obtained your consent;
                                (2) with third party service providers to provide you with services initiated
                                at your request;
                                (3) with Foodoli.com's parents, subsidiaries, successors, and assigns; and
                                (4) with Foodoli.com's business partners who offer services through or in association with
                                the Website.
                            </Typography>
                            <br/>
                            <Typography variant="body1">
                                Except as stated above, Foodoli.com will not sell, rent, lease, or transfer your Personal
                                Information to any individual, business, or government entity except to respond to duly
                                authorized information requests by government authorities, to respond to a duly authorized
                                court order or subpoena, to protect the officers, directors, employees, shareholders, or
                                independent contractors of Foodoli.com, or to help prevent against fraud or the violation of
                                any applicable law, statute, regulation, ordinance, or treaty.
                            </Typography>
                            <br/>
                            <Typography variant="body1">
                                The Personal Information that you provide to Foodoli.com may be displayed on your profile
                                page, which may be accessible to all users of the Website. You may limit third parties'
                                ability to view your Personal Information by changing your Member Account
                                settings.
                            </Typography>
                            <br/>
                            <Typography variant="body1">
                                You understand and agree that Foodoli.com is not responsible for any third party links,
                                content, or communications sent to you from entities or individuals that Foodoli.com does
                                not own or control. You are advised to review the privacy policies of all third party
                                websites.
                            </Typography>
                            <br/>
                            <Typography variant="h5">Use of Cookies and Other Tracking Techniques</Typography>
                            <br/>
                            <Typography variant="body1">
                                Foodoli.com may collect Personal
                                Information from you through the storage of data files on your computer called "cookies."
                                These
                                cookies allow the Website to recognize your computer when you revisit the Website.
                                Additionally,
                                Foodoli.com may collect Personal Information from you through the use of "session cookies,"
                                which help Foodoli.com track the pages that you visit during a single use of the Website to
                                ensure that users are not required to re-enter their usernames and passwords upon accessing
                                each
                                page of the Website. These session cookies will expire once you leave the Website.
                            </Typography>
                            <br/>
                            <Typography variant="body1">
                                Your web browser may provide you with the ability to block or limit cookies. If you
                                object to
                                Foodoli.com's use of cookies, you are advised to adjust your web browser's settings
                                accordingly.
                            </Typography>
                            <br/>
                            <Typography variant="body1">
                                Foodoli.com or its advertisers may also collect Personal Information from you
                                through the use
                                of pixel tags, web beacons, or other tracking techniques. This Personal Information may be
                                used for advertising purposes, whether contextual or otherwise, and may be shared with
                                Foodoli.com's advertisers to provide its advertisers with information on the demographics or
                                preferences of the Website's users.
                            </Typography>
                            <br/>
                            <Typography variant="h5">Accuracy of Information, User Choice and Opt-Out</Typography>
                            <br/>
                            <Typography variant="body1">
                                In the event Foodoli.com
                                allows you
                                to create a Member Account, you will have the opportunity to update components of your
                                Personal
                                Information. You may opt-out of Foodoli.com's collection of your Personal Information by
                                deleting your Member Account and by ceasing your use of the Website.
                            </Typography>
                            <br/>
                            <Typography variant="body1">
                                You are responsible for ensuring that your Personal Information is
                                accurate, complete,
                                current, and relevant. You have an ongoing duty to inform Foodoli.com of any changes in your
                                Personal Information.
                            </Typography>
                            <br/>
                            <Typography variant="h5">Protection and Storage of Personal Information</Typography>
                            <br/>
                            <Typography variant="body1">
                                Foodoli.com undertakes commercially
                                reasonable procedures to help protect your Personal Information from disclosure. Though
                                Foodoli.com takes the security of your Personal Information very seriously, Foodoli.com
                                cannot
                                guarantee that its servers and Website are completely secure. Foodoli.com uses commercially
                                reasonable efforts to protect your Personal Information, but you provide any and all
                                Personal
                                Information at your own risk.
                            </Typography>
                            <br/>
                            <Typography variant="h5">Purchase or Sale of a Business Unit or Subsidiary</Typography>
                            <br/>
                            <Typography variant="body1">
                                Foodoli.com may, from time to time,
                                purchase or sell a business unit or subsidiary. In the event Foodoli.com purchases or sells
                                a
                                business unit or subsidiary, your Personal Information may be transferred to a third party.
                                If
                                this occurs, your Personal Information will continue to be used consistent with the terms of
                                this Privacy Policy.
                            </Typography>
                            <br/>
                            <Typography variant="h5">California Privacy Rights</Typography>
                            <br/>
                            <Typography variant="body1">California residents have the right to receive information
                                that identifies any third party companies or individuals that Foodoli.com has shared your
                                Personal Information with in the previous calendar year, as well as a description of the
                                categories of Personal Information disclosed to that third party. You may obtain this
                                information once a year and free of charge by contacting Foodoli.com at
                                &nbsp;<a href="/contact">contact@Foodoli.com</a>.
                            </Typography>
                            <br/>
                            <Typography variant="Typography">Contact and Notices</Typography>
                            <br/>
                            <Typography variant="body1">
                                All questions and concerns regarding this Privacy Policy may be directed to Foodoli.com, by
                                emailing
                                &nbsp;<a href="/contact">contact@Foodoli.com</a>.
                            </Typography>

                        </Box>
                    </Box>
                </Container>
                <Footer/>
            </Page>
        )
    }
)

export default PrivacyPolicyView;
