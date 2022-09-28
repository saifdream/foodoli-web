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

const ContactView = memo(
    () => {
        const classes = useStyles();
        return (
            <Page
                title={'Foodoli | Contact'}
            >
                <Header/>
                <Container component="main" maxWidth="lg" className={classes.root}>
                    <Box className={classes.root}>
                        <Typography variant="h3">Contact</Typography>
                        <Typography variant="body1">Contact content will be here.</Typography>
                    </Box>
                </Container>
                <Footer/>
            </Page>
        )
    }
)

export default ContactView;
