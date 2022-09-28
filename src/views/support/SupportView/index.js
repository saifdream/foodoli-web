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

const SupportView = memo(
    () => {
        const classes = useStyles();
        return (
            <Page
                title={'Foodoli | Support'}
            >
                <Header/>
                <Container component="main" maxWidth="lg" className={classes.root}>
                    <Box className={classes.root}>
                        <Typography variant="h3">Support & FAQ</Typography>
                        <Typography variant="body1">Support content will be here.</Typography>
                    </Box>
                </Container>
                <Footer/>
            </Page>
        )
    }
)

export default SupportView;
