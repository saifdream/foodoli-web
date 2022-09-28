import React, {memo, useEffect, useState} from "react";
import Page from "../../../../components/Page";
import Box from "@material-ui/core/Box";
import {Card, CardContent, CardHeader, Grid, IconButton, LinearProgress, Paper, Typography} from "@material-ui/core";
import {authHeader} from "../../../../_helpers/auth-header";
import fetch from "cross-fetch";
import {API, getHttpErrorMessage} from "../../../../constant";
import {useSelector} from "react-redux";
import Toast from "../../../../components/Toast";
import {makeStyles} from "@material-ui/core/styles";
import {Edit} from "react-feather";
import {Link as RouterLink, useNavigate} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
    cardHeader: {
        backgroundColor:
            theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[700],
    },
    cardTotal: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'baseline',
        marginBottom: theme.spacing(2),
    },
}));

const Dashboard = memo(
    () => {
        const classes = useStyles();
        const navigate = useNavigate();
        const {user} = useSelector(state => state.user);
        const [isToastOpen, setIsToastOpen] = useState(false);
        const [isLoading, setIsLoading] = useState(false);
        const [message, setMessage] = useState('');
        const [type, setType] = useState('info');
        const timer = React.useRef();

        const [dashboard, setDashboard] = useState();
        const [restaurant, setRestaurant] = useState({
            name: '',
            description: '',
            type: 'All',
            ethnicity: '',
            foodCategory: '',
            restaurantCategory: '',
            cuisine: '',
            opening: '08:00',
            closing: '22:00',
            address: '',
            postcode: '',
            locality: '',
            region: '',
            contact: '',
            email: '',
            web: '',
        });

        const getData = () => {
            timer.current = window.setTimeout(() => {
                setIsLoading(true);
                const requestOptions = {
                    method: "GET",
                    headers: authHeader(),
                };

                fetch(`${API}dashboard/${user?.rest_id}`, requestOptions).then((response) => {
                    //console.log(response);
                    response.text().then(res => {
                        let data = "";
                        try {
                            data = res && JSON.parse(res);
                        } catch (e) {
                            setIsToastOpen(true);
                            setMessage(getHttpErrorMessage(response, e));
                            setType('error');
                            return;
                        }

                        if (!response.ok) {
                            if (response.status === 401) {
                                setIsToastOpen(true);
                                setMessage(getHttpErrorMessage(response));
                                setType('error');
                                return;
                            }

                            const error = data.error || data.message || data.errors || getHttpErrorMessage(response);
                            setMessage(error);
                            setType('error');
                            //console.log(error);
                            setIsToastOpen(true);
                            return;
                        }

                        //console.log(data)
                        if(data?.length) {
                            setDashboard(data[0]);
                        }
                    });
                }).catch((err) => {
                    setMessage('Something went wrong!!');
                    setType('error');
                    setIsToastOpen(true);
                }).finally(() => {
                    setIsLoading(false);
                });
            })
        }

        const getRestaurantData = () => {
            timer.current = window.setTimeout(() => {
                setIsLoading(true);
                const requestOptions = {
                    method: "GET",
                    headers: authHeader(),
                };

                fetch(`${API}resturant_info/${user?.rest_id}`, requestOptions).then((response) => {
                    //console.log(response);
                    response.text().then(res => {
                        let data = "";
                        try {
                            data = res && JSON.parse(res);
                        } catch (e) {
                            setIsToastOpen(true);
                            setMessage(getHttpErrorMessage(response, e));
                            setType('error');
                            return;
                        }

                        if (!response.ok) {
                            if (response.status === 401) {
                                setIsToastOpen(true);
                                setMessage(getHttpErrorMessage(response));
                                setType('error');
                                return;
                            }

                            const error = data.error || data.message || data.errors || getHttpErrorMessage(response);
                            setMessage(error);
                            setType('error');
                            //console.log(error);
                            setIsToastOpen(true);
                            return;
                        }

                        console.log(data)
                        if(data?.length) {
                            setRestaurant(data[0]);
                        }
                    });
                }).catch((err) => {
                    setMessage('Something went wrong!!');
                    setType('error');
                    setIsToastOpen(true);
                }).finally(() => {
                    setIsLoading(false);
                });
            })
        }

        useEffect(()=> {
            getData();
            getRestaurantData();
            return () => {
                clearTimeout(timer.current);
            };
        }, []);

        return (
            <Page title="Dashboard">
                <Box m={4}>
                    <Toast isOpen={isToastOpen} message={message} onClose={() => setIsToastOpen(false)} type={type}/>
                    { isLoading &&  <LinearProgress color="secondary"/> }
                    <Grid container spacing={2} justify="flex-end" alignItems="flex-end">
                        <Grid item xs={12} sm={12} md={3}>
                            <Card>
                                <CardHeader
                                    title="Today's Reservations"
                                    //subheader={tier.subheader}
                                    titleTypographyProps={{ align: 'center' }}
                                    subheaderTypographyProps={{ align: 'center' }}
                                    className={classes.cardHeader}
                                />
                                <CardContent>
                                    <div className={classes.cardTotal}>
                                        <Typography component="h2" variant="h3" color="textPrimary">
                                            Total: &nbsp;
                                            <RouterLink to="/dashboard/owner/reservations/todays">
                                                <span style={{color: '#6ac075'}}>{dashboard?.reservation_today || 0}</span>
                                            </RouterLink>
                                        </Typography>
                                    </div>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={12} md={3}>
                            <Card>
                                <CardHeader
                                    title="Confirmed Reservations"
                                    //subheader={tier.subheader}
                                    titleTypographyProps={{ align: 'center' }}
                                    subheaderTypographyProps={{ align: 'center' }}
                                    className={classes.cardHeader}
                                />
                                <CardContent>
                                    <div className={classes.cardTotal}>
                                        <Typography component="h2" variant="h3" color="textPrimary">
                                            Total: &nbsp;
                                            <RouterLink to="/dashboard/owner/reservations/confirmed">
                                                <span style={{color: '#6ac075'}}>{dashboard?.confirm || 0}</span>
                                            </RouterLink>
                                        </Typography>
                                    </div>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={12} md={3}>
                            <Card>
                                <CardHeader
                                    title="Pending Reservations"
                                    //subheader={tier.subheader}
                                    titleTypographyProps={{ align: 'center' }}
                                    subheaderTypographyProps={{ align: 'center' }}
                                    className={classes.cardHeader}
                                />
                                <CardContent>
                                    <div className={classes.cardTotal}>
                                        <Typography component="h2" variant="h3" color="textPrimary">
                                            Total: &nbsp;
                                            <RouterLink to="/dashboard/owner/reservations/pending">
                                                <span style={{color: '#6ac075'}}>{dashboard?.pending || 0}</span>
                                            </RouterLink>
                                        </Typography>
                                    </div>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={12} md={3}>
                            <Card>
                                <CardHeader
                                    title="Cancelled Reservations"
                                    //subheader={tier.subheader}
                                    titleTypographyProps={{ align: 'center' }}
                                    subheaderTypographyProps={{ align: 'center' }}
                                    className={classes.cardHeader}
                                />
                                <CardContent>
                                    <div className={classes.cardTotal}>
                                        <Typography component="h2" variant="h3" color="textPrimary">
                                            Total: &nbsp;
                                            <RouterLink to="/dashboard/owner/reservations/cancelled">
                                                <span style={{color: '#6ac075'}}>{dashboard?.cancel || 0}</span>
                                            </RouterLink>
                                        </Typography>
                                    </div>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={12} md={3}>
                            <Card>
                                <CardHeader
                                    title="Number Of Click"
                                    //subheader={tier.subheader}
                                    titleTypographyProps={{ align: 'center' }}
                                    subheaderTypographyProps={{ align: 'center' }}
                                    className={classes.cardHeader}
                                />
                                <CardContent>
                                    <div className={classes.cardTotal}>
                                        <Typography component="h2" variant="h3" color="textPrimary">
                                            Total: &nbsp;
                                            <RouterLink to="/dashboard/owner/specials">
                                                <span style={{color: '#6ac075'}}>{dashboard?.specials_click || 0}</span>
                                            </RouterLink>
                                        </Typography>
                                    </div>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                    <Paper elevation={4} style={{padding: 20, marginTop: 20}}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={6} sm={6} md={6}>
                                <Typography variant="h4">Restaurant Information</Typography>
                            </Grid>
                            <Grid item xs={6} sm={6} md={6}>
                                <IconButton style={{float: 'right',}} onClick={() => navigate('/dashboard/owner/restaurant-profile')}>
                                    <Edit/>
                                </IconButton>
                            </Grid>
                            <Grid item xs={6} sm={6} md={2}>
                                <Typography variant={"h6"}>Name:</Typography>
                            </Grid>
                            <Grid item xs={6}  sm={6} md={4}>
                                <Typography variant={"subtitle1"}>
                                    {restaurant.name}
                                </Typography>
                            </Grid>
                            <Grid item xs={6} sm={6} md={2}>
                                <Typography variant={"h6"}>Address:</Typography>
                            </Grid>
                            <Grid item xs={6}  sm={6} md={4}>
                                <Typography variant={"subtitle1"}>
                                    {restaurant.address}
                                </Typography>
                            </Grid>
                            <Grid item xs={6} sm={6} md={2}>
                                <Typography variant={"h6"}>Locality:</Typography>
                            </Grid>
                            <Grid item xs={6}  sm={6} md={4}>
                                <Typography variant={"subtitle1"}>
                                    {restaurant.locality}
                                </Typography>
                            </Grid>
                            <Grid item xs={6} sm={6} md={2}>
                                <Typography variant={"h6"}>Region:</Typography>
                            </Grid>
                            <Grid item xs={6}  sm={6} md={4}>
                                <Typography variant={"subtitle1"}>
                                    {restaurant.region}
                                </Typography>
                            </Grid>
                            <Grid item xs={6} sm={6} md={2}>
                                <Typography variant={"h6"}>Postcode:</Typography>
                            </Grid>
                            <Grid item xs={6}  sm={6} md={4}>
                                <Typography variant={"subtitle1"}>
                                    {restaurant.postcode}
                                </Typography>
                            </Grid>
                            <Grid item xs={6} sm={6} md={2}>
                                <Typography variant={"h6"}>Cuisine:</Typography>
                            </Grid>
                            <Grid item xs={6}  sm={6} md={4}>
                                <Typography variant={"subtitle1"}>
                                    {restaurant.cuisine}
                                </Typography>
                            </Grid>
                            {/*<Grid item xs={6} sm={6} md={2}>
                            <Typography variant={"h6"}>Restaurant Type:</Typography>
                        </Grid>
                        <Grid item xs={6}  sm={6} md={4}>
                            <Typography variant={"subtitle1"}>
                                {restaurant.type}
                            </Typography>
                        </Grid>*/}
                            <Grid item xs={6} sm={6} md={2}>
                                <Typography variant={"h6"}>Ethnicity:</Typography>
                            </Grid>
                            <Grid item xs={6}  sm={6} md={4}>
                                <Typography variant={"subtitle1"}>
                                    {restaurant.ethnicity}
                                </Typography>
                            </Grid>
                            <Grid item xs={6} sm={6} md={2}>
                                <Typography variant={"h6"}>Opening:</Typography>
                            </Grid>
                            <Grid item xs={6}  sm={6} md={4}>
                                <Typography variant={"subtitle1"}>
                                    {restaurant.opening}
                                </Typography>
                            </Grid>
                            <Grid item xs={6} sm={6} md={2}>
                                <Typography variant={"h6"}>Contact:</Typography>
                            </Grid>
                            <Grid item xs={6}  sm={6} md={4}>
                                <Typography variant={"subtitle1"}>
                                    {restaurant.contact}
                                </Typography>
                            </Grid>
                            <Grid item xs={6} sm={6} md={2}>
                                <Typography variant={"h6"}>Closing:</Typography>
                            </Grid>
                            <Grid item xs={6}  sm={6} md={4}>
                                <Typography variant={"subtitle1"}>
                                    {restaurant.closing}
                                </Typography>
                            </Grid>
                            <Grid item xs={6} sm={6} md={2}>
                                <Typography variant={"h6"}>Email:</Typography>
                            </Grid>
                            <Grid item xs={6}  sm={6} md={4}>
                                <Typography variant={"subtitle1"}>
                                    {restaurant.email}
                                </Typography>
                            </Grid>
                            <Grid item xs={6} sm={6} md={2}>
                                <Typography variant={"h6"}>Web:</Typography>
                            </Grid>
                            <Grid item xs={6}  sm={6} md={4}>
                                <Typography variant={"subtitle1"}>
                                    {restaurant.web}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                </Box>
            </Page>
        )
    }
)

export default Dashboard;
