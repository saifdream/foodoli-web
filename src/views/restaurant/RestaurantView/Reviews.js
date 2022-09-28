import {makeStyles} from "@material-ui/core/styles";
import {useDispatch, useSelector} from "react-redux";
import React, {memo, useState} from "react";
import {
    Avatar,
    Box,
    Card,
    CardContent,
    CardHeader,
    CardMedia,
    Grid,
    LinearProgress,
    TextField
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import {API, getHttpErrorMessage, IMAGE_URL} from "../../../constant";
import {red} from "@material-ui/core/colors";
import dateFormat from "dateformat";
import Toast from "../../../components/Toast";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import {authFormHeader} from "../../../_helpers/auth-header";
import fetch from "cross-fetch";
import {getRestaurantReviewList} from "../../../store/actions/restaurant";
import {useParams} from "react-router";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        //padding: theme.spacing(2)
        margin: '5px 0'
    },
    heading: {
        color: '#000',
        fontSize: theme.typography.pxToRem(18),
        fontWeight: theme.typography.fontWeightRegular,
    },
    media: {
        maxWidth:'100%',
        maxHeight:'100%',
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    avatar: {
        backgroundColor: red[500],
    },
}));

const Reviews = memo(
    () => {
        const classes = useStyles();
        const dispatch = useDispatch();
        const params = useParams();

        const reviews = useSelector(state => state.restaurants.reviews);

        const {user, isLoggedIn} = useSelector(state => state.user);
        const [isToastOpen, setIsToastOpen] = useState(false);
        const [isSaving, setIsSaving] = useState(false);
        const [isLoading, setIsLoading] = useState(false);
        const [message, setMessage] = useState('');
        const [type, setType] = useState('info');
        const timer = React.useRef();

        const [review, setReview] = useState('');

        const [selectedFiles, setSelectedFiles] = useState();
        const [previewUrl, setPreviewUrl] = useState();

        const uploadImage= () => {
            if (!isLoggedIn) {
                setIsToastOpen(true);
                setMessage("Please login first.");
                setType('warning');
                return;
            }
            if (!review) {
                setIsToastOpen(true);
                setMessage("Please select an image!");
                setType('warning');
                return;
            }

            timer.current = window.setTimeout(() => {
                setIsSaving(true);
                let formData = new FormData();
                formData.append('rest_id', params?.id);
                formData.append('review', review);
                if (selectedFiles)
                    formData.append('image', selectedFiles[0]);

                const requestOptions = {
                    method: "POST",
                    headers: authFormHeader(),
                    body: formData,
                };

                fetch(`${API}special/add_review/${user?.id}/${params?.id}`, requestOptions).then((response) => {
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
                            dispatch(getRestaurantReviewList(params?.id));
                            setIsToastOpen(true);
                            setMessage(data?.message || 'Successful');
                            setType('success');
                            setTimeout(()=> {
                                setReview('');
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
                <Card style={{width: '100%'}}>
                    {isSaving && <LinearProgress color="secondary"/>}
                    <Divider/>
                    <CardContent>
                        <form autoComplete="off" noValidate>
                            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                                <TextField
                                    color="secondary"
                                    multiline
                                    fullWidth
                                    rows={2}
                                    label="Review"
                                    placeholder="Enter review"
                                    name="description"
                                    onChange={(e) => setReview(e.target.value)}
                                    required
                                    value={review}
                                    variant="outlined"
                                />
                                <br/>
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
                                <label htmlFor="attachment" style={{margin: 15}}>
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
                    (reviews && reviews?.length === 0) && (
                        <Box display="flex" justifyContent="center" mt={2}>
                            <Typography variant="body1">No reviews found.</Typography>
                        </Box>
                    )
                }

                {
                    reviews.map((item, index) => {
                        return(
                            <Card className={classes.root} key={item?.id}>
                                <CardHeader
                                    avatar={
                                        item?.profile_pic ?
                                            <Avatar alt={`${item?.first_name} ${item?.last_name}`} src={`${IMAGE_URL}users/${item?.profile_pic}`}/>
                                            :
                                            <Avatar aria-label="recipe" className={classes.avatar}>
                                                {`${item?.first_name} ${item?.last_name}`}
                                            </Avatar>
                                    }
                                    title={<Typography variant="h5">{`${item?.first_name} ${item?.last_name}`}</Typography>}
                                    subheader={<Typography variant="caption">{dateFormat(item?.created_at, "dddd, mmmm dS, yyyy, h:MM:ss TT")}</Typography>}
                                />
                                {
                                    item?.image && (
                                        <CardMedia
                                            className={classes.media}
                                            image={`${IMAGE_URL}reviews/${item?.image}`}
                                            title={`${item?.first_name} ${item?.last_name}`}
                                            alt="image"
                                        />
                                    )
                                }
                                <CardContent>
                                    <Typography variant="body1" component="p">{item?.review}</Typography>
                                </CardContent>
                            </Card>
                        )
                    })
                }
            </div>
        )
    }
)

export default Reviews;
