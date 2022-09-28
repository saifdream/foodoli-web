import React, {memo} from "react";
import Header from "../../../layouts/Header";
import Footer from "../../../layouts/Footer";
import {Box, Container, makeStyles, Typography, withStyles} from "@material-ui/core";
import Page from "../../../components/Page";

const useStyles = makeStyles((theme) => ({
    root: {
        paddingTop: 60,
        paddingBottom: 55,
        minHeight: '75vh'
    }
}));

const DisclaimerView = memo(
    () => {
        const classes = useStyles();
        return (
            <Page
                title={'Foodoli | Disclaimer'}
            >
                <Header/>
                <Container component="main" maxWidth="lg" className={classes.root}>
                    <Box className={classes.root}>
                        <Typography variant="h3" style={{paddingBottom: 20}}>Disclaimer</Typography>
                        <Box>
                            <Typography variant="body1" style={{texAlign: 'justify'}}>
                                This website is still in development phase. Live version of this site is in beta version and
                                only for testing purposes for selective users and NOT for public use.
                            </Typography>
                            <br/><br/>
                            <Typography variant="body1" style={{texAlign: 'justify'}}>
                                In no event will foodoli (intoiiT inc) be liable for any loss or damage including
                                without limitation, indirect or consequential loss or damage, or any loss or damage
                                whatsoever arising from loss of data or profits arising out of, or in connection with,
                                the use of this website.
                            </Typography>
                            <br/><br/>
                            <Typography variant="body1" style={{texAlign: 'justify'}}>
                                Through this website we are showing results from 3rd party data source , also you
                                may able to link to other websites which are not under the control of foodoli
                                (intoiiT inc). We have no control over the nature, content and availability of those
                                sites. The inclusion of any links does not necessarily imply a recommendation or
                                endorse the views expressed within them.
                            </Typography>
                            <br/><br/>
                            <Typography variant="body1" style={{texAlign: 'justify'}}>
                                All the information on this website is published in good faith and for general
                                information purpose only. We do not make any warranties about the completeness,
                                reliability and accuracy of this information. Any action you take upon the
                                information on our website is strictly at your own risk. and we will not be
                                liable for any losses and damages in connection with the use of our website.
                            </Typography>
                            <br/><br/>
                            <Typography variant="body1" style={{texAlign: 'justify'}}>
                                Please be also aware that when you leave our website, other sites may have
                                different privacy policies and terms which are beyond our control.
                            </Typography>
                        </Box>
                    </Box>
                </Container>
                <Footer/>
            </Page>
        )
    }
)

export default DisclaimerView;
