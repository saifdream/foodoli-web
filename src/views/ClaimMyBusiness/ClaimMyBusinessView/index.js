import React, {memo, useState} from "react";
import PropTypes from 'prop-types';
import Page from "../../../components/Page";
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Checkbox,
    Container,
    FormControl,
    FormControlLabel, FormGroup, FormHelperText,
    FormLabel,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    LinearProgress,
    Link,
    makeStyles,
    MenuItem,
    Paper,
    Select,
    Step,
    StepConnector,
    StepLabel,
    Stepper,
    TextField,
    Typography,
    withStyles
} from "@material-ui/core";
import Header from "../../../layouts/Header";
import Button from "@material-ui/core/Button";
import {
    Check, CheckCircle,
    Close,
    Edit,
    EmailOutlined,
    RestaurantMenu,
    SearchOutlined,
    Visibility,
    VisibilityOff
} from "@material-ui/icons";
import clsx from "clsx";
import {ArrowUpCircle, Key, Phone, User} from "react-feather";
import {Formik} from "formik";
import * as Yup from "yup";
import Avatar from "@material-ui/core/Avatar";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import {authFormHeader, authHeader} from "../../../_helpers/auth-header";
import fetch from "cross-fetch";
import {API, getHttpErrorMessage, IMAGE_URL} from "../../../constant";
import Toast from "../../../components/Toast";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import {Rating} from "@material-ui/lab";
import {Link as RouterLink} from "react-router-dom";

const useQonToStepIconStyles = makeStyles({
    root: {
        color: '#eaeaf0',
        display: 'flex',
        height: 22,
        alignItems: 'center',
    },
    active: {
        color: '#784af4',
    },
    circle: {
        width: 8,
        height: 8,
        borderRadius: '50%',
        backgroundColor: 'currentColor',
    },
    completed: {
        color: '#784af4',
        zIndex: 1,
        fontSize: 18,
    },
});

function QonToStepIcon(props) {
    const classes = useQonToStepIconStyles();
    const { active, completed } = props;

    return (
        <div
            className={clsx(classes.root, {
                [classes.active]: active,
            })}
        >
            {completed ? <Check className={classes.completed} /> : <div className={classes.circle} />}
        </div>
    );
}

QonToStepIcon.propTypes = {
    /**
     * Whether this step is active.
     */
    active: PropTypes.bool,
    /**
     * Mark the step as completed. Is passed to child components.
     */
    completed: PropTypes.bool,
};

const ColorLbConnector = withStyles({
    alternativeLabel: {
        top: 22,
    },
    active: {
        '& $line': {
            backgroundImage: 'linear-gradient( 136deg, rgb(71, 185, 7) 0%, rgb(23, 247, 68) 50%, rgb(9, 255, 105) 100%)',
        },
    },
    completed: {
        '& $line': {
            backgroundImage: 'linear-gradient( 136deg, rgb(71, 185, 7) 0%, rgb(23, 247, 68) 50%, rgb(9, 255, 105) 100%)',
        },
    },
    line: {
        height: 3,
        border: 0,
        backgroundColor: '#eaeaf0',
        borderRadius: 1,
    },
})(StepConnector);

const useColorLibStepIconStyles = makeStyles({
    root: {
        backgroundColor: '#ccc',
        zIndex: 1,
        color: '#fff',
        width: 50,
        height: 50,
        display: 'flex',
        borderRadius: '50%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    active: {
        backgroundImage: 'linear-gradient( 136deg, rgb(100, 255, 14) 0%, rgb(0, 176, 36) 50%, rgb(3, 172, 69) 100%);',
        boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
    },
    completed: {
        backgroundImage: 'linear-gradient( 136deg, rgb(100, 255, 14) 0%, rgb(0, 176, 36) 50%, rgb(3, 172, 69) 100%);',
    },
});

function ColorLibStepIcon(props) {
    const classes = useColorLibStepIconStyles();
    const { active, completed } = props;

    const icons = {
        1: <SearchOutlined />,
        2: <RestaurantMenu />,
        3: <ArrowUpCircle />,
        4: <Key />,
    };

    return (
        <div
            className={clsx(classes.root, {
                [classes.active]: active,
                [classes.completed]: completed,
            })}
        >
            {icons[String(props.icon)]}
        </div>
    );
}

ColorLibStepIcon.propTypes = {
    /**
     * Whether this step is active.
     */
    active: PropTypes.bool,
    /**
     * Mark the step as completed. Is passed to child components.
     */
    completed: PropTypes.bool,
    /**
     * The label displayed in the step icon.
     */
    icon: PropTypes.node,
};

const useStyles = makeStyles((theme) => ({
    root: {
        paddingTop: 100,
        //minHeight: '75vh'
    },
    text: {
        padding: theme.spacing(2, 2, 0),
        textAlign: "center"
    },
    backButton: {
        marginRight: theme.spacing(1),
    },
    instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    formControl: {
        margin: theme.spacing(3),
    },
}));

