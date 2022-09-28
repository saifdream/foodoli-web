import React, {Component} from "react";
import {Box, Container, Grid, LinearProgress, Typography, withStyles} from "@material-ui/core";
import Page from "../../../components/Page";
import Header from "../../../layouts/Header";
import Footer from "../../../layouts/Footer";
import {Rating} from "@material-ui/lab";
import Tab from './Tab';
import {bindActionCreators, compose} from "redux";
import {connect} from "react-redux";
import {
    getRestaurant,
    getRestaurantMenuList,
    getRestaurantReviewImageList,
    getRestaurantReviewList
} from "../../../store/actions/restaurant";
import {IMAGE_URL} from "../../../constant";
import Specials from "./Specials";
import {useParams} from "react-router";
import {Directions, Email} from "@material-ui/icons";

const withRouter = (Component) => {
    return (props) => {
        const params = useParams();
        return <Component params={params} {...props} />;
    };
};

const styles = theme => ({
    root: {
        marginTop: 82,
        minHeight: '75vh',
        bottom: 0
    },
    banner: {
        display: 'block',
        padding: '0px 0px',
        background: '#2f2f2f',
        height: '300px',
        overflow: 'hidden',
        position: 'relative',
        //backgroundColor: theme.palette.grey[800],
        color: theme.palette.common.white,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
    },
    shortBannerDesc: {
        position: 'relative',
        display: 'block',
        padding: '30px 0px',
        background: '#f5f5f5',
        overflow: 'hidden',
        //boxShadow: '0px 2px 3px 0px rgba(0,0,0,0.4)',
    },
    logoHolder: {
        position: 'relative',
        display: 'table-cell',
        textAlign: 'center',
        verticalAlign: 'middle',
        height: '170px',
        width: 'auto',
        backgroundColor: 'rgba(183,183,183,0.4)',
        overflow: 'hidden',
        borderRadius: '50%',
    },

    image: {
        position: 'relative',
        height: 200,
        [theme.breakpoints.down('xs')]: {
            width: '100% !important', // Overrides inline-style
            height: 100,
        },
        '&:hover, &$focusVisible': {
            zIndex: 1,
            '& $imageBackdrop': {
                opacity: 0.15,
            },
            '& $imageMarked': {
                opacity: 0,
            },
            '& $imageTitle': {
                border: '4px solid currentColor',
            },
        },
    },
    focusVisible: {},
    imageButton: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.palette.common.white,
    },
    imageSrc: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundSize: 'cover',
        backgroundPosition: 'center 40%',
    },
    imageBackdrop: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        //backgroundColor: theme.palette.common.black,
        backgroundColor: 'rgba(217,217,217,0.5)',
        opacity: 0.4,
        transition: theme.transitions.create('opacity'),
    },
    imageTitle: {
        position: 'relative',
        padding: `${theme.spacing(2)}px ${theme.spacing(4)}px ${theme.spacing(1) + 6}px`,
    },
    imageMarked: {
        height: 3,
        width: 18,
        backgroundColor: theme.palette.common.white,
        position: 'absolute',
        bottom: -2,
        left: 'calc(50% - 9px)',
        transition: theme.transitions.create('opacity'),
    },
});

class RestaurantView extends Component {
    constructor(props) {
        super(props);
        const {id, slug} = props.params;
        this.props.getRestaurant(id, slug);
        this.props.getRestaurantMenuList(id);
        this.props.getRestaurantReviewList(id);
        this.props.getRestaurantReviewImageList(id);
    }

    componentDidMount() {
    }

