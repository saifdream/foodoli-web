import React, {memo} from "react";
import {
    AppBar,
    Box,
    Button, ClickAwayListener,
    Dialog,
    DialogContent,
    Grow,
    makeStyles, MenuItem,
    MenuList,
    Paper, Popper,
    Toolbar
} from "@material-ui/core";
import LogoBlack from "../components/LogoBlack";
import {Link as RouterLink} from "react-router-dom";
import Find from "../views/search/Find";
import LoginView from "../views/auth/Login";
import {useDispatch, useSelector} from "react-redux";
import Avatar from "@material-ui/core/Avatar";
import {IMAGE_URL} from "../constant";
import {ArrowDropDown, DashboardRounded, EventSeat, ExitToApp, Settings, ShoppingCart} from "@material-ui/icons";
import {User} from "react-feather";
import {useNavigate} from "react-router";
import SignUpView from "../views/auth/Signup";
import {userActions} from "../store/actions/user";
import {removeFoodoli, removeState, removeToken} from "../common/localStorage";

const useStyles = makeStyles((theme) => ({
    root: {
        //marginBottom: 50
        borderBottom: '1px solid #eaeaea',
        padding: '5px 10px'
    },
    icon: {
        marginRight: theme.spacing(2),
    },
}));

const Header = memo(
    () => {
        const classes = useStyles();
        const navigate = useNavigate();
        const dispatch = useDispatch();
        const user = useSelector(state => state.user);
        const [openSignIn, setOpenSignIn] = React.useState(false);
        const [openSignUp, setOpenSignUp] = React.useState(false);

        const [openToggle, setOpenToggle] = React.useState(false);
        const anchorRef = React.useRef(null);

        const handleToggle = () => {
            setOpenToggle((prevOpen) => !prevOpen);
        };

        const handleToggleClose = (event) => {
            if (anchorRef.current && anchorRef.current.contains(event.target)) {
                return;
            }
            setOpenToggle(false);
            switch (event.target.textContent.trim()) {
                case "My Reservation":
                    navigate('/dashboard/customer/my-reservation');
                    break;
                case "Owner Activation":
                    navigate('/dashboard/admin/owner-activation');
                    break;
                case "User Activation":
                    navigate('/dashboard/admin/user-activation');
                    break;
                case "Reservations":
                    if(user?.user?.type === '1')
                        navigate('/dashboard/admin/reservations');
                    else if(user?.user?.type === '2')
                        navigate('/dashboard/owner/reservations/todays');
                    break;
                case "My Dashboard":
                    navigate('/dashboard/owner/dashboard');
                    break;
                case "Reservation":
                    navigate('/dashboard/owner/reservations/todays');
                    break;
                case "My Profile":
                    if(user?.user?.type === '3')
                        navigate('/dashboard/customer/my-profile');
                    else if(user?.user?.type === '2')
                        navigate('/dashboard/owner/my-profile');
                    else if(user?.user?.type === '1')
                        navigate('/dashboard/admin/my-profile');
                    break;
                case "Account Settings":
                    if(user?.user?.type === '3')
                        navigate('/dashboard/customer/settings');
                    else if(user?.user?.type === '2')
                        navigate('/dashboard/owner/settings');
                    else if(user?.user?.type === '1')
                        navigate('/dashboard/admin/settings');
                    break;
                case "Logout":
                    break;
            }
        };

        function handleListKeyDown(event) {
            if (event.key === 'Tab') {
                event.preventDefault();
                setOpenToggle(false);
            }
        }

        // return focus to the button when we transitioned from !openSignIn -> openSignIn
        const prevOpen = React.useRef(openToggle);
        React.useEffect(() => {
            if (prevOpen.current === true && openToggle === false) {
                anchorRef.current.focus();
            }

            prevOpen.current = openToggle;
        }, [openToggle]);

        const handleOpenSignInDialog = () => {
            setOpenSignIn(true);
        };

        const handleCloseSignInDialog = () => {
            setOpenSignIn(false);
        };

        const handleOpenSignUpDialog = () => {
            setOpenSignUp(true);
        };

        const handleCloseSignUpDialog = () => {
            setOpenSignUp(false);
        };

        const logout = () => {
            //navigate('/logout');
            dispatch(userActions.resetUser());
            removeToken();
            removeFoodoli();
            removeState();
            setTimeout(() => window.location.reload(true), 0);
        }

        return (
            <AppBar
                position="fixed"
                className={classes.root}
                elevation={0}
            >
                <Toolbar>
                    <Box style={{padding: 10}}>
                        <RouterLink to="/">
                            <LogoBlack/>
                        </RouterLink>
                    </Box>
                    {
                        (user?.user?.type !== '2' && user?.user?.type !== '1') && (
                            <Box>
                                <Find/>
                            </Box>
                        )
                    }

                    <Box flexGrow={1}/>
                    {
                        user?.isLoggedIn ?
                            (
                                <React.Fragment>
                                    <Box>
                                        <Button
                                            ref={anchorRef}
                                            aria-controls={openToggle ? 'menu-list-grow' : undefined}
                                            aria-haspopup="true"
                                            onClick={handleToggle}
                                            style={{textTransform: 'capitalize', fontSize: 16}}
                                        >
                                            <Avatar
                                                alt={`${user?.user?.first_name} ${user?.user?.last_name}`}
                                                src={`${IMAGE_URL}users/${user?.user?.profile_pic}`}
                                            />
                                            &nbsp;{` ${user?.user?.first_name} ${user?.user?.last_name}`}
                                            <ArrowDropDown/>
                                        </Button>
                                        <Popper open={openToggle} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                                            {({ TransitionProps, placement }) => (
                                                <Grow
                                                    {...TransitionProps}
                                                    style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                                                >
                                                    <Paper>
                                                        <ClickAwayListener onClickAway={handleToggleClose}>
                                                            <MenuList autoFocusItem={openToggle} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                                                                {
                                                                    user?.user?.type === '3' && (
                                                                        <MenuItem onClick={handleToggleClose}><ShoppingCart/> &nbsp; My Reservation</MenuItem>
                                                                    )
                                                                }
                                                                {
                                                                    user?.user?.type === '2' && (
                                                                        <>
                                                                            <MenuItem onClick={handleToggleClose}><DashboardRounded/> &nbsp; My Dashboard</MenuItem>
                                                                            <MenuItem onClick={handleToggleClose}><EventSeat/> &nbsp; Reservation</MenuItem>
                                                                        </>
                                                                    )
                                                                }
                                                                {
                                                                    user?.user?.type === '1' && (
                                                                        <>
                                                                            <MenuItem onClick={handleToggleClose}><DashboardRounded/> &nbsp; Owner Activation</MenuItem>
                                                                            <MenuItem onClick={handleToggleClose}><User/> &nbsp; User Activation</MenuItem>
                                                                            <MenuItem onClick={handleToggleClose}><EventSeat/> &nbsp; Reservations</MenuItem>
                                                                        </>
                                                                    )
                                                                }
                                                                <MenuItem onClick={handleToggleClose}><User/> &nbsp; My Profile</MenuItem>
                                                                <MenuItem onClick={handleToggleClose}><Settings/> &nbsp; Account Settings</MenuItem>
                                                                <MenuItem onClick={logout}><ExitToApp/> &nbsp; Logout</MenuItem>
                                                            </MenuList>
                                                        </ClickAwayListener>
                                                    </Paper>
                                                </Grow>
                                            )}
                                        </Popper>
                                    </Box>
                                </React.Fragment>
                            )
                                :
                            (
                                <React.Fragment>
                                    <Box>
                                        <Button onClick={handleOpenSignInDialog}>Sign In</Button>
                                    </Box>
                                    <Box style={{borderRight: '1px solid #000000', margin: '5px'}}>&nbsp;</Box>
                                    <Box><Button onClick={handleOpenSignUpDialog}>Sign Up</Button></Box>
                                </React.Fragment>
                            )
                    }
                </Toolbar>

                <Dialog open={openSignIn} onClose={handleCloseSignInDialog} aria-labelledby="form-dialog-title" disableBackdropClick disableEscapeKeyDown>
                    {/*<DialogTitle id="form-dialog-title">
                        <Button onClick={handleOpenSignInDialog}>Sign In</Button>
                    </DialogTitle>*/}
                    <DialogContent>
                        <LoginView handleCloseSignInDialog={handleCloseSignInDialog} openSignIn={() => {handleCloseSignInDialog(); handleOpenSignUpDialog();}}/>
                    </DialogContent>
                </Dialog>

                <Dialog open={openSignUp} onClose={handleCloseSignUpDialog} aria-labelledby="form-dialog-title" disableBackdropClick disableEscapeKeyDown>
                    {/*<DialogTitle id="form-dialog-title">
                        <Button onClick={handleOpenSignInDialog}>Sign In</Button>
                    </DialogTitle>*/}
                    <DialogContent>
                        <SignUpView handleCloseSignUpDialog={handleCloseSignUpDialog}/>
                    </DialogContent>
                </Dialog>
            </AppBar>
        )
    }
)

export default Header;
