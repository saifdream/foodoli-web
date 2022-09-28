import React from "react";
import {
    Box,
    Button, ClickAwayListener,
    Grow,
    makeStyles, MenuItem,
    MenuList,
    Paper, Popper,
} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import Avatar from "@material-ui/core/Avatar";
import {IMAGE_URL} from "../constant";
import {ArrowDropDown, DashboardRounded, EventSeat, ExitToApp, Settings, ShoppingCart} from "@material-ui/icons";
import {User} from "react-feather";
import {useNavigate} from "react-router";
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

const TopProfile = () => {
    const classes = useStyles();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);

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
                navigate('/dashboard/admin/reservations');
                break;
            case "My Dashboard":
                navigate('/dashboard/owner/dashboard');
                break;
            case "Reservation":
                if(user?.user?.type === '1')
                    navigate('/dashboard/admin/reservations');
                else if(user?.user?.type === '2')
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

    const logout = () => {
        //navigate('/logout');
        dispatch(userActions.resetUser());
        removeToken();
        removeFoodoli();
        removeState();
        setTimeout(() => window.location.reload(true), 0);
    }

    return (
        <Box style={{width: '200px', position: 'absolute', top: 10, right: 5}}>
            <Button
                ref={anchorRef}
                aria-controls={openToggle ? 'menu-list-grow' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
                style={{textTransform: 'capitalize', color: '#fff', fontSize: 16}}
            >
                <Avatar
                    alt={`${user?.user?.first_name} ${user?.user?.last_name}`}
                    src={`${IMAGE_URL}users/${user?.user?.profile_pic}`}
                />
                &nbsp; {`${user?.user?.first_name} ${user?.user?.last_name}`}
                <ArrowDropDown/>
            </Button>
            <Popper open={openToggle} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                {({TransitionProps, placement}) => (
                    <Grow
                        {...TransitionProps}
                        style={{transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom'}}
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
                                                <MenuItem onClick={handleToggleClose}><EventSeat/> &nbsp; Reservation</MenuItem>
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
    )
}

export default TopProfile;
