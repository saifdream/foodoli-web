import React, {memo} from 'react';
import {
    Box,
    Button,
    ButtonGroup,
    Grid,
    IconButton,
    makeStyles,
    Paper,
    Typography,
    Fab,
    CircularProgress
} from "@material-ui/core";
import ShoppingCart from '@material-ui/icons/ShoppingCart';
import ScrollAnimation from "react-animate-on-scroll";
import {useDispatch, useSelector} from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
import LazyLoad from "react-lazy-load";
import {Favorite, Notifications} from "@material-ui/icons";
import FoodoliCircularProgress from "../../../components/CircularProgress";
import {API, getHttpErrorMessage, IMAGE_URL} from "../../../constant";
import {useNavigate} from "react-router-dom";
import Toast from "../../../components/Toast";
import { addSpecialToBag } from "../../../store/actions/reservation";
import {authFormHeader} from "../../../_helpers/auth-header";
import fetch from "cross-fetch";
import {updateSpecialClick} from "../../../store/actions/specials";
import Price from "../../../components/Price";

const useStyles = makeStyles((theme) => ({
    foodTitle: {
        position: 'relative',
        display: 'block',
        fontSize: '20px',
        lineHeight: '24px',
        fontWeight: 600,
        color: '#4c4c4c',
        textDecoration: 'none',
        margin: '0 0 10px',
        '&:hover': {
            color: '#00a651'
        },
    },
    price: {
        fontSize: '18px',
        lineHeight: '18px',
        fontWeight: 400,
        color: '#737373',
        marginBottom: '10px',
    },
    icon: {
        margin: 5,
        position: 'absolute',
        color: 'rgb(0, 255, 153)',
    },
    dayTitle: {
        margin: '0 2px',
        position: 'relative',
        color: 'rgb(0, 255, 153)',
        //height: '50px',
        backgroundColor: 'rgba(22,22,22,0.4)',
        padding: '12px 0',
        bottom: '49px',
    },
    code: {
        fontWeight: "bolder"
    },
    confirm: {
        textTransform: 'capitalize',
        '&:hover': {
            color: '#ffffff',
            backgroundColor: '#00a651'
        },
    },
    imageBackdrop: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: theme.palette.common.black,
        opacity: 0.4,
        transition: theme.transitions.create('opacity'),
    },
    fab: {
        position: 'fixed',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    },
    buttonProgress: {
        color: '#fff', //green[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
}));

