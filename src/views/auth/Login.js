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
    makeStyles, InputAdornment, IconButton
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Avatar from '@material-ui/core/Avatar';
import {setFoodoli, setToken} from '../../common/localStorage';
import {useDispatch, useSelector} from 'react-redux';
import {Close, Visibility, VisibilityOff} from '@material-ui/icons';
import {API, getHttpErrorMessage} from '../../constant';
import {User} from "react-feather";
import {authFormHeader} from "../../_helpers/auth-header";
import {userActions} from "../../store/actions/user";
import Toast from "../../components/Toast";
import fetch from 'cross-fetch';
import ForgotPassword from "./ForgotPassword";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.dark,
        height: '100%',
        paddingBottom: theme.spacing(3),
        paddingTop: theme.spacing(3)
    },
    avatar: {
        textTransform: 'capitalize',
        color: '#fff',
        backgroundColor: '#00a651',
        //backgroundColor: theme.palette.icon.default,
        height: 35,
        width: 35,
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

const LoginView = memo(
    ({handleCloseSignInDialog, openSignIn}) => {
        let loginTimer = null;
        const classes = useStyles();
        //const [open, setOpen] = React.useState(false);
        const [dataValues, setDataValues] = React.useState({
            message: '',
            type: 'error',
            open: false,
            isLoading: false,
        });
        //const state = useSelector(state => state);
        const dispatch = useDispatch();

        const handleClose = (event, reason) => {
            if (reason === 'clickaway') {
                return;
            }
            //setOpen(false);
            setDataValues({...dataValues, open: false});
        };

        const login = (username, password) => {
            loginTimer = setTimeout(() => {
                setDataValues({...dataValues, isLoading: true});
                const data = new FormData();
                data.append('email', username);
                data.append('password', password);

                const requestOptions = {
                    method: 'POST',
                    headers: authFormHeader(),
                    body: data,
                };

                fetch(`${API}user/login`, requestOptions).then((response) => {
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

                        //console.log(data)
                        if (data?.token) {
                            setDataValues({
                                ...dataValues,
                                open: true,
                                message: 'Logged in successfully !',
                                type: 'success'
                            });
                            dispatch(userActions.setUser({...data, status: true}));
                            setToken(data?.token);
                            setFoodoli({...data, status: true});
                            setTimeout(()=> handleCloseSignInDialog(), 1000);
                        }
                    });
                }).catch((err) => {
                    console.log(err)
                    setDataValues({...dataValues, open: true, message: 'Please check your connectivity !', type: 'error'});
                }).finally(()=> {
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
                                username: '',
                                password: '',
                                showPassword: false,
                            }}
                            validationSchema={Yup.object().shape({
                                username: Yup.string().max(255).required('Email/Phone is required'),
                                password: Yup.string().max(255).required('Password is required')
                            })}
                            onSubmit={(values) => {
                                if (!values.username && !values.password)
                                    setDataValues({
                                        ...dataValues,
                                        open: true,
                                        message: 'Email/Phone & Password Required !',
                                        type: 'warning'
                                    });
                                login(values.username, values.password);
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
                                    <Box style={{float: 'right', width: 45}}><IconButton onClick={handleCloseSignInDialog}><Close/></IconButton></Box>
                                    <Grid container justify="center" spacing={1}>
                                        <Grid item>
                                            <Avatar className={classes.avatar}>
                                                <LockOutlinedIcon/>
                                            </Avatar>
                                        </Grid>
                                        <Grid item>
                                            <Typography
                                                color="textPrimary"
                                                variant="h2"
                                            >
                                                Sign in
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    <TextField
                                        error={Boolean(touched.username && errors.username)}
                                        fullWidth
                                        helperText={touched.username && errors.username}
                                        label="Email/Phone"
                                        placeholder="Email/Phone"
                                        margin="normal"
                                        name="username"
                                        onBlur={handleBlur}
                                        className={classes.input}
                                        onChange={handleChange}
                                        type="text"
                                        required
                                        value={values.username}
                                        color="secondary"
                                        variant="outlined"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <User/>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    <TextField
                                        error={Boolean(touched.password && errors.password)}
                                        fullWidth
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
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <LockOutlinedIcon/>
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={() => {
                                                            setValues({...values, showPassword: !values.showPassword});
                                                        }}
                                                        onMouseDown={(event) => {
                                                            event.preventDefault();
                                                        }}
                                                    >
                                                        {values.showPassword ? <Visibility/> : <VisibilityOff/>}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
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
                                            {dataValues.isLoading ? 'Please wait ...' : 'Sign in now'}
                                        </Button>
                                    </Box>
                                    <Typography
                                        color="textPrimary"
                                        variant="body1"
                                        style={{textAlign: 'center'}}
                                    >
                                        Don&apos;t have an account?
                                        {' '}
                                        <Button variant="text" color="secondary" onClick={openSignIn}>
                                            Sign up
                                        </Button>
                                    </Typography>

                                    <Typography
                                        color="textPrimary"
                                        variant="body1"
                                        style={{textAlign: 'center'}}
                                    >
                                        <ForgotPassword handleCloseSignInDialog={handleCloseSignInDialog}/>
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

export default LoginView;
