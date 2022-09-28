import React, {memo, useState} from "react";
import Page from "../../../../components/Page";
import Box from "@material-ui/core/Box";
import {Card, CardContent, CardHeader, Grid, LinearProgress, makeStyles, Typography} from "@material-ui/core";
import Toast from "../../../../components/Toast";
import {authFormHeader, authHeader} from "../../../../_helpers/auth-header";
import fetch from "cross-fetch";
import {API, getHttpErrorMessage, IMAGE_URL} from "../../../../constant";
import {useSelector} from "react-redux";
import Divider from "@material-ui/core/Divider";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
    root: {},
    banner: {
        width: '75vw',
        height: 300,
    },
    logo: {
        width: 170,
        height: 170,
    },
    input: {
        padding: 10,
        '&:blur': {
            borderColor: '1px solid #00a651',
        },
        '&:focus': {
            borderColor: '1px solid #00a651',
        },
    },
}));

const LogoBanner = memo(
    () => {
        const classes = useStyles();
        const {user} = useSelector(state => state.user);
        const [isToastOpen, setIsToastOpen] = useState(false);
        const [isSaving, setIsSaving] = useState(false);
        const [isLoading, setIsLoading] = useState(false);
        const [message, setMessage] = useState('');
        const [type, setType] = useState('');
        const [selectedBannerFiles, setSelectedBannerFiles] = useState();
        const [bannerPreviewUrl, setBannerPreviewUrl] = useState();
        const [remoteBanner, setRemoteBanner] = useState();
        const [selectedLogoFiles, setSelectedLogoFiles] = useState();
        const [logoPreviewUrl, setLogoPreviewUrl] = useState();
        const [remoteLogo, setRemoteLogo] = useState();
        const timer = React.useRef();

        const getData = () => {
            timer.current = window.setTimeout(() => {
                setIsLoading(true);
                const requestOptions = {
                    method: "GET",
                    headers: authHeader(),
                };

                fetch(`${API}show_logo_banner/${user?.rest_id}`, requestOptions).then((response) => {
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
                            setRemoteBanner(data[0]['banner']);
                            setRemoteLogo(data[0]['logo']);
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

        const updateDate = () => {
            if (!selectedBannerFiles?.length || !selectedLogoFiles?.length) {
                setIsToastOpen(true);
                setMessage("Nothing selected!");
                setType('warning');
                return;
            }

            timer.current = window.setTimeout(() => {
                setIsSaving(true);
                let formData = new FormData();
                formData.append('rest_id', user?.rest_id);
                if (selectedBannerFiles)
                    formData.append('banner', selectedBannerFiles[0]);
                if (selectedLogoFiles)
                    formData.append('logo', selectedLogoFiles[0]);

                const requestOptions = {
                    method: "POST",
                    headers: authFormHeader(),
                    body: formData,
                };

                fetch(`${API}logo_banner_upload`, requestOptions).then((response) => {
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

                        if(data?.success) {
                            setBannerPreviewUrl(null);
                            setSelectedBannerFiles(null);
                            setRemoteBanner(null);
                            setLogoPreviewUrl(null);
                            setSelectedLogoFiles(null);
                            setRemoteLogo(null);

                            timer.current = window.setTimeout(()=> getData(), 1000);

                            setMessage('Successfully Updated');
                            setType('success');
                            setIsToastOpen(true);
                        }

                        if(!data?.success) {
                            setIsToastOpen(true);
                            setMessage('Something went wrong!');
                            setType('error');
                        }
                    });
                }).catch((err) => {
                    console.log(err)
                    setMessage('Something went wrong!');
                    setType('error');
                    setIsToastOpen(true);
                }).finally(() => {
                    setIsSaving(false);
                });
            })
        }

        React.useEffect(() => {
            getData();
            return () => {
                if(timer.current)
                    clearTimeout(timer.current);
            };
        }, []);

        return (
            <Page title="Logo & Banner">
                <Box m={4}>
                    <form autoComplete="off" noValidate>
                        <Toast isOpen={isToastOpen} message={message} onClose={() => setIsToastOpen(false)} type={type}/>
                        {(isLoading || isSaving) && <LinearProgress color="secondary"/>}

                        <Card>
                            <CardHeader
                                subheader="The information can be edited"
                                title="Logo & Banner"
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
                                                bannerPreviewUrl ?
                                                    <img
                                                        className={classes.banner}
                                                        src={bannerPreviewUrl}
                                                        alt="Banner"
                                                    />
                                                    :
                                                    remoteBanner && (
                                                        <img
                                                            className={classes.banner}
                                                            src={`${IMAGE_URL}banners/${remoteBanner}`}
                                                            alt="Banner"
                                                        />
                                                    )
                                            }
                                            <input
                                                accept="image/*"
                                                className={classes.input}
                                                id="contained-button-file"
                                                type="file"
                                                value={selectedBannerFiles}
                                                onChange={(e) => {
                                                    setSelectedBannerFiles(e.target.files);
                                                    let reader = new FileReader();
                                                    reader.onloadend = () => {
                                                        setBannerPreviewUrl(reader.result);
                                                    }
                                                    reader.readAsDataURL(e.target.files[0]);
                                                }}
                                            />
                                            <Typography variant="caption">Recommended size: 1900px X 300px</Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <Box
                                            alignItems="center"
                                            display="flex"
                                            flexDirection="column"
                                        >
                                            {
                                                logoPreviewUrl ?
                                                    <Avatar
                                                        className={classes.logo}
                                                        src={logoPreviewUrl}
                                                    />
                                                    :
                                                    remoteLogo && (
                                                        <Avatar
                                                            className={classes.logo}
                                                            src={`${IMAGE_URL}logos/${remoteLogo}`}
                                                        />
                                                    )
                                            }
                                            <input
                                                accept="image/*"
                                                className={classes.input}
                                                id="contained-button-file"
                                                type="file"
                                                onChange={(e) => {
                                                    setSelectedLogoFiles(e.target.files);
                                                    let reader = new FileReader();
                                                    reader.onloadend = () => {
                                                        setLogoPreviewUrl(reader.result);
                                                    }
                                                    reader.readAsDataURL(e.target.files[0])
                                                }}
                                            />
                                        </Box>
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
                                    onClick={updateDate}
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

export default LogoBanner;
