import React, {memo} from "react";
import Page from "../../../../components/Page";
import {
    Box,
    Card,
    Grid,
    IconButton,
    LinearProgress,
    makeStyles,
    Typography
} from "@material-ui/core";
import fetch from 'cross-fetch';
import {useDispatch, useSelector} from "react-redux";
import {
    addSpecialToBag,
} from "../../../../store/actions/reservation";
import {authFormHeader} from "../../../../_helpers/auth-header";
import {API, getHttpErrorMessage, IMAGE_URL} from "../../../../constant";
import Toast from "../../../../components/Toast";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import {DollarSign, Trash} from "react-feather";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import ShoppingCart from "@material-ui/icons/ShoppingCart";
import {getMyFavouriteList} from "../../../../store/actions/favourite";
import {useNavigate} from "react-router-dom";
import dateFormat from 'dateformat';

const useStyles = makeStyles((theme) => ({
    root: {},
    button: {
        '&:hover': {
            background: '#00a651',
        },
    },
    favouriteCard: {
        minWidth: '77vw',
        maxWidth: '77vw',
        //textAlign: 'justify',
        margin: theme.spacing(1),
    },
    buttonProgress: {
        color: '#fff', //green[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
    reservationIcon: {
        right: 0,
        top: 0,
        position: 'absolute',
        color: '#00a651',
    },
    removeIcon: {
        right: 0,
        bottom: 0,
        position: 'absolute',
        color: 'red',
    },
}));

const MyFavourite = memo(
    ()=> {
        const classes = useStyles();
        const dispatch = useDispatch();
        const navigate = useNavigate();
        const timer = React.useRef();

        const [values, setValues] = React.useState({
            message: '',
            type: 'error',
            open: false,
            isRemoveFavourite: false,
        });

        const {addedItems} = useSelector(state => state.reservations);
        const {favouriteList, isLoading} = useSelector(state => state.favourites);
        const {user} = useSelector(state => state.user);
        // const restaurant = addedItems ? addedItems[0] : null;

        const handleClose = (event, reason) => {
            if (reason === 'clickaway') {
                return;
            }
            setValues({...values, open: false});
        };

        const addItem = (special) => {
            if(addedItems && addedItems?.length) {
                if(addedItems[0]?.rest_id !== special?.rest_id) {
                    setValues({
                        ...values,
                        open: true,
                        message: 'You can\'t order from different restaurant at the same reservation.',
                        type: 'warning'
                    });
                    return;
                }
            }

            if (addedItems.findIndex(item => item.id === special.id) === -1) {
                dispatch(addSpecialToBag({...special, qty: 1}));
                setValues({
                    ...values,
                    open: true,
                    message: 'Special added in reservation list.',
                    type: 'success'
                });
            } else {
                setValues({
                    ...values,
                    open: true,
                    message: 'Already added in the list.',
                    type: 'warning'
                });
            }
            setTimeout(()=> navigate(`/restaurant/${special?.rest_id}/${special?.restaurant?.slug}`), 1000);
        }

        const removeFavourite = (id) => {
            timer.current = window.setTimeout(() => {
                setValues({...values, isRemoveFavourite: true});
                let formData = new FormData();
                formData.append('spe_id', id);
                formData.append('user_id', user?.id);

                const requestOptions = {
                    method: "POST",
                    headers: authFormHeader(),
                    body: formData,
                };

                fetch(`${API}remove_favourite`, requestOptions).then((response) => {
                    //console.log(response);
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

                            const error = data.error || data.message || data.errors || getHttpErrorMessage(response);
                            //console.log(error);
                            setValues({
                                ...values,
                                open: true,
                                message: error,
                                type: 'error'
                            });
                            return;
                        }

                        if(data?.success) {
                            setValues({
                                ...values,
                                open: true,
                                message: data?.message || 'Successfully Removed.',
                                type: 'success'
                            });
                            dispatch(getMyFavouriteList());
                        }

                        if(!data?.success) {
                            setValues({
                                ...values,
                                open: true,
                                message: data?.message || 'Something went wrong!',
                                type: 'warning'
                            });
                        }
                    });
                }).catch((err) => {
                    setValues({
                        ...values,
                        open: true,
                        message: 'Please check your connectivity!',
                        type: 'error'
                    });
                }).finally(() => {
                    setValues({...values, isRemoveFavourite: false});
                });
            })
        }

        React.useEffect(()=> {
            dispatch(getMyFavouriteList());
            return () => {
                clearTimeout(timer.current);
            };
        }, [dispatch]);

        const getPrice = (special) => {
            if(special?.discount)
                return (
                    <Typography
                        component="span"
                        variant="h6"
                        color="textPrimary"
                    >
                        Price: <DollarSign size={14}/> {(special?.price - special?.price * special?.discount / 100)} (<del><DollarSign size={14}/>{special?.price}</del>)
                    </Typography>
                )
            else
                return (
                    <Typography
                        component="span"
                        variant="h6"
                        color="textPrimary"
                    >
                        Price: <DollarSign size={14}/>{special?.price}
                    </Typography>
                )
        }

        const isToday = (days) => {
            return days.includes(dateFormat(new Date(), "dddd"));
        }

        return (
            <Page title="Foodoli | My Favourite">
                <Toast isOpen={values.open} message={values.message} type={values.type} onClose={handleClose} />
                <Box m={2}>
                    <Typography variant="h4" style={{textAlign: 'center', marginBottom: 15}}>My Favourite</Typography>
                    <Grid container>
                        <Grid item>
                            <Card variant="outlined" className={classes.favouriteCard}>
                                { (values.isRemoveFavourite || isLoading) && <LinearProgress color="secondary"/> }
                                <List>
                                    {
                                        favouriteList.map((item)=> (
                                            <React.Fragment key={item?.id}>
                                                <ListItem alignItems="flex-start" divider>
                                                    <ListItemAvatar>
                                                        <img
                                                            style={{
                                                                width: 100,
                                                                backgroundColor: '#f2f7f4',
                                                                marginRight: 15
                                                            }}
                                                            src={item?.special?.image ? `${IMAGE_URL}specials/${item?.special?.image}` : '/static/images/green-logo-400x300.png'}
                                                            alt={item?.special?.title}
                                                        />
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary={
                                                            <Typography variant="h4" color="textSecondary">{item?.special?.title} <em style={{color: '#000', fontSize: 14}}>({item?.special?.code})</em></Typography>
                                                        }
                                                        secondary={
                                                            <React.Fragment>
                                                                <Typography
                                                                    component="span"
                                                                    variant="h6"
                                                                    color="textSecondary"
                                                                >
                                                                    {item?.special?.restaurant?.name}
                                                                </Typography>
                                                                <br/>
                                                                <Typography
                                                                    component="span"
                                                                    variant="body1"
                                                                    color="textPrimary"
                                                                >
                                                                    {item?.special?.restaurant?.address}
                                                                </Typography>
                                                                <br/>
                                                                {/*<Typography
                                                                    component="span"
                                                                    variant="h6"
                                                                    color="textPrimary"
                                                                >
                                                                    Price: $ {item?.special?.discount > 0 ? (item?.special?.price - item?.special?.price * item?.special?.discount / 100) : item?.special?.price}
                                                                </Typography>*/}
                                                                {getPrice(item?.special)}
                                                                <br/>
                                                            </React.Fragment>
                                                        }
                                                    />
                                                    <IconButton
                                                        onClick={() =>
                                                            addItem({
                                                                ...item?.special,
                                                                name: item?.special?.restaurant?.name,
                                                                address: item?.special?.restaurant?.address,
                                                                slug: item?.special?.restaurant?.slug,
                                                            })
                                                        }
                                                        className={classes.reservationIcon}
                                                        disabled={!isToday(item?.special?.available)}
                                                    >
                                                        <ShoppingCart/>
                                                    </IconButton>
                                                    <IconButton
                                                        onClick={() => {removeFavourite(item?.spe_id)}}
                                                        className={classes.removeIcon}
                                                    >
                                                        <Trash/>
                                                    </IconButton>
                                                </ListItem>
                                            </React.Fragment>
                                        ))
                                    }
                                </List>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>
            </Page>
        )
    }
)

export default MyFavourite;
