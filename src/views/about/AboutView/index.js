import React, {memo} from "react";
import Header from "../../../layouts/Header";
import Footer from "../../../layouts/Footer";
import {Box, Container, makeStyles, Typography, withStyles} from "@material-ui/core";
import Page from "../../../components/Page";

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: 90,
        minHeight: '75vh'
    }
}));

const AboutView = memo(
    () => {
        const classes = useStyles();
        return (
            <Page
                title={'Foodoli | About'}
            >
                <Header/>
                <Container component="main" maxWidth="lg" className={classes.root}>
                    <Box>
                        <Typography variant="h3">About</Typography>
                        <Typography variant="body1">About content will be here.</Typography>
                    </Box>
                </Container>
                <Footer/>
            </Page>
        )
    }
)

export default AboutView;

