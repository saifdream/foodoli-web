import React, {memo} from 'react';
import {Link as RouterLink} from 'react-router-dom';
import * as Yup from 'yup';
import {Formik} from 'formik';
import {
    Box,
    Button,
    Container,
    Grid,
    Link,
    TextField,
    Typography,
    makeStyles, IconButton, Select, MenuItem, InputLabel, FormControl
} from '@material-ui/core';
import {useDispatch, useSelector} from 'react-redux';
import {Close} from '@material-ui/icons';
import {API, getHttpErrorMessage} from '../../constant';
import {authFormHeader} from "../../_helpers/auth-header";
import Toast from "../../components/Toast";
import fetch from 'cross-fetch';

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.dark,
        height: '100%',
        paddingBottom: theme.spacing(3),
        paddingTop: theme.spacing(3)
    },
    avatar: {
        backgroundColor: theme.palette.icon.default,
        height: 35,
        width: 35,
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        //width: 200,
    },
    input: {
        '&:blur': {
            borderColor: '1px solid #00a651',
        },
        '&:focus': {
            borderColor: '1px solid #00a651',
        },
    },
    button: {
        textTransform: 'capitalize',
        color: '#fff',
        backgroundColor: '#00a651',
        '&:hover': {
            background: '#00a651',
        },
    }
}));

