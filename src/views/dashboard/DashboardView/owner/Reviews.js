import React, {memo, useState} from "react";
import Page from "../../../../components/Page";
import {
    Box, Card, CardContent,
    CardHeader, CardMedia,
    LinearProgress,
    ListItem,
    ListItemAvatar,
    ListItemText,
    makeStyles,
    Typography
} from "@material-ui/core";
import {authHeader} from "../../../../_helpers/auth-header";
import fetch from "cross-fetch";
import {API, getHttpErrorMessage, IMAGE_URL} from "../../../../constant";
import {useSelector} from "react-redux";
import List from "@material-ui/core/List";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import Toast from "../../../../components/Toast";
import dateFormat from "dateformat";
import {red} from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
    root: {
        width: 500,
        // maxWidth: '500px',
        backgroundColor: theme.palette.background.paper,
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
    inline: {
        display: 'inline',
    },
}));

const Reviews = memo(
    () => {
        const classes = useStyles();

        const {user} = useSelector(state => state.user);
        const [isToastOpen, setIsToastOpen] = useState(false);
        const [isLoading, setIsLoading] = useState(false);
        const [message, setMessage] = useState('');
        const [type, setType] = useState('info');
        const timer = React.useRef();

        const [reviews, setReviews] = useState([]);

        const getData = () => {
            timer.current = window.setTimeout(() => {
                setIsLoading(true);
                const requestOptions = {
                    method: "GET",
                    headers: authHeader(),
                };

                fetch(`${API}special/review_list/${user?.rest_id}`, requestOptions).then((response) => {
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
                        if(data.reviews?.length) {
                            setReviews(data.reviews);
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

        React.useEffect(() => {
            getData();
            return () => {
                if(timer.current)
                    clearTimeout(timer.current);
            };
        }, []);

        return (
            <Page title="Reviews">
                <Box m={4}>
                    <Toast isOpen={isToastOpen} message={message} onClose={() => setIsToastOpen(false)} type={type}/>
                    <Typography variant="h4" style={{textAlign: 'center', marginBottom: 15}}>Restaurant Reviews</Typography>
                    <Divider/>
                    {isLoading && <LinearProgress color="secondary"/>}
                    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                        { reviews.length === 0 && <Box m={4}><Typography variant="body1">No reviews.</Typography></Box> }
                        <List className={classes.root}>
                            {
                                reviews.map((item)=> (
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
                                ))
                            }
                        </List>
                    </Box>
                </Box>
            </Page>
        )
    }
)

export default Reviews;
