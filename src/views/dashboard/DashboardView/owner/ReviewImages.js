import React, {memo, useState} from "react";
import Page from "../../../../components/Page";
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Grid,
    GridListTileBar,
    LinearProgress,
    makeStyles,
    Typography
} from "@material-ui/core";
import {authFormHeader, authHeader} from "../../../../_helpers/auth-header";
import fetch from "cross-fetch";
import {API, getHttpErrorMessage, IMAGE_URL} from "../../../../constant";
import {useSelector} from "react-redux";
import Divider from "@material-ui/core/Divider";
import Toast from "../../../../components/Toast";
import dateFormat from "dateformat";
import Button from "@material-ui/core/Button";
import GridListTile from "@material-ui/core/GridListTile";
import GridList from "@material-ui/core/GridList";

const useStyles = makeStyles((theme) => ({
    root: {
        width: 500,
        // maxWidth: '500px',
        backgroundColor: theme.palette.background.paper,
    },
    gridList: {
        width: 500,
        height: '100%',
    },
    icon: {
        color: 'rgba(255, 255, 255, 0.54)',
    },
}));

const ReviewImages = memo(
    () => {
        const classes = useStyles();

        const {user} = useSelector(state => state.user);
        const [isToastOpen, setIsToastOpen] = useState(false);
        const [isSaving, setIsSaving] = useState(false);
        const [isLoading, setIsLoading] = useState(false);
        const [message, setMessage] = useState('');
        const [type, setType] = useState('info');
        const timer = React.useRef();

        const [selectedFiles, setSelectedFiles] = useState();
        const [previewUrl, setPreviewUrl] = useState();

        const [reviewImages, setReviewImages] = useState([]);

        const getData = () => {
            timer.current = window.setTimeout(() => {
                setIsLoading(true);
                const requestOptions = {
                    method: "GET",
                    headers: authHeader(),
                };

                fetch(`${API}special/review_image_list/${user?.rest_id}`, requestOptions).then((response) => {
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
                        if(data.review_images?.length) {
                            setReviewImages(data.review_images);
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

        const uploadImage= () => {
            if (!selectedFiles) {
                setIsToastOpen(true);
                setMessage("Please select an image!");
                setType('warning');
                return;
            }

            timer.current = window.setTimeout(() => {
                setIsSaving(true);
                let formData = new FormData();
                formData.append('rest_id', user?.rest_id);
                if (selectedFiles)
                    formData.append('image', selectedFiles[0]);

                const requestOptions = {
                    method: "POST",
                    headers: authFormHeader(),
                    body: formData,
                };

                fetch(`${API}special/add_review_image/${user?.id}/${user?.rest_id}`, requestOptions).then((response) => {
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
                            getData();
                            setIsToastOpen(true);
                            setMessage(data?.message || 'Successful');
                            setType('success');
                            setTimeout(()=> {
                                setSelectedFiles(null);
                                setPreviewUrl(null);
                            }, 300)
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
            getData();
            return () => {
                clearTimeout(timer.current);
            };
        }, []);

        return (
            <Page title="Review Images">
                <Box m={4}>
                    <Toast isOpen={isToastOpen} message={message} onClose={() => setIsToastOpen(false)} type={type}/>
                    <Typography variant="h4" style={{textAlign: 'center', marginBottom: 15}}>Restaurant Review Images</Typography>
                    <Divider/>
                    <Grid container spacing={3}>
                        <Grid item md={6} sm={12} xs={12}>
                            {isLoading && <LinearProgress color="secondary"/>}
                            <Box m={2} display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                                {
                                    reviewImages.length === 0 && <Typography variant="body1">No review images.</Typography>
                                }
                                <GridList cellHeight={200} className={classes.gridList}>
                                    {reviewImages.map((img) => (
                                        <GridListTile key={img.id}>
                                            <img src={`${IMAGE_URL}review_images/${img?.image}`} alt="Photo" />
                                            <GridListTileBar
                                                title={`By: ${img?.first_name} ${img?.last_name}`}
                                                subtitle={<span>{dateFormat(img?.created_at, "dddd, mmmm dS, yyyy, h:MM:ss TT")}</span>}
                                            />
                                        </GridListTile>
                                    ))}
                                </GridList>
                            </Box>
                        </Grid>
                        <Grid item md={6} sm={12} xs={12}>
                            <Box m={2}>
                                <Card>
                                    {isSaving && <LinearProgress color="secondary"/>}
                                    <CardHeader title="Upload Image"/>
                                    <Divider/>
                                    <CardContent>
                                        <form autoComplete="off" noValidate>
                                            <Grid
                                                container
                                                spacing={3}
                                            >
                                                <Grid item md={12} xs={12}>
                                                    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                                                        <input
                                                            accept="image/*"
                                                            style={{display: 'none'}}
                                                            id="attachment"
                                                            multiple
                                                            type="file"
                                                            onChange={(e) => {
                                                                try {
                                                                    setSelectedFiles(e.target.files);
                                                                    let reader = new FileReader();
                                                                    reader.onloadend = () => {
                                                                        setPreviewUrl(reader.result);
                                                                    }
                                                                    reader.readAsDataURL(e.target.files[0]);
                                                                } catch (e) {
                                                                    console.log(e)
                                                                }
                                                            }}
                                                        />
                                                        <label htmlFor="attachment" style={{marginBottom: 15}}>
                                                            <Button variant="contained" color="primary" component="span">
                                                                Attachment
                                                            </Button>
                                                        </label>
                                                        {
                                                            previewUrl && (
                                                                <>
                                                                    <img
                                                                        style={{height: 300, width: 400}}
                                                                        src={previewUrl}
                                                                        alt="Attachment"
                                                                    />
                                                                    <Button
                                                                        style={{marginTop: 5}}
                                                                        onClick={()=> {
                                                                            setSelectedFiles(null);
                                                                            setPreviewUrl(null);
                                                                        }}
                                                                    >
                                                                        Clear
                                                                    </Button>
                                                                </>
                                                            )
                                                        }
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </form>
                                    </CardContent>
                                    <Divider/>
                                    <Box display="flex" justifyContent="flex-end" p={2}>
                                        <Button
                                            color="secondary"
                                            variant="contained"
                                            onClick={uploadImage}
                                            disabled={isSaving}
                                            size="large"
                                        >
                                            Save details
                                        </Button>
                                    </Box>
                                </Card>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Page>
        )
    }
)

export default ReviewImages;
