import React, {memo, useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Page from "../../../../components/Page";
import {
    Button,
    Typography,
    IconButton,
    LinearProgress,
    Chip,
    AppBar,
    Tab,
    Divider,
    CircularProgress
} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {API, getHttpErrorMessage} from "../../../../constant";
import {authHeader} from "../../../../_helpers/auth-header";
import Toast from "../../../../components/Toast";
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@material-ui/core';
import {getReservationList, getPaginatedReservationList} from "../../../../store/actions/reservation";
import PropTypes from 'prop-types';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Collapse
} from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Tabs from "@material-ui/core/Tabs";
import {green} from "@material-ui/core/colors";
import fetch from 'cross-fetch';

const useRowStyles = makeStyles({
    root: {
        '& > *': {
            borderBottom: 'unset',
        },
    },
    buttonProgress: {
        color: green[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
});

function createData(order_id, rest_name, created_at, approximate_time, total, status) {
    return {order_id, rest_name, created_at, approximate_time, total, status};
}

function PreviousRow(props) {
    const {row} = props;
    const [open, setOpen] = React.useState(false);
    const [isLoading, setLoading] = React.useState(false);
    const [orderItems, setOrderItems] = React.useState([]);
    const classes = useRowStyles();

    const getOrderItems = async () => {
        setOpen(!open)
        if (!open) {
            setLoading(true);
            const requestOptions = {
                method: 'GET',
                headers: authHeader(),
            };

            fetch(`${API}get_orderitem/${row.order_id}`, requestOptions).then((response) => {
                //console.log(response)
                response.text().then(res => {
                    let data = "";
                    try {
                        data = res && JSON.parse(res);
                    } catch (e) {
                        console.log(getHttpErrorMessage(response, e))
                        return;
                    }

                    if (!response.ok) {
                        if (response.status === 401) {
                            console.log(getHttpErrorMessage(response))
                            return;
                        }

                        const error = data?.error || data?.message || getHttpErrorMessage(response);
                        console.log(error);
                        return;
                    }

                    //console.log(data)
                    setOrderItems(data || []);
                });
            }).catch((err) => {
                console.log(err)
            }).finally(() => {
                setLoading(false);
            });
        }
    }

    return (
        <React.Fragment>
            <TableRow className={classes.root}>
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => getOrderItems()}>
                        {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">{row.rest_name}</TableCell>
                <TableCell align="center">{row.created_at}</TableCell>
                <TableCell align="center">{row.approximate_time}</TableCell>
                <TableCell align="center">{row.total}</TableCell>
                <TableCell align="center">
                    {
                        row.status == 0 ? <Chip label="Cancelled" style={{backgroundColor: '#cc3300', color: 'white', fontWeight: 'bolder'}}/>
                            :
                            (
                                row.status == 1 ?
                                    <Chip label="Pending"/>
                                    :
                                    <Chip label="Confirmed" style={{backgroundColor: '#339966', color: 'white', fontWeight: 'bolder'}}/>
                            )
                    }
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={6}>
                    {isLoading && <LinearProgress color="secondary"/>}
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            <Typography variant="h6" gutterBottom component="div">
                                Order Items
                            </Typography>
                            <Table aria-label="orders">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Special</TableCell>
                                        <TableCell align="right">Quantity</TableCell>
                                        <TableCell align="right">Price ($)</TableCell>
                                        <TableCell align="right">Total price ($)</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {orderItems.map((itemRow) => (
                                        <TableRow key={itemRow.date}>
                                            <TableCell component="th"
                                                       scope="row">{itemRow?.title} ({itemRow?.code})</TableCell>
                                            <TableCell align="right">{itemRow?.qty}</TableCell>
                                            <TableCell align="right">{itemRow?.price}</TableCell>
                                            <TableCell align="right">{itemRow?.qty * itemRow.price}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

function TodaysRow(props) {
    let reservationTimer = null;
    const {row} = props;
    const [open, setOpen] = React.useState(false);
    const [isLoading, setLoading] = React.useState(false);
    const [cancelDialog, setCancelDialog] = React.useState(false);
    const [orderItems, setOrderItems] = React.useState([]);
    const classes = useRowStyles();
    const [values, setValues] = useState({
        message: '',
        type: 'error',
        open: false,
        isCancelLoading: false,
        isConfirmLoading: false,
    });
    const {user} = useSelector(state => state.user);
    const dispatch = useDispatch();

    const cancelReservation = () => {
        setValues({...values, isCancelLoading: true});
        setCancelDialog(false);
        reservationTimer = setTimeout(() => {
            const requestOptions = {
                method: 'GET',
                headers: authHeader(),
            };

            fetch(`${API}special/reservation_cancel/${row.order_id}`, requestOptions).then((response) => {
                //console.log(response)
                setTimeout(() => console.log(values), 100)
                response.text().then(res => {
                    let data = "";
                    try {
                        data = res && JSON.parse(res);
                    } catch (e) {
                        setValues({
                            ...values,
                            open: true,
                            message: getHttpErrorMessage(response, e),
                            type: 'error'
                        });
                        return;
                    }

                    if (!response.ok) {
                        if (response.status === 401) {
                            setValues({
                                ...values,
                                open: true,
                                message: getHttpErrorMessage(response),
                                type: 'error'
                            });
                            return;
                        }

                        const error = data?.error || data?.message || getHttpErrorMessage(response);
                        //console.log(error);
                        setValues({...values, open: true, message: error, type: 'error'});
                        return;
                    }

                    //console.log(data)
                    if (data?.success) {
                        setValues({
                            ...values,
                            open: true,
                            message: data?.message || 'Reservation cancel successfully !',
                            type: 'success'
                        });
                        dispatch(getReservationList(user?.id));
                    } else if (!data?.success)
                        setValues({
                            ...values,
                            open: true,
                            message: data?.message,
                            type: 'warning'
                        });
                });
            }).catch((err) => {
                console.log(err)
                setValues({...values, open: true, message: 'Please check your connectivity !', type: 'error'});
            }).finally(() => {
                setValues({...values, isCancelLoading: false});
                setTimeout(() => console.log(values), 1100)
            });
        }, 1000)
    };

    const confirmReservation = () => {
        reservationTimer = setTimeout(() => {
            setValues({...values, isConfirmLoading: true});
            const requestOptions = {
                method: 'GET',
                headers: authHeader(),
            };

            fetch(`${API}special/reservation_confirm/${row.order_id}`, requestOptions).then((response) => {
                //console.log(response)
                response.text().then(res => {
                    let data = "";
                    try {
                        data = res && JSON.parse(res);
                    } catch (e) {
                        setValues({
                            ...values,
                            open: true,
                            message: getHttpErrorMessage(response, e),
                            type: 'error'
                        });
                        return;
                    }

                    if (!response.ok) {
                        if (response.status === 401) {
                            setValues({
                                ...values,
                                open: true,
                                message: getHttpErrorMessage(response),
                                type: 'error'
                            });
                            return;
                        }

                        const error = data?.error || data?.message || getHttpErrorMessage(response);
                        //console.log(error);
                        setValues({...values, open: true, message: error, type: 'error'});
                        return;
                    }

                    //console.log(data)
                    if (data?.success) {
                        setValues({
                            ...values,
                            open: true,
                            message: data?.message || 'Reservation confirm successfully !',
                            type: 'success'
                        });
                        dispatch(getReservationList(user?.id));
                    } else if (!data?.success)
                        setValues({
                            ...values,
                            open: true,
                            message: data?.message,
                            type: 'warning'
                        });
                });
            }).catch((err) => {
                console.log(err)
                setValues({...values, open: true, message: 'Please check your connectivity !', type: 'error'});
            }).finally(() => {
                setValues({...values, isConfirmLoading: false});
            });
        })
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setValues({...values, open: false});
    };

    const getOrderItems = async () => {
        setOpen(!open)
        if (!open) {
            setLoading(true);
            const requestOptions = {
                method: 'GET',
                headers: authHeader(),
            };

            fetch(`${API}get_orderitem/${row.order_id}`, requestOptions).then((response) => {
                //console.log(response)
                response.text().then(res => {
                    let data = "";
                    try {
                        data = res && JSON.parse(res);
                    } catch (e) {
                        console.log(getHttpErrorMessage(response, e))
                        return;
                    }

                    if (!response.ok) {
                        if (response.status === 401) {
                            console.log(getHttpErrorMessage(response))
                            return;
                        }

                        const error = data?.error || data?.message || getHttpErrorMessage(response);
                        console.log(error);
                        return;
                    }

                    //console.log(data)
                    setOrderItems(data || []);
                });
            }).catch((err) => {
                console.log(err)
            }).finally(() => {
                setLoading(false);
            });
        }
    }

    const handleCloseCancelDialog = () => {
        setCancelDialog(false)
    };

    return (
        <React.Fragment>
            <Toast isOpen={values.open} message={values.message} type={values.type} onClose={handleClose}/>
            <TableRow className={classes.root}>
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => {
                        getOrderItems()
                    }}>
                        {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">{row.rest_name}</TableCell>
                <TableCell align="center">{row.created_at}</TableCell>
                <TableCell align="center">{row.approximate_time}</TableCell>
                <TableCell align="center">{row.total}</TableCell>
                <TableCell align="center">
                    {
                        row.status == 0 ? <Chip label="Cancelled" style={{
                                backgroundColor: '#cc3300',
                                color: 'white',
                                fontWeight: 'bolder'
                            }}/>
                            :
                            (
                                row.status == 1 ?
                                    <Chip label="Pending"/>
                                    :
                                    <Chip label="Confirmed" style={{backgroundColor: '#339966', color: 'white', fontWeight: 'bolder'}}/>
                            )
                    }
                </TableCell>
                <TableCell align="center">
                    {
                        row?.status == 1 ? (
                                <>
                                    <Button onClick={confirmReservation} variant="contained" size="small"
                                            disabled={values.isConfirmLoading || values.isCancelLoading} color="secondary"
                                            style={{color: 'white', textTransform: 'capitalize'}}>
                                        Confirm
                                        {values.isConfirmLoading &&
                                        <CircularProgress size={24} className={classes.buttonProgress}/>}
                                    </Button>
                                    &nbsp;&nbsp;
                                    <Button
                                        onClick={() => setCancelDialog(true)}
                                        variant="contained" size="small"
                                        disabled={values.isConfirmLoading || values.isCancelLoading}
                                        style={{
                                            backgroundColor: (values.isConfirmLoading || values.isCancelLoading) ?
                                                '#dedede'
                                                :
                                                '#dc0404',
                                            color: 'white',
                                            textTransform: 'capitalize'
                                        }}
                                    >
                                        Cancel
                                        {values.isCancelLoading &&
                                        <CircularProgress size={24} className={classes.buttonProgress}/>}
                                    </Button>
                                </>
                            )
                            :
                            <Button variant="contained" disabled>{row.status == 2 ? 'Confirmed' : 'Cancelled'}</Button>
                    }
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={7}>
                    {isLoading && <LinearProgress color="secondary"/>}
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            <Typography variant="h6" gutterBottom component="div">
                                Order Items
                            </Typography>
                            <Table aria-label="orders">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Special</TableCell>
                                        <TableCell align="right">Quantity</TableCell>
                                        <TableCell align="right">Price ($)</TableCell>
                                        <TableCell align="right">Total price ($)</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {orderItems.map((itemRow) => (
                                        <TableRow key={itemRow.id}>
                                            <TableCell component="th"
                                                       scope="row">{itemRow?.title} ({itemRow?.code})</TableCell>
                                            <TableCell align="right">{itemRow?.qty}</TableCell>
                                            <TableCell align="right">{itemRow?.price}</TableCell>
                                            <TableCell align="right">{itemRow?.qty * itemRow.price}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
            <Dialog
                open={cancelDialog}
                onClose={handleCloseCancelDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Want to cancel Reservation?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Do you want to cancel this reservation?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    < Button onClick={handleCloseCancelDialog} color="secondary">
                        No
                    </Button>
                    < Button onClick={cancelReservation} color="secondary" autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
}));

function TabPanel(props) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
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
        id: `foodoli-tab-${index}`,
        'aria-controls': `foodoli-tabpanel-${index}`,
    };
}

const MyOrders = memo(
    () => {
        const classes = useStyles();
        const {user} = useSelector(state => state.user);
        const {reservationList, isLoading} = useSelector(state => state.reservations);
        const dispatch = useDispatch();

        const [value, setValue] = React.useState(0);

        const handleChange = (event, newValue) => {
            setValue(newValue);
        };

        useEffect(() => {
            if (user)
                dispatch(getReservationList(user?.id));
        }, [user]);

        const todaysRows = reservationList?.todays?.map((item) => createData(`${item?.id}`, `${item?.rest_name}`, `${item?.created_at}`, `${item?.approximate_time}`, `${item.total}`, `${item?.status}`)) || [];
        const previousRows = reservationList?.previous?.map((item) => createData(`${item?.id}`, `${item?.rest_name}`, `${item?.created_at}`, `${item?.approximate_time}`, `${item.total}`, `${item?.status}`)) || [];

        return (
            <Page title="Foodoli | My Orders">
                <Box m={2}>
                    <Typography variant="h4" style={{textAlign: 'center', marginBottom: 15}}>My Orders</Typography>
                    <Divider/>
                    { isLoading &&  <LinearProgress color="secondary"/> }
                    <Box className={classes.root}>
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            aria-label="orders tabs"
                            centered
                            //variant="fullWidth"
                        >
                            <Tab label="Today's" {...a11yProps(0)} />
                            <Tab label="Previous" {...a11yProps(1)} />
                        </Tabs>
                        <TabPanel value={value} index={0}>
                            {
                                todaysRows && todaysRows?.length ?
                                    <TableContainer component={Paper}>
                                        <Table aria-label="collapsible table">
                                            <TableHead>
                                                <TableRow style={{fontWeight: 'bolder'}}>
                                                    <TableCell/>
                                                    <TableCell>Restaurant</TableCell>
                                                    <TableCell align="center">Date</TableCell>
                                                    <TableCell align="center">Pick/Dine Time</TableCell>
                                                    <TableCell align="center">Total Amount ($)</TableCell>
                                                    <TableCell align="center">Status</TableCell>
                                                    <TableCell align="center">Actions</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {
                                                    todaysRows.map((row) => (
                                                        <TodaysRow key={row.id} row={row}/>
                                                    ))
                                                }
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    :
                                    <Box m={2} display="flex" justifyContent="center">
                                        <Typography>There is no special orders today.</Typography>
                                    </Box>
                            }
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            {
                                previousRows && previousRows?.length ?
                                    <TableContainer component={Paper}>
                                        <Table aria-label="collapsible table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell/>
                                                    <TableCell>Restaurant</TableCell>
                                                    <TableCell align="center">Date</TableCell>
                                                    <TableCell align="center">Pick/Dine Time</TableCell>
                                                    <TableCell align="center">Total Amount ($)</TableCell>
                                                    <TableCell align="center">Status</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {previousRows.map((row) => (
                                                    <PreviousRow key={row.id} row={row}/>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    :
                                    <Box m={2} display="flex" justifyContent="center">
                                        <Typography>There is no special orders.</Typography>
                                    </Box>
                            }
                        </TabPanel>
                    </Box>
                </Box>
            </Page>
        )
    }
)

export default MyOrders;
