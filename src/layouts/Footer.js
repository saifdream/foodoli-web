import React, {memo} from "react";
import {Container, Grid, Link, makeStyles, Toolbar, Typography} from "@material-ui/core";
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import FacebookIcon from '@material-ui/icons/Facebook';
import TwitterIcon from '@material-ui/icons/Twitter';
import {blue} from "@material-ui/core/colors";
import {Link as RouterLink} from "react-router-dom";

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary">
            {'Copyright © '}
            <Link color="inherit" href="https://foodoli.com/">
                Foodoli
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const useStyles = makeStyles((theme) => ({
    footer: {
        padding: theme.spacing(3, 2),
        marginTop: 'auto',
        backgroundColor: '#242425',//theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
        // display: 'flex',
        // minHeight: '100vh',
        // bottom: 0,
        // flexDirection: 'column',
    },
    toolbar: {
        borderBottom: `1px solid ${theme.palette.divider}`,
    },
    toolbarTitle: {
        flex: 1,
    },
    toolbarSecondary: {
        justifyContent: 'flex-start',
        overflowX: 'auto',
    },
    toolbarLink: {
        padding: theme.spacing(1),
        flexShrink: 0,
        color: '#ffffff',
        fontSize: '16px'
    },
    facebook: {
        color: "#ffffff",
        '&:hover': {
            background: blue[800],
        },
    },
    linkedin: {
        color: "#ffffff",
        '&:hover': {
            background: blue[700],
        },
    },
    twitter: {
        color: "#ffffff",
        '&:hover': {
            background: blue[500],
        },
    },
}));

const Footer = memo(
    () => {
        const classes = useStyles();
        const sections = [
            {title: 'About', url: '/about'},
            {title: 'Contact', url: '/contact'},
            {title: 'Disclaimer', url: '/disclaimer'},
            {title: 'Terms of Services', url: '/terms-services'},
            {title: 'Privacy Policy', url: '/privacy-policy'},
            {title: 'Support & FAQ', url: '/support-faq'},
        ];

        return (
            <footer className={classes.footer}>
                <Container maxWidth="lg">
                    <Copyright/>
                    <Grid container>
                        <Grid item xs={12} sm={5}>
                            <Toolbar component="nav" variant="dense" className={classes.toolbarSecondary}>
                                <Link
                                    color="inherit"
                                    className={classes.toolbarLink}
                                    noWrap variant="body2"
                                    href="https://facebook.com"
                                >
                                    <FacebookIcon className={classes.facebook}/>
                                </Link>
                                <Link
                                    color="inherit"
                                    className={classes.toolbarLink}
                                    noWrap variant="body2"
                                    href="https://linkedin.com"
                                >
                                    <LinkedInIcon className={classes.linkedin}/>
                                </Link>
                                <Link
                                    color="inherit"
                                    className={classes.toolbarLink}
                                    noWrap variant="body2"
                                    href="https://twitter.com"
                                >
                                    <TwitterIcon className={classes.twitter}/>
                                </Link>
                            </Toolbar>
                        </Grid>
                        <Grid item xs={12} sm={7}>
                            <Toolbar component="nav" variant="dense" className={classes.toolbarSecondary}>
                                {sections.map((section) => (
                                    <RouterLink to={section.url}
                                                color="inherit"
                                                noWrap
                                                key={section.title}
                                                variant="body2"
                                                href={section.url}
                                                className={classes.toolbarLink}
                                    >
                                        {section.title}
                                    </RouterLink>
                                ))}
                            </Toolbar>
                        </Grid>
                    </Grid>
                </Container>
            </footer>
        )
    }
)

export default Footer;