function getSteps() {
    return ['Find', 'Claim', 'Sign Up', 'Verification'];
}

function getStepContent(stepIndex) {
    switch (stepIndex) {
        case 0:
            return 'Step 1: Find your restaurant';
        case 1:
            return 'Step 2: Claim your business';
        case 2:
            return 'Step 3: Signup';
        case 3:
            return 'Step 4: Verification';
        default:
            return 'Unknown stepIndex';
    }
}

const ClaimMyBusiness = memo(
    () => {
        const classes = useStyles();
        const [restaurants, setRestaurants] = useState([]);
        const [restaurantSelected, setRestaurantSelected] = useState();
        const [lat, setLat] = useState(0);
        const [lng, setLng] = useState(0);
        const [isManual, setIsManual] = useState(false);
        const [isToastOpen, setIsToastOpen] = useState(false);
        const [isSaving, setIsSaving] = useState(false);
        const [isLoading, setIsLoading] = useState(false);
        const [message, setMessage] = useState('');
        const [type, setType] = useState('');
        const timer = React.useRef();

        const [activeStep, setActiveStep] = React.useState(0);
        const steps = getSteps();

        const handleNext = () => {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        };

        const handleBack = () => {
            setActiveStep((prevActiveStep) => prevActiveStep - 1);
        };

        const handleReset = () => {
            setActiveStep(0);
        };

        const find = (restaurant, city) => {
            console.log(restaurant, city);
            timer.current = window.setTimeout(() => {
                setIsLoading(true);
                console.log("restaurant, city");
                console.log(restaurant, city);
                let formData = new FormData();
                if (restaurant)
                    formData.append('restaurant', restaurant);
                if (city)
                    formData.append('city', city);

                const requestOptions = {
                    method: "POST",
                    headers: authFormHeader(),
                    body: formData,
                };

                fetch(`${API}find_restaurant`, requestOptions).then((response) => {
                    console.log(response);
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
                                setMessage(getHttpErrorMessage(response));
                                setType('error');
                                setIsToastOpen(true);
                                return;
                            }

                            const error = data.error || data.message || data.errors || getHttpErrorMessage(response);
                            setMessage(error);
                            setType('error');
                            setIsToastOpen(true);
                            //console.log(error);
                            return;
                        }
                        setRestaurants(data['restaurant']);
                    });
                }).catch((err) => {
                    console.log(err)
                    setMessage('Something went wrong!');
                    setType('error');
                    setIsToastOpen(true);
                }).finally(() => {
                    setIsLoading(false);
                });
            })
        }

        React.useEffect(() => {
            return () => {
                clearTimeout(timer.current);
            };
        }, []);

        const claimMyBusiness = (restaurant) => {
            console.log(restaurant)
            handleNext();
            setIsManual(false)
            setRestaurantSelected(restaurant);
        }

        const manual = () => {
            handleNext();
            setIsManual(true);
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    console.log(position.coords.latitude);
                    setLat(position.coords.latitude);
                    console.log(position.coords.longitude);
                    setLng(position.coords.latitude);
                },
                function(error) {
                    console.error("Error Code = " + error.code + " - " + error.message);
                }
            );
        }

        const signUp = (values) => {
            const {condition, authorized, firstName, lastName, email, contact, dob, password, restaurantName, opening, closing, address, postcode} = values;
            if(!condition || !authorized) {
                setIsToastOpen(true);
                setMessage("Please fill required data.");
                setType('warning');
                return;
            }

            if(isManual) {
                if(firstName || lastName || email || contact || dob || password || restaurantName || opening || closing || address || postcode) {
                    setIsToastOpen(true);
                    setMessage("Please fill required data.");
                    setType('warning');
                    return;
                }
            }

            if(!isManual) {
                if(firstName || lastName || email || contact || dob || password) {
                    setIsToastOpen(true);
                    setMessage("Please fill required data.");
                    setType('warning');
                    return;
                }
            }

            timer.current = setTimeout(() => {
                setIsSaving(true);
                const formData = new FormData();
                if(isManual) {
                    formData.append('first_name', values.firstName.trim());
                    formData.append('last_name', values.lastName.trim());
                    formData.append('email', values.email.trim());
                    formData.append('contact', values.contact.trim());
                    formData.append('dob', values.dob);
                    formData.append('password', values.password.trim());
                    formData.append('restaurant_name', values.restaurantName.trim());
                    formData.append('opening', values.opening.trim());
                    formData.append('closing', values.closing.trim());
                    formData.append('address', values.address.trim());
                    formData.append('postcode', values.postcode.trim());
                    formData.append('lat', lat.toString());
                    formData.append('lng', lng.toString());
                    formData.append('isManual', 'true');
                } else {
                    formData.append('first_name', values.firstName.trim());
                    formData.append('last_name', values.lastName.trim());
                    formData.append('email', values.email.trim());
                    formData.append('contact', values.contact.trim());
                    formData.append('dob', values.contact.trim());
                    formData.append('password', values.password.trim());
                    formData.append('restaurant', JSON.stringify(restaurantSelected));
                }

                const requestOptions = {
                    method: 'POST',
                    headers: authFormHeader(),
                    body: formData,
                };

                fetch(`${API}restaurant/owner_registration`, requestOptions).then((response) => {
                    //console.log(response)
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
                                setMessage(data?.error || getHttpErrorMessage(response));
                                setType('error');
                                return;
                            }

                            const error = data?.error || data?.message || getHttpErrorMessage(response);
                            //console.log(error);
                            setIsToastOpen(true);
                            setMessage(error);
                            setType('error');
                            return;
                        }

                        console.log(data)
                        if(data?.success) {
                            setIsToastOpen(true);
                            setMessage(data?.message || "Thanks for signing up! Please check your email to complete your registration.");
                            setType('success');
                            handleNext();
                        } else if (!data?.success) {
                            setIsToastOpen(true);
                            setMessage(data?.message);
                            setType('warning');
                        }
                    });
                }).catch((err) => {
                    console.log(err)
                    setIsToastOpen(true);
                    setMessage(err);
                    setType('error');
                }).finally(() => {
                    setIsSaving(false);
                });
            })
        }

        return (
            <Page title="Foodoli | Claim My Business">
                <Header/>
                <Container component="main" maxWidth="lg" className={classes.root}>
                    <Toast isOpen={isToastOpen} message={message} onClose={() => setIsToastOpen(false)} type={type}/>
                    <Box p={2}>
                        <Paper elevation={4} variant={"outlined"}>
                            <Stepper alternativeLabel activeStep={activeStep} connector={<ColorLbConnector />}>
                                {steps.map((label) => (
                                    <Step key={label}>
                                        <StepLabel StepIconComponent={ColorLibStepIcon}>{label}</StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                        </Paper>
                        <div>
                            {
                                activeStep === steps.length ? (
                                    <div>
                                        <Typography className={classes.instructions}>
                                            All steps completed - you&apos;re finished
                                        </Typography>
                                        <Button onClick={handleReset} className={classes.button}>
                                            Reset
                                        </Button>
                                    </div>
                                )
                                :
                                <>
                                    {
                                        activeStep === 0 && (
                                            <Box mt={4}>
                                                <Typography className={classes.instructions}>
                                                    <Typography variant="h3">{getStepContent(activeStep)}</Typography>
                                                    <Typography variant="body2" style={{paddingTop: 10}}>
                                                        In order to find your restaurant, please enter your restaurant name and location (i.e. city or zip code) below.
                                                    </Typography>
                                                </Typography>
                                                <Paper variant="outlined" elevation={4} style={{padding: 20, marginTop: 20}}>
                                                    {isLoading && <LinearProgress color="secondary"/>}
                                                    <Box
                                                        display="flex"
                                                        flexDirection="column"
                                                        justifyContent="center"
                                                        alignItems="center"
                                                    >
                                                        <Container>
                                                            <Formik
                                                                initialValues={{
                                                                    restaurantName: '',
                                                                    cityOrZip: '',
                                                                }}
                                                                validationSchema={Yup.object().shape({
                                                                    restaurantName: Yup.string().max(255).required('Restaurant name is required'),
                                                                    cityOrZip: Yup.string().max(255).required('City or Zip is required')
                                                                })}
                                                                onSubmit={(values) => {
                                                                    console.log(values.restaurantName, values.cityOrZip);
                                                                    handleNext();
                                                                    find(values.restaurantName, values.cityOrZip);
                                                                }}
                                                            >
                                                                {({
                                                                      errors,
                                                                      handleBlur,
                                                                      handleChange,
                                                                      handleSubmit,
                                                                      isSubmitting,
                                                                      touched,
                                                                      values,
                                                                  }) => (
                                                                    <form onSubmit={handleSubmit}>
                                                                        <Grid
                                                                            container
                                                                            spacing={2}
                                                                            direction="row"
                                                                            alignItems="center"
                                                                            justify="center"
                                                                        >
                                                                            <Grid item>
                                                                                <TextField
                                                                                    error={Boolean(touched.restaurantName && errors.restaurantName)}
                                                                                    helperText={touched.restaurantName && errors.restaurantName}
                                                                                    label="Restaurant Name"
                                                                                    placeholder="Enter Restaurant Name"
                                                                                    margin="dense"
                                                                                    name="restaurantName"
                                                                                    onBlur={handleBlur}
                                                                                    className={classes.input}
                                                                                    onChange={handleChange}
                                                                                    type="text"
                                                                                    required
                                                                                    value={values.restaurantName}
                                                                                    color="secondary"
                                                                                    variant="outlined"
                                                                                />
                                                                            </Grid>
                                                                            <Grid item>
                                                                                <TextField
                                                                                    error={Boolean(touched.cityOrZip && errors.cityOrZip)}
                                                                                    helperText={touched.cityOrZip && errors.cityOrZip}
                                                                                    label="City or Zip Code"
                                                                                    placeholder="Enter City or Zip Code"
                                                                                    margin="dense"
                                                                                    name="cityOrZip"
                                                                                    onBlur={handleBlur}
                                                                                    onChange={handleChange}
                                                                                    type="text"
                                                                                    required
                                                                                    value={values.cityOrZip}
                                                                                    variant="outlined"
                                                                                    color="secondary"
                                                                                />
                                                                            </Grid>
                                                                            <Grid item>
                                                                                <Box>
                                                                                    <Button
                                                                                        color="secondary"
                                                                                        style={{color: '#fff', backgroundColor: '#00a651'}}
                                                                                        size="large"
                                                                                        type="submit"
                                                                                        variant="contained"
                                                                                    >
                                                                                        Find Now
                                                                                    </Button>
                                                                                </Box>
                                                                            </Grid>
                                                                        </Grid>
                                                                    </form>
                                                                )}
                                                            </Formik>
                                                        </Container>
                                                    </Box>
                                                </Paper>
                                            </Box>
                                        )
                                    }

                                    {
                                        activeStep === 1 && (
                                            <Box mt={4}>
                                                <Typography className={classes.instructions}>
                                                    <Typography variant="h3">{getStepContent(activeStep)}</Typography>
                                                    <Typography variant="body1" style={{paddingTop: 10}}>
                                                        Find your restaurant, please enter your restaurant name and location (i.e. city or zip code) below.
                                                    </Typography>
                                                </Typography>
                                                <Paper variant="outlined" elevation={4} style={{padding: 20, marginTop: 20}}>
                                                    {isLoading && <LinearProgress color="secondary"/>}
                                                    <Box
                                                        display="flex"
                                                        flexDirection="column"
                                                        justifyContent="center"
                                                        alignItems="center"
                                                    >
                                                        <Container>
                                                            <Formik
                                                                initialValues={{
                                                                    restaurantName: '',
                                                                    cityOrZip: '',
                                                                }}
                                                                validationSchema={Yup.object().shape({
                                                                    restaurantName: Yup.string().max(255).required('Restaurant name is required'),
                                                                    cityOrZip: Yup.string().max(255).required('City or Zip is required')
                                                                })}
                                                                onSubmit={(values) => {
                                                                    console.log(values.restaurantName, values.cityOrZip);
                                                                    find(values.restaurantName, values.cityOrZip);
                                                                }}
                                                            >
                                                                {({
                                                                      errors,
                                                                      handleBlur,
                                                                      handleChange,
                                                                      handleSubmit,
                                                                      touched,
                                                                      values,
                                                                  }) => (
                                                                    <form onSubmit={handleSubmit}>
                                                                        <Grid
                                                                            container
                                                                            spacing={2}
                                                                            direction="row"
                                                                            alignItems="center"
                                                                            justify="center"
                                                                        >
                                                                            <Grid item>
                                                                                <TextField
                                                                                    size="small"
                                                                                    error={Boolean(touched.restaurantName && errors.restaurantName)}
                                                                                    fullWidth
                                                                                    helperText={touched.restaurantName && errors.restaurantName}
                                                                                    label="Restaurant Name"
                                                                                    placeholder="Enter Restaurant Name"
                                                                                    margin="normal"
                                                                                    name="restaurantName"
                                                                                    onBlur={handleBlur}
                                                                                    className={classes.input}
                                                                                    onChange={handleChange}
                                                                                    type="text"
                                                                                    required
                                                                                    value={values.restaurantName}
                                                                                    color="secondary"
                                                                                    variant="outlined"
                                                                                />
                                                                            </Grid>
                                                                            <Grid item>
                                                                                <TextField
                                                                                    size="small"
                                                                                    error={Boolean(touched.cityOrZip && errors.cityOrZip)}
                                                                                    fullWidth
                                                                                    helperText={touched.cityOrZip && errors.cityOrZip}
                                                                                    label="City or Zip Code"
                                                                                    placeholder="Enter City or Zip Code"
                                                                                    margin="normal"
                                                                                    name="cityOrZip"
                                                                                    onBlur={handleBlur}
                                                                                    onChange={handleChange}
                                                                                    type="text"
                                                                                    required
                                                                                    value={values.cityOrZip}
                                                                                    variant="outlined"
                                                                                    color="secondary"
                                                                                />
                                                                            </Grid>
                                                                            <Grid item>
                                                                                <Box my={2}>
                                                                                    <Button
                                                                                        color="secondary"
                                                                                        style={{color: '#fff', backgroundColor: '#00a651'}}
                                                                                        size="large"
                                                                                        type="submit"
                                                                                        variant="contained"
                                                                                    >
                                                                                        Find Now
                                                                                    </Button>
                                                                                </Box>
                                                                            </Grid>
                                                                        </Grid>
                                                                    </form>
                                                                )}
                                                            </Formik>
                                                        </Container>
                                                    </Box>
                                                    {
                                                        restaurants.length === 0 && (
                                                            <Box mt={4} display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                                                                { !isLoading && <Typography variant="h4">Ops! Didn't found your Restaurant?</Typography> }
                                                                { isLoading && <Typography variant="h4">Ops! Didn't found your Restaurant?</Typography> }
                                                                <Button
                                                                    variant="contained"
                                                                    onClick={()=> manual()}
                                                                    style={{
                                                                        marginTop: 25,
                                                                        color: '#fff',
                                                                        backgroundColor: '#00a651'
                                                                    }}
                                                                >
                                                                    Manual Registration
                                                                </Button>
                                                            </Box>
                                                        )
                                                    }
                                                    {
                                                        restaurants.length > 0 && (
                                                            <Card>
                                                                <CardContent>
                                                                    <List>
                                                                        {
                                                                            restaurants.map((item) => (
                                                                                <React.Fragment key={item?.id}>
                                                                                    <ListItem alignItems="flex-start">
                                                                                        <ListItemAvatar>
                                                                                            <img
                                                                                                style={{
                                                                                                    width: 120,
                                                                                                    backgroundColor: '#f2f7f4',
                                                                                                    marginRight: 15
                                                                                                }}
                                                                                                src={item?.logo ? `${IMAGE_URL}logos/${item?.logo}` : '/static/images/green-logo-400x300.png'}
                                                                                                alt={item?.name}
                                                                                            />
                                                                                        </ListItemAvatar>
                                                                                        <ListItemText
                                                                                            primary={<Typography variant="h4" color="textSecondary">{item?.name}</Typography>}
                                                                                            secondary={
                                                                                                <React.Fragment>
                                                                                                    {
                                                                                                        (item?.category !== 'undefined' && item?.category) && (
                                                                                                            <Typography variant="subtitle1" color="textPrimary" style={{textTransform: "capitalize"}}>{item?.category}</Typography>
                                                                                                        )
                                                                                                    }

                                                                                                    {
                                                                                                        (!item?.category !== 'undefined' && item?.category && item?.ethnicity) && (
                                                                                                            <Typography variant="subtitle1" color="textPrimary">{item?.ethnicity}</Typography>
                                                                                                        )
                                                                                                    }

                                                                                                    {
                                                                                                        item?.contact && (
                                                                                                            <Typography
                                                                                                                component="div"
                                                                                                                variant="body1"
                                                                                                                color="textPrimary"
                                                                                                            >
                                                                                                                Contact: {item?.contact}
                                                                                                            </Typography>
                                                                                                        )
                                                                                                    }

                                                                                                    {
                                                                                                        item?.email && (
                                                                                                            <Typography
                                                                                                                component="div"
                                                                                                                variant="body1"
                                                                                                                color="textPrimary"
                                                                                                            >
                                                                                                                Email: {item?.email}
                                                                                                            </Typography>
                                                                                                        )
                                                                                                    }
                                                                                                    <Typography
                                                                                                        component="div"
                                                                                                        variant="body1"
                                                                                                        color="textPrimary"
                                                                                                    >
                                                                                                        {item?.address}, {item?.locality}, {item?.region}
                                                                                                    </Typography>

                                                                                                    <Rating
                                                                                                        name="read-only"
                                                                                                        value={Number(item?.rating)}
                                                                                                        precision={0.5}
                                                                                                        readOnly
                                                                                                        style={{
                                                                                                            right: 35,
                                                                                                            top: 25,
                                                                                                            position: 'absolute',
                                                                                                        }}
                                                                                                    />

                                                                                                    <Button
                                                                                                        variant="contained"
                                                                                                        onClick={()=> claimMyBusiness(item)}
                                                                                                        style={{
                                                                                                            right: 35,
                                                                                                            bottom: 25,
                                                                                                            position: 'absolute',
                                                                                                            textTransform: 'capitalize',
                                                                                                            // color: '#fff',
                                                                                                            // backgroundColor: '#00a651'
                                                                                                        }}
                                                                                                    >
                                                                                                        Claim
                                                                                                    </Button>

                                                                                                </React.Fragment>
                                                                                            }
                                                                                        />
                                                                                    </ListItem>
                                                                                    <Divider variant="inset" component="li"/>
                                                                                </React.Fragment>
                                                                            ))
                                                                        }
                                                                    </List>
                                                                </CardContent>
                                                            </Card>
                                                        )
                                                    }
                                                </Paper>
                                            </Box>
                                        )
                                    }

                                    {
                                        activeStep === 2 && (
                                            <Box mt={4}>
                                                <Typography className={classes.instructions}>
                                                    <Typography variant="h3">{getStepContent(activeStep)}</Typography>
                                                </Typography>
                                                <Paper variant="outlined" elevation={4} style={{padding: 20, marginTop: 20}}>
                                                    {isSaving && <LinearProgress color="secondary"/>}
                                                    <Box
                                                        display="flex"
                                                        flexDirection="column"
                                                        height="100%"
                                                        justifyContent="center"
                                                    >
                                                        <Container maxWidth="md">
                                                            <Formik
                                                                initialValues={{
                                                                    firstName: '',
                                                                    lastName: '',
                                                                    email: '',
                                                                    contact: '',
                                                                    password: '',
                                                                    dob: '',
                                                                    restaurantName: restaurantSelected?.name,
                                                                    address: restaurantSelected?.address,
                                                                    opening: '08:30',
                                                                    closing: '08:30',
                                                                    postcode: restaurantSelected?.postcode,
                                                                    condition: false,
                                                                    authorized: false,
                                                                }}
                                                                validationSchema={Yup.object().shape({
                                                                    firstName: Yup.string().max(255).required('First Name is required'),
                                                                    lastName: Yup.string().max(255).required('Last Name is required'),
                                                                    email: Yup.string().email('Invalid email').required('Email is required'),
                                                                    contact: Yup.string().required('Contact is required'),
                                                                    password: Yup.string().max(255).required('Password is required'),
                                                                    dob: Yup.date().default(function () {return new Date();}),
                                                                    restaurantName: Yup.string().max(255).required('Restaurant Name is required'),
                                                                    address: Yup.string().max(255).required('Restaurant Name is required'),
                                                                    opening: Yup.date().default(function () {return new Date();}).required('Opening time required'),
                                                                    closing: Yup.date().default(function () {return new Date();}),
                                                                    postcode: Yup.string().max(255).required('Post/Zip code is required'),
                                                                    condition: Yup.boolean().required('Please accept Foodoli\'s terms of services and privacy policy.'),
                                                                    authorized: Yup.boolean().required('Please accept if you are the authorized person to open this account.'),
                                                                })}
                                                                onSubmit={(values) => {
                                                                    console.log(values)
                                                                    signUp(values);
                                                                }}
                                                            >
                                                                {({
                                                                      errors,
                                                                      handleBlur,
                                                                      handleChange,
                                                                      handleSubmit,
                                                                      isSubmitting,
                                                                      touched,
                                                                      values,
                                                                      setValues,
                                                                      isValid
                                                                  }) => (
                                                                    <form onSubmit={handleSubmit}>
                                                                        <Grid container justify="center" spacing={1}>
                                                                            <Grid item>
                                                                                <img src="/static/images/logo144.png" style={{height: 68, width: 'auto'}}
                                                                                     alt="Logo"/>
                                                                            </Grid>
                                                                            <Grid item>
                                                                                <Box mx={8} justifyContent="center">
                                                                                    <Typography
                                                                                        color="textPrimary"
                                                                                        variant="h4"
                                                                                        style={{textAlign: 'center', fontWeight: 'bolder'}}
                                                                                    >
                                                                                        Foodoli wants to know about your restaurant so that you can offer your special dishes to your cusomer.
                                                                                    </Typography>
                                                                                    <Divider style={{marginTop: 15}}/>
                                                                                </Box>
                                                                            </Grid>
                                                                        </Grid>
                                                                        <Grid container spacing={1}>
                                                                            <Grid item xs={12} sm={12}>
                                                                                <Typography className={classes.text} variant="subtitle1" gutterBottom>
                                                                                    Personal Information
                                                                                </Typography>
                                                                            </Grid>
                                                                            <Grid item xs={12} sm={6}>
                                                                                <TextField
                                                                                    fullWidth
                                                                                    error={Boolean(touched.firstName && errors.firstName)}
                                                                                    helperText={touched.firstName && errors.firstName}
                                                                                    label="First Name"
                                                                                    placeholder="First Name"
                                                                                    margin="normal"
                                                                                    name="firstName"
                                                                                    onBlur={handleBlur}
                                                                                    onChange={handleChange}
                                                                                    type="text"
                                                                                    required
                                                                                    value={values.firstName}
                                                                                    variant="outlined"
                                                                                    color="secondary"
                                                                                />
                                                                            </Grid>
                                                                            <Grid item xs={12} sm={6}>
                                                                                <TextField
                                                                                    fullWidth
                                                                                    error={Boolean(touched.lastName && errors.lastName)}
                                                                                    helperText={touched.lastName && errors.lastName}
                                                                                    label="Last Name"
                                                                                    placeholder="Last Name"
                                                                                    margin="normal"
                                                                                    name="lastName"
                                                                                    onBlur={handleBlur}
                                                                                    onChange={handleChange}
                                                                                    type="text"
                                                                                    required
                                                                                    value={values.lastName}
                                                                                    variant="outlined"
                                                                                    color="secondary"
                                                                                    className={classes.textField}
                                                                                />
                                                                            </Grid>
                                                                            <Grid item xs={12} sm={6}>
                                                                                <TextField
                                                                                    fullWidth
                                                                                    error={Boolean(touched.email && errors.email)}
                                                                                    helperText={touched.email && errors.email}
                                                                                    label="Email"
                                                                                    placeholder="Email"
                                                                                    margin="normal"
                                                                                    name="email"
                                                                                    onBlur={handleBlur}
                                                                                    onChange={handleChange}
                                                                                    type="email"
                                                                                    required
                                                                                    value={values.email}
                                                                                    variant="outlined"
                                                                                    color="secondary"
                                                                                />
                                                                            </Grid>
                                                                            <Grid item xs={12} sm={6}>
                                                                                <TextField
                                                                                    fullWidth
                                                                                    error={Boolean(touched.contact && errors.contact)}
                                                                                    helperText={touched.contact && errors.contact}
                                                                                    label="Contact"
                                                                                    placeholder="Contact"
                                                                                    margin="normal"
                                                                                    name="contact"
                                                                                    onBlur={handleBlur}
                                                                                    onChange={handleChange}
                                                                                    type="text"
                                                                                    required
                                                                                    value={values.contact}
                                                                                    variant="outlined"
                                                                                    color="secondary"
                                                                                    className={classes.textField}
                                                                                />
                                                                            </Grid>
                                                                            <Grid item xs={12} sm={6}>
                                                                                <TextField
                                                                                    fullWidth
                                                                                    error={Boolean(touched.password && errors.password)}
                                                                                    helperText={touched.password && errors.password}
                                                                                    label="Password"
                                                                                    placeholder="Password"
                                                                                    margin="normal"
                                                                                    name="password"
                                                                                    onBlur={handleBlur}
                                                                                    onChange={handleChange}
                                                                                    type='password'
                                                                                    required
                                                                                    value={values.password}
                                                                                    variant="outlined"
                                                                                    color="secondary"
                                                                                />
                                                                            </Grid>
                                                                            <Grid item xs={12} sm={6}>
                                                                                <TextField
                                                                                    error={Boolean(touched.dob && errors.dob)}
                                                                                    helperText={touched.dob && errors.dob}
                                                                                    variant="outlined"
                                                                                    color="secondary"
                                                                                    fullWidth
                                                                                    id="date"
                                                                                    label="Birthday"
                                                                                    type="date"
                                                                                    required
                                                                                    onInput={handleChange}
                                                                                    style={{marginTop: 15}}
                                                                                    defaultValue={new Date()}
                                                                                    className={classes.textField}
                                                                                    InputLabelProps={{
                                                                                        shrink: true,
                                                                                    }}
                                                                                />
                                                                            </Grid>
                                                                            {
                                                                                isManual && (
                                                                                    <>
                                                                                        <Grid item xs={12} sm={12}>
                                                                                            <Typography className={classes.text} variant="subtitle1" gutterBottom>
                                                                                                Restaurant Information
                                                                                            </Typography>
                                                                                            <Divider style={{marginTop: 15, marginBottom: 15}}/>
                                                                                        </Grid>
                                                                                        <Grid item md={6} xs={12}>
                                                                                            <TextField
                                                                                                color="secondary"
                                                                                                fullWidth
                                                                                                label="Restaurant name"
                                                                                                placeholder="Enter Restaurant name"
                                                                                                name="restaurantName"
                                                                                                onChange={handleChange}
                                                                                                required
                                                                                                value={values.restaurantName}
                                                                                                variant="outlined"
                                                                                            />
                                                                                        </Grid>
                                                                                        <Grid item md={6} xs={12}>
                                                                                            <TextField
                                                                                                color="secondary"
                                                                                                multiline
                                                                                                fullWidth
                                                                                                rows={2}
                                                                                                label="Address"
                                                                                                placeholder="Enter Address"
                                                                                                name="address"
                                                                                                onChange={handleChange}
                                                                                                type="text"
                                                                                                required
                                                                                                value={values.address}
                                                                                                variant="outlined"
                                                                                            />
                                                                                        </Grid>
                                                                                        <Grid item md={6} xs={12}>
                                                                                            <TextField
                                                                                                color="secondary"
                                                                                                variant="outlined"
                                                                                                fullWidth
                                                                                                id="opening"
                                                                                                label="Opening"
                                                                                                type="time"
                                                                                                required
                                                                                                value={values.opening}
                                                                                                onInput={handleChange}
                                                                                                InputLabelProps={{
                                                                                                    shrink: true,
                                                                                                }}
                                                                                            />
                                                                                        </Grid>
                                                                                        <Grid item md={6} xs={12}>
                                                                                            <TextField
                                                                                                color="secondary"
                                                                                                variant="outlined"
                                                                                                fullWidth
                                                                                                id="closing"
                                                                                                label="Closing"
                                                                                                type="time"
                                                                                                required
                                                                                                value={values.closing}
                                                                                                onInput={handleChange}
                                                                                                InputLabelProps={{
                                                                                                    shrink: true,
                                                                                                }}
                                                                                            />
                                                                                        </Grid>
                                                                                        <Grid item md={6} xs={12}>
                                                                                            <TextField
                                                                                                color="secondary"
                                                                                                fullWidth
                                                                                                label="Post/Zip Code"
                                                                                                placeholder="Enter Post/Zip Code"
                                                                                                name="postcode"
                                                                                                onChange={handleChange}
                                                                                                type="text"
                                                                                                required
                                                                                                value={values.postcode}
                                                                                                variant="outlined"
                                                                                            />
                                                                                        </Grid>
                                                                                    </>
                                                                                )
                                                                            }
                                                                        </Grid>

                                                                        <Box my={2}>
                                                                            <FormControl required error={!values.condition || !values.authorized} component="fieldset" className={classes.formControl} color="secondary">
                                                                                <FormLabel component="legend">Please Accept</FormLabel>
                                                                                <FormGroup>
                                                                                    <FormControlLabel
                                                                                        value="end"
                                                                                        control={<Checkbox color="secondary" checked={values.condition} onChange={(e)=> setValues({...values, condition: e.target.checked})} />}
                                                                                        label="I agreed to Foodoli’s terms of services and privacy policy."
                                                                                        labelPlacement="end"
                                                                                        name="condition"
                                                                                    />
                                                                                    <FormControlLabel
                                                                                        value="end"
                                                                                        control={<Checkbox color="secondary" checked={values.authorized} onChange={(e)=> setValues({...values, authorized: e.target.checked})} />}
                                                                                        label="I am the authorized person to open this account on behalf of this Restaurant."
                                                                                        labelPlacement="end"
                                                                                        name="condition"
                                                                                    />
                                                                                </FormGroup>
                                                                                {
                                                                                    !values.condition && <FormHelperText>Please accept Foodoli's terms of services and privacy policy.</FormHelperText>
                                                                                }

                                                                                {
                                                                                    !values.authorized && <FormHelperText>Please accept if you are the authorized person to open this account.</FormHelperText>
                                                                                }
                                                                            </FormControl>
                                                                        </Box>
                                                                        <Box my={2}>
                                                                            <Button
                                                                                color="secondary"
                                                                                style={{
                                                                                    color: '#fff',
                                                                                    backgroundColor: '#00a651'
                                                                                }}
                                                                                disabled={isSaving}
                                                                                fullWidth
                                                                                size="large"
                                                                                type="submit"
                                                                                variant="contained"
                                                                                onClick={()=> signUp(values)}
                                                                            >
                                                                                {isSaving ? 'Please wait ...' : 'Sign up now'}
                                                                            </Button>
                                                                        </Box>

                                                                        <Box my={2}>
                                                                            <Button
                                                                                disabled={activeStep === 0}
                                                                                onClick={handleBack}
                                                                                fullWidth
                                                                                size="large"
                                                                                type="submit"
                                                                                variant="contained"
                                                                            >
                                                                                Back
                                                                            </Button>
                                                                        </Box>
                                                                    </form>
                                                                )}
                                                            </Formik>
                                                        </Container>
                                                    </Box>
                                                </Paper>
                                            </Box>
                                        )
                                    }

                                    {
                                        activeStep === 3 && (
                                            <Box mt={4}>
                                                <Typography className={classes.instructions}>
                                                    <Typography variant="h3">{getStepContent(activeStep)}</Typography>
                                                </Typography>
                                                <Paper variant="outlined" elevation={4} style={{padding: 20, marginTop: 20}}>
                                                    <Box m={4} display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                                                        <CheckCircle style={{fontSize: 50, margin: 10, color: '#00a651'}}/>
                                                        <Typography variant="h3">Thank you for signing up. Please check email and confirm registration.</Typography>
                                                    </Box>
                                                    {/*<Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
                                                        Back
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={handleNext}
                                                        className={classes.button}
                                                    >
                                                        {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                                                    </Button>*/}
                                                </Paper>
                                            </Box>
                                        )
                                    }
                                </>
                            }
                        </div>
                    </Box>
                </Container>
            </Page>
        )
    }
)

export default ClaimMyBusiness;
