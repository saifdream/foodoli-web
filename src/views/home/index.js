import React, {Component} from "react";
import Page from "../../components/Page";
import {Box, Button, Container, Dialog, DialogContent, Grid, Typography, withStyles} from "@material-ui/core";
import Footer from "../../layouts/Footer";
import {Android, Apple} from "@material-ui/icons";
import Main from "./Main";
import ScrollAnimation from 'react-animate-on-scroll';
import Specials from "./Specials";
import LoginView from "../auth/Login";
import SignUpView from "../auth/Signup";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

const styles = theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
    },
    main: {
        //marginTop: theme.spacing(8),
        //marginBottom: theme.spacing(2),
    },
    card: {
        display: 'flex',
    },
    cardDetails: {
        flex: 1,
    },
    cardMedia: {
        width: 160,
        /*'&:hover': {
            transform: 'scale(1.25)',
        }*/
    },
    gridList: {
        paddingBottom: theme.spacing(4)
        //width: '100%',
        //height: 450,
    },
    promotion: {
        position: 'relative',
        backgroundColor: theme.palette.grey[800],
        color: theme.palette.common.white,
        //marginBottom: theme.spacing(4),
        //backgroundImage: 'url(https://source.unsplash.com/random)',
        backgroundImage: 'url(/static/images/promotion.jpg)',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        height: '470px',
        textAlign: 'center'
    },
    h1: {
        fontSize: '50px',
        lineHeight: '54px',
        fontWeight: 600,
        fontFamily: `'Open Sans', sans-serif`
    },
    h2: {
        fontSize: '32px',
        fontWeight: 400,
        lineHeight: '34px',
        fontFamily: `'Open Sans', sans-serif`
    },
    preFooter: {
        position: 'relative',
        display: 'block',
        padding: '37px 0px',
        background: '#404041',
        borderTop: '20px solid #00a651',
        color: '#FFF',
        zIndex: 6,
        fontFamily: `'Open Sans', sans-serif`
    },
    preFooterDesc: {
        position: 'relative',
        //maxWidth: '680px',
        fontFamily: `'Open Sans', sans-serif`
    },
    phone: {
        position: 'absolute',
        right: '0px',
        bottom: '-40px',
    },
    phoneButton: {
        marginRight: theme.spacing(1),
        //background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        background: '#000000',
        border: 0,
        borderRadius: 3,
        boxShadow: '0 3px 5px 3x rgb(0,229,100, .3)',
        color: 'white',
        height: 48,
        textTransform: 'capitalize',
        padding: '0 30px',
        '&:hover': {
            background: '#00a651',
        },
        fontFamily: `'Open Sans', sans-serif`
    },
    signUpButton: {
        marginTop: theme.spacing(3),
        marginRight: theme.spacing(1),
        //background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        background: '#00a651',
        border: 0,
        borderRadius: 3,
        boxShadow: '0 3px 5px 3x rgb(0,229,100, .3)',
        color: 'white',
        height: 48,
        fontSize: 18,
        fontWeight: 'bolder',
        padding: '0 30px',
        textTransform: 'capitalize',
        '&:hover': {
            background: '#ffffff',
            color: '#00a651'
        },

        fontFamily: `'Open Sans', sans-serif`
    },
});