    render() {
        const {classes, restaurant, isLoading} = this.props;
        const bannerImg = restaurant?.banner ? `${IMAGE_URL}banners/${restaurant?.banner}` : '/static/images/promotion.jpg'
        return (
            <Page title="Foodoli | Restaurant">
                <Header/>
                <Box className={classes.root}>
                    <Box component="div" className={classes.banner}
                         style={{backgroundImage: `url(${bannerImg})`}}>
                        <Container component="main" maxWidth="lg">
                            <Grid
                                container
                                spacing={0}
                                direction="row"
                                alignItems="center"
                                justify="center"
                                style={{minHeight: '35vh'}}
                            >
                                <Grid item xs sm={2}>
                                    <Box className={classes.logoHolder}>
                                        <img
                                            src={restaurant?.logo ? `${IMAGE_URL}logos/${restaurant?.logo}` : '/static/images/green-logo.png'}
                                            style={{width: 170, height: 170}}
                                            alt="Logo"/>
                                    </Box>
                                </Grid>
                                <Grid item xs sm={6}>
                                    <Grid
                                        container
                                        spacing={0}
                                        direction="column"
                                    >
                                        <Grid item sm={6}>
                                            <Typography variant="h3" component="h3">
                                                {restaurant?.name}
                                            </Typography>
                                        </Grid>
                                        {
                                            restaurant?.address && (
                                                <Grid item sm={12}>
                                                    <Typography variant="h6" component="h6">
                                                        ➴ {restaurant?.address}
                                                    </Typography>
                                                </Grid>
                                            )
                                        }
                                        {
                                            restaurant?.contact && (
                                                <Grid item sm={12}>
                                                    <Typography variant="h6" component="h6">
                                                        ✆ {restaurant?.contact}
                                                    </Typography>
                                                </Grid>
                                            )
                                        }
                                    </Grid>
                                </Grid>
                                <Grid item xs sm={4} style={{textAlign: 'right'}}>
                                    <Rating name="read-only" value={Number(restaurant?.rating)} precision={0.5} readOnly/>
                                </Grid>
                            </Grid>
                        </Container>
                        {/*<span className={classes.imageBackdrop}/>*/}
                    </Box>
                    <Box component="div" className={classes.shortBannerDesc}>
                        <Container component="main" maxWidth="lg">
                            <Grid
                                container
                                spacing={0}
                                direction="row"
                                justify="flex-end"
                            >
                                <Grid item xs sm={6}>
                                    <Typography variant="h4" component="h4">
                                        {restaurant?.ethnicity}
                                    </Typography>
                                    <Typography variant="h5" component="h5" style={{marginTop: 10, display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
                                        <Directions size={12} style={{color: 'green'}}/>
                                        <a
                                            style={{color: 'green'}}
                                            href={`https://www.google.com/maps/dir/Current+Location/${restaurant?.lat}, ${restaurant?.lng}`}
                                           target="_blank"
                                        >
                                            Direction
                                        </a>
                                        &nbsp;
                                        <Email size={12} style={{color: 'green'}}/>
                                        <a
                                            style={{color: 'green'}}
                                            href={`mailto:${restaurant?.email}`}
                                           target="_blank"
                                        >
                                            {restaurant?.email}
                                        </a>
                                    </Typography>
                                </Grid>
                                <Grid item xs sm={6} style={{textAlign: 'center'}}>
                                    <Typography variant="h4" component="h4">
                                        🕑 Opening Hours
                                    </Typography>
                                    <Typography variant="subtitle1">
                                        {restaurant?.opening} - {restaurant?.closing}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Container>
                    </Box>
                    {isLoading && <LinearProgress color="secondary"/>}
                    <Box m={2}>
                        <Container component="main" maxWidth="lg">
                            <Grid
                                container
                                spacing={0}
                                direction="row"
                            >
                                <Grid item sm={6} style={{margin: 15}}>
                                    <Typography variant="h2">About <span
                                        style={{color: '#00a651'}}>{restaurant?.name}</span></Typography>
                                    <Typography variant="body2">{restaurant?.description}</Typography>
                                    <Box mt={2}>
                                        <Typography variant="h4">Discover Specials</Typography>
                                    </Box>
                                    <Box mt={2}>
                                        <Specials/>
                                    </Box>
                                </Grid>
                                <Grid item sm={5} style={{margin: 15}}>
                                    <Tab restaurant={restaurant}/>
                                </Grid>
                            </Grid>
                        </Container>
                    </Box>
                </Box>
                <Footer/>
            </Page>
        )
    }
}

function mapStateToProps(state) {
    return {
        restaurant: state.restaurants.restaurant || null,
        specials: state.restaurants.special || null,
        isLoading: state.restaurants.isLoading,
        listErrorStatus: state.restaurants.listErrorStatus,
    };
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        getRestaurant: getRestaurant,
        getRestaurantMenuList: getRestaurantMenuList,
        getRestaurantReviewList: getRestaurantReviewList,
        getRestaurantReviewImageList: getRestaurantReviewImageList,
    }, dispatch);
}

const RestaurantViewWithRouter = withRouter(RestaurantView)

export default compose(connect(mapStateToProps, matchDispatchToProps), withStyles(styles, {withTheme: true}))(RestaurantViewWithRouter);
