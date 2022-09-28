import React, {memo, useEffect, useState} from "react";
import Page from "../../../components/Page";
import Box from "@material-ui/core/Box";
import {Card, CardContent, CardHeader, Grid, LinearProgress, makeStyles, TextField, Typography} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {authFormHeader, authHeader} from "../../../_helpers/auth-header";
import {API, getHttpErrorMessage, IMAGE_URL} from "../../../constant";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import Toast from "../../../components/Toast";
import Avatar from "@material-ui/core/Avatar";
import {userActions} from "../../../store/actions/user";
import fetch from 'cross-fetch';

const useStyles = makeStyles((theme) => ({
    root: {},
    avatar: {
        width: theme.spacing(20),
        height: theme.spacing(20),
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
        '&:hover': {
            background: '#00a651',
        },
    }
}));

const MyProfile = memo(
    () => {
        const classes = useStyles();
        const dispatch = useDispatch();

        const [isSaving, setIsSaving] = useState(false);
        const [isLoading, setIsLoading] = useState(false);
        const [isToastOpen, setIsToastOpen] = useState(false);
        const [message, setMessage] = useState('');
        const [type, setType] = useState('');
        const timer = React.useRef();
        const {user} = useSelector(state => state.user);
        const [selectedFiles, setSelectedFiles] = useState();
        const [imagePreviewUrl, setImagePreviewUrl] = useState();
        const [values, setValues] = useState({
            id: user?.id,
            clientId: user?.client_id,
            firstName: user?.first_name,
            lastName: user?.last_name,
            contact: user?.contact,
            dob: user?.dob,
            email: user?.email,
            gender: user?.gender,
            profilePicture: user?.profile_pic,
        });

        const handleChange = (event) => {
            setValues({
                ...values,
                [event.target.name]: event.target.value
            });
        };

        const getUserData = () => {
            timer.current = window.setTimeout(() => {
                setIsLoading(true);
                const requestOptions = {
                    method: "GET",
                    headers: authHeader(),
                };

                fetch(`${API}user_info`, requestOptions).then((response) => {
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
                            //console.log(error);
                            setIsToastOpen(true);
                            setMessage(error);
                            setType('error');
                            return;
                        }

                        // client_id: "923906"
                        // rest_id: null
                        // status: 1
                        // type: "3"
                        //console.log(data)
                        dispatch(userActions.setUser({...user, user: data}));
                        setValues({
                            ...values,
                            clientId: data?.client_id,
                            firstName: data?.first_name,
                            lastName: data?.last_name,
                            contact: data?.contact,
                            dob: data?.dob,
                            email: data?.email,
                            gender: data?.gender,
                            profilePicture: data?.profile_pic,
                        })
                    });
                }).catch((err) => {
                    setIsToastOpen(true);
                    setMessage('Please check your connectivity!');
                    setType('error');
                }).finally(() => {
                    setIsLoading(false);
                });
            })
        }

        const updateProfile = () => {
            if (!values.firstName || !values.lastName || !values.email || !values.contact) {
                setIsToastOpen(true);
                setMessage("Please give required !");
                setType('warning');
                return;
            }

            timer.current = window.setTimeout(() => {
                setIsSaving(true);
                let formData = new FormData();
                formData.append('user_id', user?.id);
                formData.append('first_name', values.firstName.trim());
                formData.append('last_name', values.lastName.trim());
                formData.append('email', values.email.trim());
                formData.append('contact', values.contact.trim());
                formData.append('gender', values.gender);
                formData.append('dob', values.dob);
                //formData.append('password', this.form.value.password.trim());
                if (selectedFiles)
                    formData.append('image', selectedFiles[0]);

                const requestOptions = {
                    method: "POST",
                    headers: authFormHeader(),
                    body: formData,
                };

                fetch(`${API}user/edit_user`, requestOptions).then((response) => {
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
                            //console.log(error);
                            setIsToastOpen(true);
                            setMessage(error);
                            setType('error');
                            return;
                        }

                        if(data?.success) {
                            getUserData();
                            setImagePreviewUrl(null);
                            setSelectedFiles(null);
                            setIsToastOpen(true);
                            setMessage('Successfully Updated');
                            setType('success');
                        }

                        if(!data?.success) {
                            setIsToastOpen(true);
                            setMessage('Something went wrong!');
                            setType('error');
                        }
                    });
                }).catch((err) => {
                    setIsToastOpen(true);
                    setMessage('Please check your connectivity!');
                    setType('error');
                }).finally(() => {
                    setIsSaving(false);
                });
            })
        }

        useEffect(() => {
            getUserData();
            return () => {
                clearTimeout(timer.current);
            };
        }, [dispatch]);

        return (
            <Page title="Foodoli | My Profile">
                <Box m={4}>
                    <form autoComplete="off" noValidate>
                        <Toast isOpen={isToastOpen} message={message} onClose={() => setIsToastOpen(false)} type={type}/>
                        {(isLoading || isSaving) && <LinearProgress color="secondary"/>}
                        <Card>
                            <CardHeader
                                subheader="The information can be edited"
                                title="Profile"
                            />
                            <Divider/>
                            <CardContent>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={12}>
                                        <Box
                                            alignItems="center"
                                            display="flex"
                                            flexDirection="column"
                                        >
                                            {
                                                imagePreviewUrl ?
                                                    <Avatar
                                                        className={classes.avatar}
                                                        src={imagePreviewUrl}
                                                    />
                                                    :
                                                    values?.profilePicture && (
                                                        <Avatar
                                                            className={classes.avatar}
                                                            src={`${IMAGE_URL}users/${values?.profilePicture}`}
                                                        />
                                                    )
                                            }
                                            <input
                                                accept="image/*"
                                                className={classes.input}
                                                id="contained-button-file"
                                                type="file"
                                                onChange={(e) => {
                                                    setSelectedFiles(e.target.files);
                                                    let reader = new FileReader();
                                                    reader.onloadend = () => {
                                                        setImagePreviewUrl(reader.result);
                                                    }
                                                    reader.readAsDataURL(e.target.files[0])
                                                }}
                                            />
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <Box
                                            alignItems="center"
                                            display="flex"
                                            flexDirection="column"
                                        >
                                            <Typography variant="h6">Client ID: {values?.clientId}</Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            color="secondary"
                                            fullWidth
                                            //helperText="Please specify the first name"
                                            label="First name"
                                            name="firstName"
                                            onChange={handleChange}
                                            required
                                            value={values?.firstName}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            color="secondary"
                                            fullWidth
                                            //helperText="Please specify the last name"
                                            label="Last name"
                                            name="lastName"
                                            onChange={handleChange}
                                            required
                                            value={values?.lastName}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            color="secondary"
                                            fullWidth
                                            label="Email Address"
                                            name="email"
                                            onChange={handleChange}
                                            required
                                            value={values?.email}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            color="secondary"
                                            fullWidth
                                            label="Phone Number"
                                            name="contact"
                                            onChange={handleChange}
                                            type="text"
                                            value={values?.contact}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        md={6}
                                        xs={12}
                                    >
                                        <TextField
                                            color="secondary"
                                            fullWidth
                                            label="Gender"
                                            name="gender"
                                            onChange={handleChange}
                                            required
                                            select
                                            SelectProps={{native: true}}
                                            value={values?.gender}
                                            variant="outlined"
                                        >
                                            {
                                                [
                                                    {label: '', value: ''},
                                                    {label: 'Male', value: 'Male'},
                                                    {label: 'Female', value: 'Female'},
                                                    {label: 'Others', value: 'Others'},
                                                ]
                                                    .map((option) => (
                                                        <option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))
                                            }
                                        </TextField>
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            color="secondary"
                                            variant="outlined"
                                            fullWidth
                                            id="date"
                                            label="Birthday"
                                            type="date"
                                            defaultValue={new Date()}
                                            value={values?.dob}
                                            onInput={(e)=> setValues({...values, dob: e.target.value})}
                                            className={classes.textField}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                            <Divider/>
                            <Box
                                display="flex"
                                justifyContent="flex-end"
                                p={2}
                            >
                                <Button
                                    color="secondary"
                                    variant="contained"
                                    onClick={updateProfile}
                                    disabled={isSaving}
                                    size="large"
                                >
                                    Save details
                                </Button>
                            </Box>
                        </Card>
                    </form>
                </Box>
            </Page>
        )
    }
)

export default MyProfile;