class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            openSignUp: false,
        }
    }

    componentDidMount() {}

    handleOpenSignUpDialog = () => {
        this.setState({openSignUp: true})
    };

    handleCloseSignUpDialog = () => {
        this.setState({openSignUp: false})
    };

    render() {
        const {classes, isLoggedIn} = this.props;
        const {openSignUp} = this.state;

        return (
            <Page
                className={classes.root}
                title="Foodoli"
            >
                {/*<CssBaseline/>*/}
                {/*<Container component="main" className={classes.main} maxWidth="sm">*/}
                <div className={classes.main}>
                    <Main options={{
                        src: `/static/images/landing-${Math.floor(Math.random() * 3)}.jpg`,
                        speed: 0.6,
                    }}
                    />
                    <Container component="main" maxWidth="lg" id='#full-body'>
                        <Grid
                            container
                            spacing={0}
                            direction="column"
                            alignItems="center"
                            justify="center"
                            style={{minHeight: '50vh', textAlign: 'center'}}
                        >

                            <Grid item xs={12} style={{marginTop: 25}}>
                                <Typography variant="h3" component="h1" gutterBottom
                                            style={{color: '#00a651', fontWeight: 'bolder'}}>
                                    Discover Specials
                                </Typography>
                                <Typography variant="h4" component="h2" gutterBottom>
                                    Find out restaurants offering specials
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Specials/>
                            </Grid>
                        </Grid>
                    </Container>
                    <Box component="div" className={classes.promotion}>
                        <Grid
                            container
                            spacing={0}
                            direction="column"
                            alignItems="center"
                            justify="center"
                            style={{minHeight: '60vh'}}
                        >
                            <Grid item xs={12}>
                                <ScrollAnimation animateIn='fadeIn'>
                                    <Typography className={classes.h1} variant="h1" component="h1" gutterBottom>
                                        Are you a restaurant owner?
                                    </Typography>
                                </ScrollAnimation>
                                <ScrollAnimation animateIn='fadeIn'>
                                    <Typography className={classes.h2} variant="h2" component="h2" gutterBottom>
                                        Display your Specials and maximize your profit
                                        <br/>
                                        Join us today
                                    </Typography>
                                </ScrollAnimation>
                                {
                                    !isLoggedIn && (
                                        <ScrollAnimation animateIn='fadeIn'>
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                className={classes.signUpButton}
                                                disableElevation
                                                onClick={this.handleOpenSignUpDialog}
                                            >
                                                Sign Up
                                            </Button>
                                        </ScrollAnimation>
                                    )
                                }
                            </Grid>
                        </Grid>
                    </Box>
                    <Box component="div" className={classes.preFooter}>
                        <Container component="div" className={classes.preFooterDesc} maxWidth="lg">
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <ScrollAnimation animateIn='fadeIn' animateOut='fadeOut'>
                                        <Typography variant="h2" component="h2" gutterBottom>
                                            Discover & share restaurant specials
                                        </Typography>
                                    </ScrollAnimation>
                                    <ScrollAnimation animateIn='fadeIn' animateOut='fadeOut'>
                                        <Typography variant="subtitle1" gutterBottom>
                                            Find which restaurant you want to dine in, see what special dishes are being
                                            offered nearby. Learn what other people talk about your selected restaurants
                                            and
                                            special dishes.
                                            <br/>
                                            <br/>
                                            Discover and share restaurants and their specials using our apps.
                                        </Typography>
                                    </ScrollAnimation>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <div className={classes.phone}>
                                        <ScrollAnimation animateIn='flipInX'>
                                        <img src={'/static/images/iphone.png'} alt="Phone"/>
                                        </ScrollAnimation>
                                    </div>
                                </Grid>
                            </Grid>
                            <Box>
                                <ScrollAnimation animateIn='flipInX'>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        className={classes.phoneButton}
                                        startIcon={<Apple/>}
                                        disableElevation
                                    >
                                        Download for iPhone
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        className={classes.phoneButton}
                                        startIcon={<Android/>}
                                        disableElevation
                                    >
                                        Download for Android
                                    </Button>
                                </ScrollAnimation>
                            </Box>
                        </Container>
                    </Box>
                    <Dialog open={openSignUp} onClose={this.handleCloseSignUpDialog} aria-labelledby="form-dialog-title" disableBackdropClick disableEscapeKeyDown>
                        <DialogContent>
                            <SignUpView handleCloseSignUpDialog={this.handleCloseSignUpDialog}/>
                        </DialogContent>
                    </Dialog>
                </div>
                {/*</Container>*/}
                <Footer/>
            </Page>
        )
    }
}

function mapStateToProps(state) {
    return {
        isLoggedIn: state.user.isLoggedIn,
    };
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(withStyles(styles, {withTheme: true})(Home));

//export default withStyles(styles, {withTheme: true})(Home);
