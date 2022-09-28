import React, {memo, useState} from "react";
import Page from "../../../components/Page";
import Box from "@material-ui/core/Box";
import {Card, CardContent, CardHeader, Grid, LinearProgress, makeStyles, TextField} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {authFormHeader} from "../../../_helpers/auth-header";
import {API, getHttpErrorMessage} from "../../../constant";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import Toast from "../../../components/Toast";
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

const Settings = memo(
    () => {
        const classes = useStyles();
        const [isSaving, setIsSaving] = useState(false);
        // const [isLoading, setIsLoading] = useState(false);
        const [isToastOpen, setIsToastOpen] = useState(false);
        const [message, setMessage] = useState('');
        const [type, setType] = useState('');
        const timer = React.useRef();
        const {user} = useSelector(state => state.user);
        const [values, setValues] = useState({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        });

        const dispatch = useDispatch();

        const handleChange = (event) => {
            setValues({
                ...values,
                [event.target.name]: event.target.value
            });
        };

        const updatePassword = () => {
            if (!values.currentPassword || !values.newPassword || !values.confirmPassword) {
                setIsToastOpen(true);
                setMessage("Please give required !");
                setType('warning');
                return;
            }

            if (values.confirmPassword !== values.newPassword) {
                setIsToastOpen(true);
                setMessage("Password doesn't match !");
                setType('warning');
                return;
            }

            timer.current = window.setTimeout(() => {
                setIsSaving(true);
                let formData = new FormData();
                formData.append('user_id', user?.id);
                formData.append('current_password', values.currentPassword.trim());
                formData.append('new_password', values.newPassword.trim());

                const requestOptions = {
                    method: "POST",
                    headers: authFormHeader(),
                    body: formData,
                };

                fetch(`${API}user/change_password`, requestOptions).then((response) => {
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

        React.useEffect(() => {
            return () => {
                clearTimeout(timer.current);
            };
        }, [dispatch]);

        return (
            <Page title="Foodoli | My Profile">
                <Box m={4} maxWidth="sm">
                    <form autoComplete="off" noValidate>
                        <Toast isOpen={isToastOpen} message={message} onClose={() => setIsToastOpen(false)} type={type}/>
                        {isSaving && <LinearProgress color="secondary"/>}
                        <Card>
                            <CardHeader
                                subheader="The information can be edited"
                                title="Change Password"
                            />
                            <Divider/>
                            <CardContent>
                                <Grid
                                    container
                                    spacing={3}
                                >
                                    <Grid
                                        item
                                        md={12}
                                        xs={12}
                                    >
                                        <TextField
                                            color="secondary"
                                            fullWidth
                                            //helperText="Please specify the first name"
                                            label="Current Password"
                                            name="currentPassword"
                                            onChange={handleChange}
                                            required
                                            value={values.currentPassword}
                                            variant="outlined"
                                            type="password"
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        md={12}
                                        xs={12}
                                    >
                                        <TextField
                                            color="secondary"
                                            fullWidth
                                            //helperText="Please specify the last name"
                                            label="New Password"
                                            name="newPassword"
                                            onChange={handleChange}
                                            required
                                            value={values.newPassword}
                                            variant="outlined"
                                            type="password"
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        md={12}
                                        xs={12}
                                    >
                                        <TextField
                                            color="secondary"
                                            fullWidth
                                            label="Confirm Password"
                                            name="confirmPassword"
                                            onChange={handleChange}
                                            required
                                            value={values.confirmPassword}
                                            variant="outlined"
                                            type="password"
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
                                    onClick={updatePassword}
                                    disabled={isSaving}
                                    size="large"
                                >
                                    Change Password
                                </Button>
                            </Box>
                        </Card>
                    </form>
                </Box>
            </Page>
        )
    }
)

export default Settings;
