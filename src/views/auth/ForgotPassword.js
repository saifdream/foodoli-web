import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Toast from "../../components/Toast";
import {authFormHeader} from "../../_helpers/auth-header";
import fetch from "cross-fetch";
import {API, getHttpErrorMessage} from "../../constant";

const ForgotPassword = ({handleCloseSignInDialog}) => {
    const [open, setOpen] = React.useState(false);
    const [isToastOpen, setIsToastOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState('');
    const timer = React.useRef();

    const [showBlock, setShowBlock] = useState('Email');
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const getToken = () => {
        if(!email) {
            setIsToastOpen(true);
            setMessage("Please enter your email");
            setType('warning');
            return;
        }

        timer.current = setTimeout(() => {
            setIsLoading(true);
            const formData = new FormData();
            formData.append('email', email);

            const requestOptions = {
                method: 'POST',
                headers: authFormHeader(),
                body: formData,
            };

            fetch(`${API}user/forgot_password`, requestOptions).then((response) => {
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
                        setMessage(data?.message || "Please check your email for token.");
                        setType('success');
                        setShowBlock('Token');
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
                setIsLoading(false);
            });
        })
    }

    const verifyToken = () => {
        if(!token) {
            setIsToastOpen(true);
            setMessage("Please enter your token");
            setType('warning');
            return;
        }

        timer.current = setTimeout(() => {
            setIsLoading(true);
            const formData = new FormData();
            formData.append('email', email);
            formData.append('token', token);

            const requestOptions = {
                method: 'POST',
                headers: authFormHeader(),
                body: formData,
            };

            fetch(`${API}user/verify_token`, requestOptions).then((response) => {
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
                        setMessage(data?.message);
                        setType('success');
                        setShowBlock('Password');
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
                setIsLoading(false);
            });
        })
    }

    const resetPassword = () => {
        if(!password && !confirmPassword) {
            setIsToastOpen(true);
            setMessage("Please enter your password");
            setType('warning');
            return;
        }

        if(password !== confirmPassword) {
            setIsToastOpen(true);
            setMessage("Password does not match.");
            setType('warning');
            return;
        }

        timer.current = setTimeout(() => {
            setIsLoading(true);
            const formData = new FormData();
            formData.append('email', email);
            formData.append('password', password);
            formData.append('confirmPassword', confirmPassword);

            const requestOptions = {
                method: 'POST',
                headers: authFormHeader(),
                body: formData,
            };

            fetch(`${API}user/reset_password`, requestOptions).then((response) => {
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
                        setMessage(data?.message);
                        setType('success');
                        setShowBlock('Email');
                        setTimeout(()=> handleCloseSignInDialog(), 1000);
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
                setIsLoading(false);
            });
        })
    }

    React.useEffect(() => {
        return () => {
            clearTimeout(timer.current);
        };
    }, []);

    const handleClickOpenForgotPassword = () => {
        setOpen(true);
    };

    const handleCloseForgotPassword = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button variant="text" color="secondary" style={{textTransform: 'capitalize'}} onClick={handleClickOpenForgotPassword}>
                Forgot Password?
            </Button>
            <Dialog maxWidth="xs" open={open} onClose={ForgotPassword} aria-labelledby="form-dialog-title" disableBackdropClick disableEscapeKeyDown>
                <Toast isOpen={isToastOpen} message={message} onClose={() => setIsToastOpen(false)} type={type}/>
                <DialogTitle id="form-dialog-title">Forgot Password?</DialogTitle>
                <DialogContent>
                    {/*<DialogContentText>
                        To subscribe to this website, please enter your email address here. We will send updates
                        occasionally.
                    </DialogContentText>*/}
                    {
                        showBlock === 'Email' && (
                            <TextField
                                color="secondary"
                                autoFocus
                                margin="dense"
                                id="email"
                                label="Email Address"
                                type="email"
                                fullWidth
                                variant="outlined"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        )
                    }

                    {
                        showBlock === 'Token' && (
                            <TextField
                                color="secondary"
                                autoFocus
                                margin="dense"
                                id="token"
                                label="Token"
                                type="text"
                                fullWidth
                                variant="outlined"
                                onChange={(e) => setToken(e.target.value)}
                            />
                        )
                    }

                    {
                        showBlock === 'Password' && (
                            <>
                                <TextField
                                    color="secondary"
                                    autoFocus
                                    margin="dense"
                                    id="password"
                                    label="Password"
                                    type="password"
                                    fullWidth
                                    variant="outlined"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <TextField
                                    color="secondary"
                                    autoFocus
                                    margin="dense"
                                    id="confirmPassword"
                                    label="Confirm Password"
                                    type="password"
                                    fullWidth
                                    variant="outlined"
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </>
                        )
                    }
                </DialogContent>
                <DialogActions style={{marginRight: 10}}>
                    <Button onClick={handleCloseForgotPassword} color="secondary" style={{textTransform: 'capitalize'}}>
                        Cancel
                    </Button>
                    {
                        showBlock === 'Email' && (
                            <Button onClick={getToken} color="secondary" style={{textTransform: 'capitalize'}}>
                                Get Code
                            </Button>
                        )
                    }
                    {
                        showBlock === 'Token' && (
                            <Button onClick={verifyToken} color="secondary" style={{textTransform: 'capitalize'}}>
                                Verify Token
                            </Button>
                        )
                    }
                    {
                        showBlock === 'Password' && (
                            <Button onClick={resetPassword} color="secondary" style={{textTransform: 'capitalize'}}>
                                Reset Password
                            </Button>
                        )
                    }
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default ForgotPassword;
