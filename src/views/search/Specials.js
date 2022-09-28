import React, {memo} from "react";
import {Divider, Grid, IconButton, makeStyles, Paper, Typography} from "@material-ui/core";
import ScrollAnimation from "react-animate-on-scroll";
import {IMAGE_URL} from "../../constant";
import {useDispatch, useSelector} from "react-redux";
import {getPaginatedSpecialList, getSpecialList, updateSpecialClick} from "../../store/actions/specials";
import InfiniteScroll from "react-infinite-scroll-component";
import LazyLoad from "react-lazy-load";
import {Notifications} from "@material-ui/icons";
import FoodoliCircularProgress from "../../components/CircularProgress";
import {Link as RouterLink, useNavigate} from "react-router-dom";
import Toast from "../../components/Toast";
import { addSpecialToBag } from "../../store/actions/reservation";
import Price from "../../components/Price";

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
}));

/*function useQuery() {
    return new URLSearchParams(useLocation().search);
}*/

const Specials = memo(
    () => {
        const classes = useStyles();
        const navigate = useNavigate();
        const dispatch = useDispatch();

        const [values, setValues] = React.useState({
            message: '',
            type: 'error',
            open: false,
        });

        const {specialList, previous, next, isLoading, count} = useSelector(state => state.specials);
        const {addedItems} = useSelector(state => state.reservations);
        const {isLoggedIn, user} = useSelector(state => state.user);

        // const query = useQuery();

        /*useEffect(() => {
            if(query.get('what') && query.get('where'))
                dispatch(handleSpecialSearch(query.get('what'), query.get('where')));
            dispatch(getSpecialList());
        }, []);*/

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
                if(addedItems[0].rest_id !== special?.rest_id) {
                    setValues({
                        ...values,
                        open: true,
                        message: 'You can\'t order from different restaurant at the same reservation.',
                        type: 'warning'
                    });
                    return;
                }
            }

            if (addedItems && addedItems.findIndex(item => item.id === special.id) === -1) {
                dispatch(addSpecialToBag({...special, qty: 1}));
                setValues({
                    ...values,
                    open: true,
                    message: 'Special added in reservation list.',
                    type: 'success'
                });
                setTimeout(() => {
                    navigate(`/restaurant/${special?.rest_id}/${special?.slug}`)
                }, 1000);

                dispatch(updateSpecialClick(special?.rest_id, special.id));
            } else {
                setValues({
                    ...values,
                    open: true,
                    message: 'Already added in the list.',
                    type: 'warning'
                });
                setTimeout(() => {
                    navigate(`/restaurant/${special?.rest_id}/${special?.slug}`)
                }, 1000);
            }
        }

        let ac = 0;
        return (
            <div
                id="scrollableDiv"
                style={{
                    height: '100%',
                    overflow: 'auto',
                    display: 'flex',
                    flexDirection: 'column-reverse',
                }}
            >
                <Toast isOpen={values.open} message={values.message} type={values.type} onClose={handleClose} />
                <InfiniteScroll
                    dataLength={specialList?.length || 0}
                    next={() => dispatch(getPaginatedSpecialList(next))}
                    hasMore={!isLoading && !!next}
                    loader={<FoodoliCircularProgress/>}
                    endMessage={
                        isLoading ?
                            <FoodoliCircularProgress/>
                            :
                            count === 0 ?
                                <p style={{textAlign: 'center', padding: '25px 0'}}>
                                    <b>Sorry! No results found</b>
                                </p>
                                :
                                <p style={{textAlign: 'center', padding: '25px 0'}}>
                                    <b>Yay! You have seen it all</b>
                                </p>
                    }
                    // below props only if you need pull down functionality
                    refreshFunction={() => dispatch(getSpecialList())}
                    pullDownToRefresh
                    pullDownToRefreshThreshold={50}
                    pullDownToRefreshContent={
                        <h3 style={{textAlign: 'center'}}>&#8595; Pull down to refresh</h3>
                    }
                    releaseToRefreshContent={
                        <h3 style={{textAlign: 'center'}}>&#8593; Release to refresh</h3>
                    }
                >
                    <Grid
                        container
                        direction="row"
                        justify="center"
                        //alignItems="center"
                        style={{textAlign: 'center'}}
                    >
                        {specialList && specialList.map((special, index) => {
                            if (ac === 4) ac = 0;
                            ac++;
                            if (ac === 1 || ac === 2)
                                return (
                                    <Grid item xs={12} sm={6} key={special?.uid}>
                                        <Paper style={{margin: '3px 3px'}} elevation={0}>
                                            <Grid
                                                container
                                                direction="row"
                                                justify="center"
                                                alignItems="center"
                                            >
                                                <Grid item xs={12} sm={6}>
                                                    <LazyLoad debounce={false}>
                                                        <ScrollAnimation animateIn='fadeIn'>
                                                            <IconButton onClick={()=> addItem(special)} aria-label={`info about ${special.title}`}
                                                                            className={classes.icon}>
                                                                <Notifications/>
                                                            </IconButton>
                                                            <RouterLink to={`/restaurant/${special?.rest_id}/${special?.slug}`}>
                                                                <img
                                                                    style={{width: 304, backgroundColor: '#f2f7f4'}}
                                                                    src={special?.image ? `${IMAGE_URL}specials/${special?.image}` : '/static/images/green-logo-400x300.png'}
                                                                    alt={special?.title}/>
                                                            </RouterLink>
                                                        </ScrollAnimation>
                                                    </LazyLoad>
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    {
                                                        special?.title && (
                                                            <>
                                                                <Typography variant="subtitle1"
                                                                            className={classes.foodTitle}>{special?.title}</Typography>
                                                               {/* <Typography variant="subtitle2"
                                                                            className={classes.price}>$ {special?.price}</Typography>*/}
                                                                <Price price={special?.price} discount={special?.discount} classname={classes.price} />
                                                                <Divider style={{margin: '20px'}}/>
                                                            </>
                                                        )
                                                    }
                                                    <Typography variant="h5">
                                                        {special?.name}
                                                    </Typography>
                                                    <Typography variant="body1">
                                                        <span>{special?.address}</span>
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </Paper>
                                    </Grid>
                                )
                            else
                                return (
                                    <Grid item xs={12} sm={6} key={special?.uid}>
                                        <Paper style={{margin: '3px 3px'}} elevation={0}>
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
                                                    <Divider style={{margin: '20px'}}/>
                                                    <Typography variant="h5">
                                                        {special?.name}
                                                    </Typography>
                                                    <Typography variant="body1">
                                                        <span>{special?.address}</span>
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <LazyLoad debounce={false}>
                                                        <ScrollAnimation animateIn='fadeIn'>
                                                            <IconButton onClick={()=> addItem(special)} aria-label={`info about ${special.title}`}
                                                                            className={classes.icon}>
                                                                <Notifications/>
                                                            </IconButton>
                                                            <RouterLink to={`/restaurant/${special?.rest_id}/${special?.slug}`}>
                                                                <IconButton aria-label={`info about ${special.title}`}
                                                                            className={classes.icon}>
                                                                    <Notifications/>
                                                                </IconButton>
                                                                <img
                                                                    style={{width: 304, backgroundColor: '#f2f7f4'}}
                                                                    src={special?.image ? `${IMAGE_URL}specials/${special?.image}` : '/static/images/green-logo-400x300.png'}
                                                                    alt={special?.title}/>
                                                            </RouterLink>
                                                        </ScrollAnimation>
                                                    </LazyLoad>
                                                </Grid>
                                            </Grid>
                                        </Paper>
                                    </Grid>
                                )
                        })}
                    </Grid>
                </InfiniteScroll>
            </div>
        )
    }
)
export default Specials;