const SignUpView = memo(
    ({handleCloseSignUpDialog}) => {
        let signUpTimer = null;
        const classes = useStyles();

        const [dataValues, setDataValues] = React.useState({
            message: '',
            type: 'error',
            open: false,
            isLoading: false,
        });

        const dispatch = useDispatch();

        const handleClose = (event, reason) => {
            if (reason === 'clickaway') {
                return;
            }
            //setOpen(false);
            setDataValues({...dataValues, open: false});
        };

        const signUp = (values) => {
            if (!values.email && !values.contact && !values.password && !values.firstName && !values.lastName) {
                setDataValues({
                    ...dataValues,
                    open: true,
                    message: 'Please give required information!',
                    type: 'warning'
                });
                return
            }

            if (values.password !== values.confirmPassword) {
                setDataValues({
                    ...dataValues,
                    open: true,
                    message: 'Password does not match!',
                    type: 'warning'
                });
                return;
            }

            signUpTimer = setTimeout(() => {
                setDataValues({...dataValues, isLoading: true});
                const formData = new FormData();
                formData.append('first_name', values.firstName.trim());
                formData.append('last_name', values.lastName.trim());
                formData.append('email', values.email.trim());
                formData.append('contact', values.contact.trim());
                formData.append('dob', values.dob.trim());
                formData.append('password', values.password.trim());

                const requestOptions = {
                    method: 'POST',
                    headers: authFormHeader(),
                    body: formData,
                };

                fetch(`${API}user/register`, requestOptions).then((response) => {
                    //console.log(response)
                    response.text().then(res => {
                        let data = "";
                        try {
                            data = res && JSON.parse(res);
                        } catch (e) {
                            setDataValues({
                                ...dataValues,
                                open: true,
                                message: getHttpErrorMessage(response, e),
                                type: 'error'
                            });
                            return;
                        }

                        if (!response.ok) {
                            if (response.status === 401) {
                                setDataValues({
                                    ...dataValues,
                                    open: true,
                                    message: data?.error || getHttpErrorMessage(response),
                                    type: 'error'
                                });
                                return;
                            }

                            const error = data?.error || data?.message || getHttpErrorMessage(response);
                            //console.log(error);
                            setDataValues({...dataValues, open: true, message: error, type: 'error'});
                            return;
                        }

                        console.log(data)
                        if(data?.success) {
                            setDataValues({
                                ...dataValues,
                                open: true,
                                message: data?.message || "Thanks for signing up! Please check your email to complete your registration.",
                                type: 'success'
                            });
                            setTimeout(() => handleCloseSignUpDialog(), 2000);
                        } else if (!data?.success)
                            setDataValues({
                                ...dataValues,
                                open: true,
                                message: data?.message,
                                type: 'warning'
                            });
                    });
                }).catch((err) => {
                    console.log(err)
                    setDataValues({...dataValues, open: true, message: 'Please check your connectivity !', type: 'error'});
                }).finally(() => {
                    setDataValues({...dataValues, isLoading: false});
                });
            })
        }

        return (
            <Box>
                <Toast isOpen={dataValues.open} message={dataValues.message} type={dataValues.type} onClose={handleClose} />
                <Box
                    display="flex"
                    flexDirection="column"
                    height="100%"
                    justifyContent="center"
                >
                    <Container maxWidth="sm">
                        <Formik
                            initialValues={{
                                firstName: '',
                                lastName: '',
                                email: '',
                                contact: '',
                                password: '',
                                dob: '',
                                gender: '',
                                showPassword: false,
                            }}
                            validationSchema={Yup.object().shape({
                                firstName: Yup.string().max(255).required('First Name is required'),
                                lastName: Yup.string().max(255).required('Last Name is required'),
                                email: Yup.string().email('Invalid email').required('Email is required'),
                                contact: Yup.string().required('Contact is required'),
                                password: Yup.string().max(255).required('Password is required'),
                                confirmPassword: Yup.string().max(255).required('Confirm Password is required'),
                                dob: Yup.date().default(function () {return new Date();}),
                                gender: Yup.string(),
                            })}
                            onSubmit={(values) => {
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
                                  setValues
                              }) => (
                                <form onSubmit={handleSubmit}>
                                    <Box style={{float: 'right', width: 45}}><IconButton onClick={handleCloseSignUpDialog}><Close/></IconButton></Box>
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
                                                    Foodoli wants to know about you so that it can direct you to restaurants
                                                    offering special dishes you'll love.
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                    <Grid container>
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
                                                type={values.showPassword ? 'text' : 'password'}
                                                required
                                                value={values.password}
                                                variant="outlined"
                                                color="secondary"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                                                helperText={touched.confirmPassword && errors.confirmPassword}
                                                label="Confirm Password"
                                                placeholder="Confirm Password"
                                                margin="normal"
                                                name="confirmPassword"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                type={values.showPassword ? 'text' : 'password'}
                                                required
                                                value={values.confirmPassword}
                                                variant="outlined"
                                                className={classes.textField}
                                                color="secondary"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <FormControl variant="outlined" fullWidth color="secondary">
                                                <InputLabel id="select-outlined-label" style={{zIndex: 9999}}>Gender</InputLabel>
                                                <Select
                                                    labelId="select-outlined-label"
                                                    label="Gender"
                                                    id="select-outlined-label"
                                                    value={values.gender}
                                                    name="gender"
                                                    onChange={handleChange}
                                                >
                                                    <MenuItem value="">
                                                        <em>Gender</em>
                                                    </MenuItem>
                                                    <MenuItem value="Men">Men</MenuItem>
                                                    <MenuItem value="Woman">Woman</MenuItem>
                                                    <MenuItem value="Others">Others</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                variant="outlined"
                                                color="secondary"
                                                fullWidth
                                                id="date"
                                                label="Birthday"
                                                type="date"
                                                required
                                                defaultValue={new Date()}
                                                className={classes.textField}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                        </Grid>
                                    </Grid>

                                    <Box my={2}>
                                        <Button
                                            color="secondary"
                                            className={classes.button}
                                            disabled={dataValues.isLoading}
                                            fullWidth
                                            size="large"
                                            type="submit"
                                            variant="contained"
                                        >
                                            {dataValues.isLoading ? 'Please wait ...' : 'Sign up now'}
                                        </Button>
                                    </Box>
                                    {/*<Typography
                                    color="textSecondary"
                                    variant="body1"
                                    style={{textAlign: 'center'}}
                                >
                                    Don&apos;t have an account?
                                    {' '}
                                    <Link
                                        color="secondary"
                                        component={RouterLink}
                                        to="/register"
                                        variant="h6"
                                    >
                                        Sign in
                                    </Link>
                                </Typography>*/}
                                    <Typography
                                        color="textPrimary"
                                        variant="body1"
                                        style={{textAlign: 'center'}}
                                    >
                                        Are you a restaurant owner?
                                        {' '}
                                        <Link
                                            color="secondary"
                                            component={RouterLink}
                                            to="/claim"
                                            variant="h6"
                                            onClick={handleCloseSignUpDialog}
                                        >
                                            Claim your business
                                        </Link>
                                    </Typography>
                                </form>
                            )}
                        </Formik>
                    </Container>
                </Box>
            </Box>
        );
    }
)

export default SignUpView;
