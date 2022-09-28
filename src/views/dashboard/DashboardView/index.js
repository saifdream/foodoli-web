import React, {Component} from "react";
import Page from "../../../components/Page";
import Header from "../../../layouts/Header";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Outlet} from "react-router-dom";
import {Container, Grid} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import {useNavigate} from "react-router";
import {
    DashboardRounded, EventSeat,
    Favorite,
    LocalMall, Panorama, RateReview, RateReviewTwoTone,
    Restaurant,
    RestaurantMenu,
    Settings,
    Shop,
    ShoppingCart, StoreMallDirectory
} from "@material-ui/icons";
import {LogOut, User, Users} from "react-feather";
import {userActions} from "../../../store/actions/user";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {removeFoodoli, removeState, removeToken} from "../../../common/localStorage";

function TabPanel(props) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3} justifyContent={'flex-start'}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        //height: 224,
    },
    tabs: {
        //borderBottom: `1px solid ${theme.palette.divider}`,
    },
}));

class DashboardView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabIndex: 0,
            logoutDialog: false,
        }
    }

    componentDidMount() {
        let tabIndex = 0
        switch (window.location.pathname) {
            case '/dashboard/customer/my-reservation':
            case '/dashboard/owner/dashboard':
            case '/dashboard/admin/user-activation':
                tabIndex = 0;
                break;
            case '/dashboard/customer/my-orders':
            case '/dashboard/owner/reservations':
            case '/dashboard/admin/owner-activation':
                tabIndex = 1;
                break;
            case '/dashboard/customer/my-favourite':
            case '/dashboard/owner/restaurant-profile':
            case '/dashboard/admin/reservations':
                tabIndex = 2;
                break;
            case '/dashboard/customer/my-profile':
            case '/dashboard/admin/my-profile':
            case '/dashboard/owner/logo-banner':
                tabIndex = 3;
                break;
            case '/dashboard/owner/specials':
            case '/dashboard/admin/settings':
                tabIndex = 4;
                break;
            case '/dashboard/owner/menus':
                tabIndex = 5;
                break;
            case '/dashboard/owner/my-profile':
                tabIndex = 7;
                break;
            case '/dashboard/customer/settings':
            case '/dashboard/owner/settings':
                tabIndex = 4;
                break;
        }
        this.setState({tabIndex: tabIndex})
    }

    handleOpenLogoutDialog = () => {
        this.setState({
            logoutDialog: true
        })
    };

    handleCloseLogoutDialog = () => {
        this.setState({
            logoutDialog: false
        })
    };

    logout = () => {
        const {
            navigate,
            resetUser
        } = this.props;
        navigate('/');
        resetUser();
        removeToken();
        removeFoodoli();
        removeState();
        this.handleCloseLogoutDialog();
    }

    handleChange = (event, newValue) => {
        if(!event.target.innerText) return;
        console.log(event.target.innerText)
        const {navigate} = this.props;
        switch (event.target.innerText) {
            case 'MY RESERVATION':
                navigate('/dashboard/customer/my-reservation');
                break;
            case 'MY ORDERS':
                navigate('/dashboard/customer/my-orders');
                break;
            case 'MY FAVOURITE':
                navigate('/dashboard/customer/my-favourite');
                break;
            case 'MY PROFILE':
                if (this.props.type === '3')
                    navigate('/dashboard/customer/my-profile');
                else if (this.props.type === '2')
                    navigate('/dashboard/owner/my-profile');
                else if (this.props.type === '1')
                    navigate('/dashboard/admin/my-profile');
                break;
            case 'SETTINGS':
                if (this.props.type === '3')
                    navigate('/dashboard/customer/settings');
                else if (this.props.type === '2')
                    navigate('/dashboard/owner/settings');
                else if (this.props.type === '1')
                    navigate('/dashboard/admin/settings');
                break;
            case 'DASHBOARD':
                navigate('/dashboard/owner/dashboard');
                break;
            case 'RESERVATIONS':
                if(this.props.type === '1')
                    navigate('/dashboard/admin/reservations');
                else if(this.props.type === '2')
                    navigate('/dashboard/owner/reservations/todays');
                break;
            case 'RESTAURANT PROFILE':
                navigate('/dashboard/owner/restaurant-profile');
                break;
            case 'LOGO & BANNER':
                navigate('/dashboard/owner/logo-banner');
                break;
            case 'SPECIALS':
                navigate('/dashboard/owner/specials');
                break;
            case 'MENUS':
                navigate('/dashboard/owner/menus');
                break;
            case 'REVIEWS':
                navigate('/dashboard/owner/reviews');
                break;
            case 'REVIEW IMAGES':
                navigate('/dashboard/owner/review-images');
                break;
            case 'USER ACTIVATION':
                navigate('/dashboard/admin/user-activation');
                break;
            case 'OWNER ACTIVATION':
                navigate('/dashboard/admin/owner-activation');
                break;
            case 'LOGOUT':
                this.handleOpenLogoutDialog()
                break;
            default:
                if (this.props.type === '3')
                    navigate('/dashboard/customer/my-reservation');
                else if (this.props.type === '2')
                    navigate('/dashboard/owner/dashboard');
                //window.location.reload();
                break;
        }
        if(event.target.innerText) this.setState({tabIndex: newValue});
        else this.setState({tabIndex: 0});
    };

    render() {
        const {classes} = this.props;
        const {tabIndex, logoutDialog} = this.state;

        const adminPanels = [
            {label: 'User Activation', icon: <Users/>},
            {label: 'Owner Activation', icon: <LocalMall/>},
            {label: 'Reservations', icon: <EventSeat/>},
            {label: 'My Profile', icon: <User/>},
            {label: 'Settings', icon: <Settings/>},
            {label: 'Logout', icon: <LogOut/>},
        ];

        const customerPanels = [
            {label: 'My Reservation', icon: <ShoppingCart/>},
            {label: 'My Orders', icon: <LocalMall/>},
            {label: 'My Favourite', icon: <Favorite/>},
            {label: 'My Profile', icon: <User/>},
            {label: 'Settings', icon: <Settings/>},
            {label: 'Logout', icon: <LogOut/>},
        ];

        const ownerPanels = [
            {label: 'Dashboard', icon: <DashboardRounded/>},
            {label: 'Reservations', icon: <EventSeat/>},
            {label: 'Restaurant Profile', icon: <StoreMallDirectory/>},
            {label: 'Logo & Banner', icon: <Panorama/>},
            {label: 'Specials', icon: <Restaurant/>},
            {label: 'Menus', icon: <RestaurantMenu/>},
            {label: 'Reviews', icon: <RateReview/>},
            {label: 'Review Images', icon: <RateReviewTwoTone/>},
            {label: 'My Profile', icon: <User/>},
            {label: 'Settings', icon: <Settings/>},
            {label: 'Logout', icon: <LogOut/>},
        ]

        return (
            <Page title={'Foodoli | Dashboard'} className={classes.root}>
                <Header/>
                <Container component="main" maxWidth={false} style={{paddingTop: 90, paddingBottom: 30,}}>
                    <div>
                        <Grid container>
                            <Grid item xs={12} sm={2}>
                                <Tabs
                                    orientation="vertical"
                                    variant="scrollable"
                                    value={tabIndex}
                                    onChange={this.handleChange}
                                    aria-label="Vertical tabs example"
                                    className={classes.tabs}
                                >
                                    {
                                        this.props.type === '3' && customerPanels.map((panel, index) => (
                                                <Tab key={panel.label} label={panel.label} {...a11yProps(index)} icon={panel.icon}/>
                                            )
                                        )
                                    }
                                    {
                                        this.props.type === '2' && ownerPanels.map((panel, index) => (
                                                <Tab key={panel.label} label={panel.label} {...a11yProps(index)} icon={panel.icon}/>
                                            )
                                        )
                                    }
                                    {
                                        this.props.type === '1' && adminPanels.map((panel, index) => (
                                                <Tab key={panel.label} label={panel.label} {...a11yProps(index)} icon={panel.icon}/>
                                            )
                                        )
                                    }
                                </Tabs>
                            </Grid>
                            <Grid item xs={12} sm={10} style={{borderLeft: `1px solid #eaeaea`,}}>
                                <Outlet/>
                                {/*<TabPanel value={tabIndex} index={0}>
                                    Item One
                                </TabPanel>*/}
                            </Grid>
                        </Grid>
                    </div>
                    <Dialog
                        open={logoutDialog}
                        onClose={this.handleCloseLogoutDialog}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">{"Want to exit from app?"}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Do you want to logout from Foodoli.com
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleCloseLogoutDialog} color="secondary">Cancel</Button>
                            <Button onClick={this.logout} color="secondary" autoFocus>Logout</Button>
                        </DialogActions>
                    </Dialog>
                </Container>
            </Page>
        )
    }
}

function mapStateToProps(state) {
    return {
        isLoggedIn: state.user.isLoggedIn,
        type: state.user?.user?.type
    };
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        resetUser: userActions.resetUser
    }, dispatch);
}

const Dashboard = function (props) {
    const navigate = useNavigate();
    const classes = useStyles();
    return <DashboardView {...props} classes={classes} navigate={navigate}/>;
}

//const Dashboard = connect(mapStateToProps, matchDispatchToProps)(withStyles(styles, {withTheme: true})(DashboardView));
//export default compose(connect(mapStateToProps, matchDispatchToProps), withStyles(useStyles, {withTheme: true}))(Dashboard);
export default connect(mapStateToProps, matchDispatchToProps)(Dashboard);
