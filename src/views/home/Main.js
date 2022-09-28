import React, {Component} from "react";
import {jarallax} from 'jarallax';
import {
    Box,
    Button,
    Dialog,
    DialogContent,
    Fab,
    Grid,
    IconButton,
    Typography,
    withStyles
} from "@material-ui/core";
import ScrollAnimation from "react-animate-on-scroll";
import {ArrowDown, ArrowUpCircle, LogIn} from "react-feather";
import Find from "./Find";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import LoginView from "../auth/Login";
import SignUpView from "../auth/Signup";
import TopProfile from "../../components/TopProfile";

const styles = theme => ({
    jarallax: {
        //minHeight: "50vh",
        height: '100vh',
        //width: 'auto'
    },
    jarallaxImg: {
        position: 'absolute',
        objectFit: 'cover',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
    },
    topContainer: {
        backgroundColor: "#00000035",
        minHeight: "100vh"
    },
    content: {
        textAlign: 'center'
    },
    h2: {
        fontSize: '36px',
        fontWeight: 'bold',
        lineHeight: '46px',
        color: '#fff',
        letterSpacing: '2px',
        textShadow: '0px -1px 3px rgba(0, 0, 0, 0.3)',
        margin: '0px 0 40px',
        fontFamily: `'Open Sans', sans-serif`
    },
    icon: {
        fontWeight: 'bolder',
        //fontSize: 64,
        color: '#fff',
        '&:hover': {
            color: '#00a651'
        },
    },
    iconText: {
        fontWeight: 'bolder',
        fontSize: 18,
        color: '#fff',
        fontFamily: `'Open Sans', sans-serif`,
        textTransform: 'capitalize',
        '&:hover': {
            color: '#00a651'
        },
    },
    /*gotoNext: {
        position: 'absolute',
        left: '50%',
        bottom: '20px',
        marginLeft: '-40px',
    },*/
    gotoNext: {
        position: 'relative',
        display: 'block',
        margin: '0 auto',
        marginLeft: 'auto',
        height: '80px',
        width: '80px',
        border: '2px solid #FFF',
        borderTopColor: 'rgb(255, 255, 255)',
        borderRightColor: 'rgb(255, 255, 255)',
        borderBottomColor: 'rgb(255, 255, 255)',
        borderLeftColor: 'rgb(255, 255, 255)',
        background: `url('/static/images/icons/arrow-down.png') no-repeat center -80px`,
        backgroundPositionX: 'center',
        backgroundPositionY: '-80px',
        textIndent: '-999999px',
        borderRadius: '50%',
        transition: 'all .5s ease-in-out',
    },
    goNext: {
        margin: theme.spacing(4),
        //background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        background: 'rgba(183,183,183,0.2)',
        border: 0,
        //borderRadius: 3,
        boxShadow: '0 3px 5px 3x rgb(0,229,100, .3)',
        //color: 'white',
        //height: 48,
        //fontSize: 18,
        //fontWeight: 'bolder',
        //padding: '0 30px',
        color: '#00a651',
        '&:hover': {
            background: '#00a651',
            color: '#ffffff'
        },
    }
});

class Main extends Component {
    constructor(props) {
        super(props);

        this.state = {
            openSignIn: false,
            openSignUp: false,
        }

        this.$el = React.createRef();
    }

    // init on mount.
    componentDidMount() {
        jarallax(this.$el.current, this.props.options);
    }

    // reinit when props changed.
    componentDidUpdate(prevProps) {
        if (!this.isDestroyed && JSON.stringify(prevProps) !== JSON.stringify(this.props)) {
            jarallax(this.$el.current, 'destroy');
            jarallax(this.$el.current, this.props.options);
        }
    }

    // destroy on unmount.
    componentWillUnmount() {
        this.isDestroyed = true;
        jarallax(this.$el.current, 'destroy');
    }

    handleOpenSignInDialog = () => {
        this.setState({openSignIn: true})
    };

    handleCloseSignInDialog = () => {
        this.setState({openSignIn: false})
    };

    handleOpenSignUpDialog = () => {
        this.setState({openSignUp: true})
    };

    handleCloseSignUpDialog = () => {
        this.setState({openSignUp: false})
    };

    render() {
        const {classes, options, isLoggedIn} = this.props;
        const {openSignIn, openSignUp} = this.state;

        return (
            <div
                className={classes.jarallax}
                ref={this.$el}
            >
                <img className="jarallax-img" src={options.src} alt="Image"/>

                <Box component="div" className={classes.content}>
                    <Grid className= {classes.topContainer}
                        container
                        spacing={0}
                        direction="column"
                        alignItems="center"
                        justify="center"
                    >
                        <Grid item xs={12}>
                            {isLoggedIn && <TopProfile/>}
                            {/*<ScrollAnimation animateIn='fadeIn' animateOut='fadeOut'>*/}
                            <img
                                style={{marginBottom: '50px'}}
                                alt="Logo"
                                src="/static/logo.png"
                            />
                            {/*</ScrollAnimation>*/}
                            <ScrollAnimation animateIn='fadeIn'>
                                <Typography className={classes.h2} variant="h2" component="h2" gutterBottom>
                                    Foodoli will help you find
                                    <br/>
                                    restaurant <i>Specials</i> around you
                                </Typography>
                            </ScrollAnimation>

                            <Find />

                            {
                                !isLoggedIn && (
                                    <Box style={{marginTop: 50}}>
                                        <Grid
                                            container
                                            spacing={4}
                                            direction="row"
                                            alignItems="center"
                                            justify="center"
                                        >
                                            <Grid item>
                                                <Grid
                                                    container
                                                    spacing={0}
                                                    direction="column"
                                                    alignItems="center"
                                                    justify="center"
                                                >
                                                    <IconButton onClick={this.handleOpenSignInDialog}>
                                                        <LogIn className={classes.icon}/>
                                                    </IconButton>
                                                    <Button color="primary" className={classes.iconText} onClick={this.handleOpenSignInDialog}>
                                                        Sign In
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                            <Grid item>
                                                <Grid
                                                    container
                                                    spacing={0}
                                                    direction="column"
                                                    alignItems="center"
                                                    justify="center"
                                                >
                                                    <IconButton onClick={this.handleOpenSignUpDialog}>
                                                        <ArrowUpCircle className={classes.icon}/>
                                                    </IconButton>
                                                    <Button color="primary" className={classes.iconText} onClick={this.handleOpenSignUpDialog}>
                                                        Sign Up
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                )
                            }

                            <Fab color="primary" className={classes.goNext} aria-label="add">
                                <ArrowDown/>
                            </Fab>

                            {/*<a className={classes.gotoNext} href="#full-body">
                                Go to next Section
                                <ArrowDown />
                            </a>*/}

                        </Grid>
                    </Grid>
                    <Dialog open={openSignIn} onClose={this.handleCloseSignInDialog} aria-labelledby="form-dialog-title" disableBackdropClick disableEscapeKeyDown>
                        <DialogContent>
                            <LoginView handleCloseSignInDialog={this.handleCloseSignInDialog} openSignIn={() => {this.handleCloseSignInDialog(); this.handleOpenSignUpDialog();}}/>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={openSignUp} onClose={this.handleCloseSignUpDialog} aria-labelledby="form-dialog-title" disableBackdropClick disableEscapeKeyDown>
                        <DialogContent>
                            <SignUpView handleCloseSignUpDialog={this.handleCloseSignUpDialog}/>
                        </DialogContent>
                    </Dialog>
                </Box>
            </div>
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

export default connect(mapStateToProps, matchDispatchToProps)(withStyles(styles, {withTheme: true})(Main));
