import React, {memo, useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Page from "../../../../components/Page";
import Box from "@material-ui/core/Box";
import {
    Card,
    CardActions,
    CardContent,
    Button,
    Typography,
    Grid,
    ButtonGroup,
    IconButton,
    TextField,
    LinearProgress
} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {
    clearSpecialFromBag,
    removeSpecialFromBag,
    updateSpecialToBag,
    decreaseSpecialFromBag
} from "../../../../store/actions/reservation";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import {IMAGE_URL, API, getHttpErrorMessage} from "../../../../constant";
import {authFormHeader} from "../../../../_helpers/auth-header";
import {Add, Remove} from '@material-ui/icons';
import {Trash} from 'react-feather';
import Toast from "../../../../components/Toast";
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@material-ui/core';
import fetch from 'cross-fetch';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    reservationCard: {
        minWidth: 300,
        maxWidth: 300,
        margin: theme.spacing(1)
    },
    itemsCard: {
        minWidth: 500,
        maxWidth: 500,
        margin: theme.spacing(1)
    },
    reservationTitle: {
        fontSize: 24,
        fontWeight: 'bolder'
    },
    reservationPos: {
        //marginBottom: 12,
        fontSize: 16,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    restaurantCard: {
        minWidth: 300,
        maxWidth: 300,
        //textAlign: 'justify',
        margin: theme.spacing(1),
    },
    restaurantTitle: {
        fontSize: 24,
        fontWeight: 'bolder'
    },
    restaurantPos: {
        marginBottom: 12,
        fontSize: 16,
    },
    inline: {
        display: 'inline',
    },
    removeIcon: {
        right: 0,
        top: 0,
        position: 'absolute',
        color: 'red',
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        //width: 50,
    },
}));