const Specials = memo(
    () => {
        const classes = useStyles();
        const navigate = useNavigate();
        const dispatch = useDispatch();
        const timer = React.useRef();

        const [values, setValues] = React.useState({
            message: '',
            type: 'error',
            open: false,
        });

        const restaurant = useSelector(state => state.restaurants.restaurant);
        const specialList = useSelector(state => state.restaurants.specials);
        const {addedItems} = useSelector(state => state.reservations);
        const {isLoggedIn, user} = useSelector(state => state.user);

        const handleClose = (event, reason) => {
            if (reason === 'clickaway') {
                return;
            }
            setValues({...values, open: false});
        };

        const addItem = (special) => {
            if (!isLoggedIn) {
                setValues({
                    ...values,
                    open: true,
                    message: 'You are not logged in. Login first.',
                    type: 'warning'
                });
                return;
            }

            if (user?.type != '3') {
                setValues({
                    ...values,
                    open: true,
                    message: 'You are not a customer.',
                    type: 'warning'
                });
                return;
            }

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
                dispatch(addSpecialToBag({...special, name: restaurant?.name, address: restaurant?.address, slug: restaurant?.slug, qty: 1}));
                setValues({
                    ...values,
                    open: true,
                    message: 'Special added in reservation list.',
                    type: 'success'
                });
                dispatch(updateSpecialClick(special?.rest_id, special.id));
            } else {
                setValues({
                    ...values,
                    open: true,
                    message: 'Already added in the list.',
                    type: 'warning'
                });
            }
        }

        const addFavourite = (special) => {
            if (!isLoggedIn) {
                setValues({
                    ...values,
                    open: true,
                    message: 'You are not logged in. Login first.',
                    type: 'warning'
                });
                return;
            }

            if (user?.type != '3') {
                setValues({
                    ...values,
                    open: true,
                    message: 'You are not a customer.',
                    type: 'warning'
                });
                return;
            }

            timer.current = window.setTimeout(() => {
                setValues({...values, isAddFavourite: true});
                let formData = new FormData();
                formData.append('spe_id', special?.id);
                formData.append('user_id', user?.id);

                const requestOptions = {
                    method: "POST",
                    headers: authFormHeader(),
                    body: formData,
                };

                fetch(`${API}add_favourite`, requestOptions).then((response) => {
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
                                message: data?.message || 'Successfully Added',
                                type: 'success'
                            });
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
                        message: 'Something went wrong!',
                        type: 'error'
                    });
                }).finally(() => {
                    setValues({...values, isAddFavourite: false});
                });
            })
        }

        React.useEffect(()=> {
            return () => {
                clearTimeout(timer.current);
            };
        }, []);

        let ac = 0;
        if(!specialList && specialList?.length === 0) {
            return (
                <Box display="flex" justifyContent="center" alignItems="center">
                    <Typography>No specials found</Typography>
                </Box>
            )
        }
        return (
            /*<div
                id="scrollableDiv"
                style={{
                    height: '200',
                    overflow: 'auto',
                    display: 'flex',
                    flexDirection: 'column-reverse',
                }}
            >*/
            <Box>
                <InfiniteScroll
                    dataLength={specialList?.length || 0}
                    next={() => console.log('Next')}
                    hasMore={false}
                    loader={<FoodoliCircularProgress/>}
                >
                    <Grid
                        container
                        direction="row"
                        justify="center"
                        //alignItems="center"
                        style={{textAlign: 'center'}}
                    >
                        <Toast isOpen={values.open} message={values.message} type={values.type} onClose={handleClose} />
                        {
                            specialList && specialList.map((special, index) => {
                                if (ac === 2) ac = 0;
                                ac++;
                                if (ac === 1)
                                    return (
                                        <Grid item xs={12} sm={12} key={special?.uid}>
                                            <Paper elevation={0}>
                                                <Grid
                                                    container
                                                    direction="row"
                                                    justify="center"
                                                    alignItems="center"
                                                >
                                                    <Grid item xs={12} sm={6}>
                                                        <LazyLoad debounce={false}>
                                                            <ScrollAnimation animateIn='fadeIn'>
                                                                <IconButton onClick={()=> addFavourite(special)} disabled={values.isAddFavourite} aria-label={`info about ${special?.title}`}
                                                                            className={classes.icon}>
                                                                    <Favorite/>
                                                                    {values.isAddFavourite && <CircularProgress size={24} className={classes.buttonProgress}/>}
                                                                </IconButton>
                                                                <img
                                                                    style={{width: 304, backgroundColor: '#f2f7f4'}}
                                                                    src={special?.image ? `${IMAGE_URL}specials/${special?.image}` : '/static/images/green-logo-400x300.png'}
                                                                    alt={special?.title}/>
                                                                <Box
                                                                    className={classes.dayTitle}>
                                                                    <Typography variant={'h5'}>{special?.final_day}</Typography>
                                                                </Box>
                                                            </ScrollAnimation>
                                                        </LazyLoad>
                                                    </Grid>
                                                    <Grid item xs={12} sm={6}>
                                                        {
                                                            special?.title && (
                                                                <>
                                                                    <Typography variant="subtitle1"
                                                                                className={classes.foodTitle}>{special?.title}</Typography>
                                                                    {/*<Typography variant="subtitle2"
                                                                                className={classes.price}>$ {special?.price}</Typography>*/}
                                                                    <Price price={special?.price} discount={special?.discount} classname={classes.price} />
                                                                    {/*<Divider style={{margin: '20px'}}/>*/}
                                                                </>
                                                            )
                                                        }
                                                        <Box mt={2} mb={2}>
                                                            <ButtonGroup size="large" color="secondary" aria-label="large outlined primary button group">
                                                                <Button className={classes.code} disabled>{special?.code}</Button>
                                                                {
                                                                    special?.final_day === "Today's" &&
                                                                    <Button className={classes.confirm} onClick={() => addItem(special)}>
                                                                        Reserve it
                                                                    </Button>
                                                                }
                                                            </ButtonGroup>
                                                        </Box>
                                                        <Box m={2}>
                                                            <Typography variant="body1">
                                                                <span>{special?.description}</span>
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                            </Paper>
                                        </Grid>
                                    )
                                else
                                    return (
                                        <Grid item xs={12} sm={12} key={special?.uid}>
                                            <Paper elevation={0}>
                                                <Grid
                                                    container
                                                    direction='row'
                                                    justify="center"
                                                    alignItems="center"
                                                >
                                                    <Grid item xs={12} sm={6}>
                                                        <Typography variant="subtitle1"
                                                                    className={classes.foodTitle}>{special?.title}</Typography>
                                                        {/*<Typography variant="subtitle2"
                                                                    className={classes.price}>$ {special?.price}</Typography>*/}
                                                        <Price price={special?.price} discount={special?.discount} classname={classes.price} />
                                                        <Box mt={2} mb={2}>
                                                            <ButtonGroup size="large" color="secondary" aria-label="large outlined primary button group">
                                                                <Button className={classes.code} disabled>{special?.code}</Button>
                                                                {
                                                                    special?.final_day === "Today's" &&
                                                                    <Button className={classes.confirm} onClick={() => addItem(special)}>
                                                                        Reserve it
                                                                    </Button>
                                                                }
                                                            </ButtonGroup>
                                                        </Box>
                                                        {/*<Divider style={{margin: '20px'}}/>*/}
                                                        <Box m={2}>
                                                            <Typography variant="body1">
                                                                <span>{special?.description}</span>
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={12} sm={6}>
                                                        <LazyLoad debounce={false}>
                                                            <ScrollAnimation animateIn='fadeIn'>
                                                                <IconButton onClick={()=> addFavourite(special)} disabled={values.isAddFavourite} aria-label={`info about ${special.title}`} className={classes.icon}>
                                                                    <Favorite/>
                                                                    {values.isAddFavourite && <CircularProgress size={24} className={classes.buttonProgress}/>}
                                                                </IconButton>
                                                                <img
                                                                    style={{width: 304, backgroundColor: '#f2f7f4'}}
                                                                    src={special?.image ? `${IMAGE_URL}specials/${special?.image}` : '/static/images/green-logo-400x300.png'}
                                                                    alt={special?.title}/>
                                                                <Box
                                                                    className={classes.dayTitle}>
                                                                    <Typography variant={'h5'}>{special?.final_day}</Typography>
                                                                </Box>
                                                            </ScrollAnimation>
                                                        </LazyLoad>
                                                    </Grid>
                                                </Grid>
                                            </Paper>
                                        </Grid>
                                    )
                            })
                        }
                    </Grid>
                </InfiniteScroll>
                {
                    addedItems && addedItems?.length > 0 && (
                        <Fab color="secondary" className={classes.fab} aria-label="add" onClick={()=> navigate('/dashboard/customer/my-reservation')}>
                            <ShoppingCart style={{color: '#fff'}}/>
                        </Fab>
                    )
                }
            </Box>
            /*</div>*/
        )
    }
)
export default Specials;
