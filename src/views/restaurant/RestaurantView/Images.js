import React, {memo, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import {Box, Card, CardContent, CardHeader, Grid, GridListTileBar, LinearProgress, Paper} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {API, getHttpErrorMessage, IMAGE_URL} from "../../../constant";
import Typography from "@material-ui/core/Typography";
import dateFormat from "dateformat";
import {authFormHeader} from "../../../_helpers/auth-header";
import fetch from "cross-fetch";
import {getRestaurantReviewImageList} from "../../../store/actions/restaurant";
import {useParams} from "react-router";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import Toast from "../../../components/Toast";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
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

const ImageGridList = memo(
    () => {
        const classes = useStyles();
        const dispatch = useDispatch();
        const params = useParams();
        const reviewImages = useSelector(state => state.restaurants.reviewImages);

        const {user, isLoggedIn} = useSelector(state => state.user);
        const [isToastOpen, setIsToastOpen] = useState(false);
        const [isSaving, setIsSaving] = useState(false);
        const [isLoading, setIsLoading] = useState(false);
        const [message, setMessage] = useState('');
        const [type, setType] = useState('info');
        const timer = React.useRef();

        const [selectedFiles, setSelectedFiles] = useState();
        const [previewUrl, setPreviewUrl] = useState();

        const uploadImage= () => {
            if (!isLoggedIn) {
                setIsToastOpen(true);
                setMessage("Please login first.");
                setType('warning');
                return;
            }
            if (!selectedFiles) {
                setIsToastOpen(true);
                setMessage("Please select an image!");
                setType('warning');
                return;
            }

            timer.current = window.setTimeout(() => {
                setIsSaving(true);
                let formData = new FormData();
                formData.append('rest_id', params?.id);
                if (selectedFiles)
                    formData.append('image', selectedFiles[0]);

                const requestOptions = {
                    method: "POST",
                    headers: authFormHeader(),
                    body: formData,
                };

                fetch(`${API}special/add_review_image/${user?.id}/${params?.id}`, requestOptions).then((response) => {
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
                            dispatch(getRestaurantReviewImageList(params?.id));
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

        return (
            <div className={classes.root}>
                <Toast isOpen={isToastOpen} message={message} onClose={() => setIsToastOpen(false)} type={type}/>
                <Card style={{width: '98%', marginBottom: 10}}>
                    {isSaving && <LinearProgress color="secondary"/>}
                    <Divider/>
                    <CardContent>
                        <form autoComplete="off" noValidate>
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
                                <label htmlFor="attachment" style={{marginBottom: 10}}>
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
                        </form>
                    </CardContent>
                    <Divider/>
                    <Box display="flex" justifyContent="center" p={2}>
                        <Button
                            color="primary"
                            variant="contained"
                            onClick={uploadImage}
                            disabled={isSaving}
                            size="large"
                        >
                            Upload
                        </Button>
                    </Box>
                </Card>
                {
                    (reviewImages && reviewImages.length === 0) && (
                        <Box display="flex" justifyContent="center" mt={2}>
                            <Typography variant="body1">No image found.</Typography>
                        </Box>
                    )
                }

                {
                    (reviewImages && reviewImages.length > 0) && (
                        <Paper elevation={4} variant="elevation" style={{height: '100%', padding: 5}}>
                            <GridList cellHeight={250} className={classes.gridList}>
                                {
                                    reviewImages && reviewImages.map((img) => (
                                        <GridListTile key={img.id}>
                                            <img src={`${IMAGE_URL}review_images/${img?.image}`} alt="Photo" />
                                            <GridListTileBar
                                                title={`By: ${img?.first_name} ${img?.last_name}`}
                                                subtitle={<span>{dateFormat(img?.created_at, "dddd, mmmm dS, yyyy, h:MM:ss TT")}</span>}
                                            />
                                        </GridListTile>
                                    ))
                                }
                            </GridList>
                        </Paper>
                    )
                }
            </div>
        );
    }
)

export default ImageGridList;