const MyReservation = memo(
    () => {
        let placeOrderTimer = null;
        const classes = useStyles();
        const [totalPrice, setTotalPrice] = useState(0);
        const [totalQty, setTotalQty] = useState(0);
        const [time, setTime] = useState('08:30');
        const [values, setValues] = useState({
            message: '',
            type: 'error',
            open: false,
            isLoading: false,
            cancelDialog: false
        });
        const {addedItems} = useSelector(state => state.reservations);
        const {user} = useSelector(state => state.user);
        const dispatch = useDispatch();

        const restaurant = addedItems ? addedItems[0] : null;

        //const bull = <span className={classes.bullet}>•</span>;

        const handleClose = (event, reason) => {
            if (reason === 'clickaway') {
                return;
            }
            setValues({...values, open: false});
        };

        const calculate = () => {
            const accumulatedTotals = addedItems.reduce(
                (totals, p) => {
                    if(p?.discount > 0)
                        return {...totals, price: totals['price'] + ((p.price - p.price * p.discount/100) * p.qty), qty: totals['qty'] + p.qty}
                    else
                        return {...totals, price: totals['price'] + (p.price * p.qty), qty: totals['qty'] + p.qty}
                }, {price: 0, qty: 0}
            );
            setTotalPrice(accumulatedTotals?.price);
            setTotalQty(accumulatedTotals?.qty);
        }

        useEffect(() => {
            if (addedItems && addedItems?.length) {
                setTimeout(() => calculate(), 300);
            }
        }, [addedItems])

        const placeOrder = () => {
            if (!time) {
                setValues({
                    ...values,
                    open: true,
                    message: "Please give pickup/dine time.",
                    type: 'warning'
                });
                return
            }
            placeOrderTimer = setTimeout(() => {
                setValues({...values, isLoading: true});
                let formData = new FormData();
                formData.append('user_id', user?.id);
                formData.append('rest_id', restaurant?.rest_id);
                formData.append('approximate_time', `${time}:00`);
                formData.append('item_list', JSON.stringify(addedItems));

                const requestOptions = {
                    method: 'POST',
                    headers: authFormHeader(),
                    body: formData,
                };

                fetch(`${API}special/reservation`, requestOptions).then((response) => {
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
                                message: data?.message || 'Reserve successfully !',
                                type: 'success'
                            });
                            setTimeout(() => dispatch(clearSpecialFromBag()), 2000)
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
                    setValues({...values, isLoading: false});
                });
            })
        }

        const handleCloseCancelDialog = () => {
            setValues({...values, cancelDialog: false});
        };

        const cancel = () => {
            setValues({...values, cancelDialog: false});
            setTimeout(() => dispatch(clearSpecialFromBag()), 300)
        }

        if (addedItems && addedItems?.length === 0)
            return (
                <Box display="flex" justifyContent="center" mt={2}>
                    <Typography variant="h4" style={{textAlign: 'center'}}>No Reservations</Typography>
                </Box>
            )

        return (
            <Page title="Foodoli | My Reservation">
                <Box m={2}>
                    <Toast isOpen={values.open} message={values.message} type={values.type} onClose={handleClose}/>
                    {
                        addedItems && addedItems?.length ? (
                                <Box className={classes.root} justifyContent="flex-start" alignItems="flex-start">
                                    <Grid container>
                                        <Grid item xs={12} sm={4}>
                                            <Card className={classes.restaurantCard} variant="outlined">
                                                <CardContent>
                                                    <Typography className={classes.restaurantTitle} color="textSecondary"
                                                                gutterBottom>
                                                        {restaurant?.name}
                                                    </Typography>
                                                    <Typography className={classes.restaurantPos}>
                                                        {restaurant?.address}
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                            <Card className={classes.reservationCard} variant="outlined">
                                                {values.isLoading && <LinearProgress color="secondary"/>}
                                                <CardContent>
                                                    <Typography className={classes.reservationTitle} color="textSecondary"
                                                                gutterBottom>
                                                        My Reservation
                                                    </Typography>
                                                    <Typography className={classes.reservationPos}>
                                                        Food Quantity: {totalQty}
                                                    </Typography>
                                                    <Typography className={classes.reservationPos}>
                                                        Sub Total: {totalPrice.toFixed(2)}
                                                    </Typography>
                                                    <Box display="flex">
                                                        <Typography className={classes.reservationPos}
                                                                    style={{marginTop: '2px'}}>
                                                            Pickup/Dine time:
                                                        </Typography>
                                                        <TextField
                                                            id="time"
                                                            //label="Alarm clock"
                                                            type="time"
                                                            defaultValue="08:30"
                                                            className={classes.textField}
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                            onChange={(e) => setTime(e.target.value)}
                                                            inputProps={{
                                                                step: 300, // 5 min
                                                            }}
                                                        />
                                                    </Box>
                                                </CardContent>
                                                <CardActions style={{justifyContent: 'center'}}>
                                                    <Button
                                                        size="large"
                                                        color="secondary"
                                                        variant="outlined"
                                                        onClick={placeOrder}
                                                        disabled={values.isLoading}
                                                    >
                                                        Place Order
                                                    </Button>
                                                    <Button
                                                        size="large"
                                                        style={{color: 'red'}}
                                                        variant="outlined"
                                                        onClick={() => setValues({...values, cancelDialog: true})}
                                                        disabled={values.isLoading}
                                                    >
                                                        Cancel
                                                    </Button>
                                                </CardActions>
                                            </Card>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Card className={classes.itemsCard} variant="outlined">
                                                <List>
                                                    {
                                                        addedItems.map((item) => (
                                                            <React.Fragment key={item?.id}>
                                                                <ListItem alignItems="flex-start">
                                                                    <IconButton
                                                                        onClick={() => {
                                                                            dispatch(removeSpecialFromBag(item?.id));
                                                                            setTimeout(() => calculate(), 300);
                                                                        }}
                                                                        aria-label={`info about ${item.title}`}
                                                                        className={classes.removeIcon}
                                                                    >
                                                                        <Trash/>
                                                                    </IconButton>
                                                                    <ListItemAvatar>
                                                                        {/*  <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" /> */}
                                                                        <img
                                                                            style={{
                                                                                width: 100,
                                                                                backgroundColor: '#f2f7f4',
                                                                                marginRight: 15
                                                                            }}
                                                                            src={item?.image ? `${IMAGE_URL}specials/${item?.image}` : '/static/images/green-logo-400x300.png'}
                                                                            alt={item?.title}
                                                                        />
                                                                    </ListItemAvatar>
                                                                    <ListItemText
                                                                        primary={
                                                                            <Typography
                                                                                variant="h4"
                                                                                color="textSecondary"
                                                                            >
                                                                                {item?.title}
                                                                            </Typography>
                                                                        }
                                                                        secondary={
                                                                            <React.Fragment>
                                                                                <Typography
                                                                                    component="span"
                                                                                    variant="h5"
                                                                                    className={classes.inline}
                                                                                    color="textPrimary"
                                                                                >
                                                                                    $ {
                                                                                        item?.discount > 0 ?
                                                                                            (item?.price - item?.price * item?.discount / 100) :
                                                                                            item?.price
                                                                                    }&nbsp;
                                                                                    * {item?.qty}&nbsp;
                                                                                    = $ {
                                                                                        ((item?.discount > 0 ?
                                                                                            (item?.price - item?.price * item?.discount / 100) :
                                                                                            item?.price) * item?.qty).toFixed(2)
                                                                                    }
                                                                                </Typography>
                                                                                <br/>
                                                                                <Typography
                                                                                    component="span"
                                                                                    variant="h6"
                                                                                    className={classes.inline}
                                                                                    color="textPrimary"
                                                                                >
                                                                                    Quantity: {item?.qty}
                                                                                </Typography>
                                                                                <ButtonGroup size="small" color="secondary"
                                                                                             style={{float: 'right'}}
                                                                                             aria-label="large outlined primary button group">
                                                                                    <Button onClick={() => {
                                                                                        if (item?.qty === 1)
                                                                                            //dispatch(removeSpecialFromBag(item?.id))
                                                                                            setValues({
                                                                                                ...values,
                                                                                                open: true,
                                                                                                message: 'Quantity can\'t be zero.',
                                                                                                type: 'warning'
                                                                                            });
                                                                                        else {
                                                                                            dispatch(decreaseSpecialFromBag(item));
                                                                                            setTimeout(() => calculate(), 300);
                                                                                        }
                                                                                    }}
                                                                                    >
                                                                                        <Remove style={{color: 'red'}}/>
                                                                                    </Button>
                                                                                    <Button onClick={() => {
                                                                                        dispatch(updateSpecialToBag(item));
                                                                                        setTimeout(() => calculate(), 300);
                                                                                    }}
                                                                                    >
                                                                                        <Add/>
                                                                                    </Button>
                                                                                </ButtonGroup>
                                                                            </React.Fragment>
                                                                        }
                                                                    />
                                                                </ListItem>
                                                                <Divider variant="inset" component="li"/>
                                                            </React.Fragment>
                                                        ))
                                                    }
                                                </List>
                                            </Card>
                                        </Grid>
                                    </Grid>
                                </Box>
                            )
                            :
                            <Typography variant="h4" style={{textAlign: 'center'}}>No Reservations</Typography>
                    }
                </Box>
                <Dialog
                    open={values.cancelDialog}
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
                        < Button onClick={cancel} color="secondary" autoFocus>
                            Yes
                        </Button>
                    </DialogActions>
                </Dialog>
            </Page>
        )
    }
)

export default MyReservation;
