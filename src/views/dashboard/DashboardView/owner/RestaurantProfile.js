import React, {memo, useState} from "react";
import Page from "../../../../components/Page";
import Box from "@material-ui/core/Box";
import {
    Card,
    CardContent,
    CardHeader,
    Grid,
    LinearProgress,
    makeStyles, Switch,
    TextField,
    Typography
} from "@material-ui/core";
import {useSelector} from "react-redux";
import {authFormHeader, authHeader} from "../../../../_helpers/auth-header";
import fetch from "cross-fetch";
import {API, getHttpErrorMessage} from "../../../../constant";
import Toast from "../../../../components/Toast";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
    root: {},
}));

const RestaurantProfile = memo(
    () => {
        const classes = useStyles();
        const {user} = useSelector(state => state.user);
        const [restaurant, setRestaurant] = useState({
            name: '',
            description: '',
            type: 'All',
            ethnicity: '',
            category: '',
            category_labels: '',
            cuisine: '',
            opening: '08:00',
            closing: '22:00',
            address: '',
            postcode: '',
            locality: '',
            region: '',
            contact: '',
            email: '',
            web: '',
            lat: '',
            lng: '',
        });
        const [location, setLocation] = React.useState(false);
        const [isToastOpen, setIsToastOpen] = useState(false);
        const [isSaving, setIsSaving] = useState(false);
        const [isLoading, setIsLoading] = useState(false);
        const [message, setMessage] = useState('');
        const [type, setType] = useState('info');
        const timer = React.useRef();

        const getData = () => {
            timer.current = window.setTimeout(() => {
                setIsLoading(true);
                const requestOptions = {
                    method: "GET",
                    headers: authHeader(),
                };

                fetch(`${API}resturant_info/${user?.rest_id}`, requestOptions).then((response) => {
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
                            setRestaurant(data[0]);
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

        const updateData= () => {
            if (
                !restaurant.name ||
                !restaurant.opening ||
                !restaurant.closing ||
                !restaurant.address ||
                !restaurant.postcode ||
                !restaurant.locality ||
                !restaurant.region ||
                !restaurant.email ||
                !restaurant.contact
            ) {
                setIsToastOpen(true);
                setMessage("Please give required !");
                setType('warning');
                return;
            }

            timer.current = window.setTimeout(() => {
                setIsSaving(true);
                let formData = new FormData();
                formData.append('name', restaurant.name);
                formData.append('description', restaurant.description);
                formData.append('type', restaurant.type);
                formData.append('ethnicity', restaurant.ethnicity);
                formData.append('category', restaurant.category);
                formData.append('category_labels', restaurant.category_labels);
                formData.append('cuisine', restaurant.cuisine);
                formData.append('opening', restaurant.opening);
                formData.append('closing', restaurant.closing);
                formData.append('address', restaurant.address);
                formData.append('postcode', restaurant.postcode);
                formData.append('locality', restaurant.locality);
                formData.append('region', restaurant.region);
                formData.append('contact', restaurant.contact);
                formData.append('email', restaurant.email);
                formData.append('web', restaurant.web);

                if(location) {
                    formData.append('lat', restaurant.lat);
                    formData.append('lng', restaurant.lng);
                }

                const requestOptions = {
                    method: "POST",
                    headers: authFormHeader(),
                    body: formData,
                };

                fetch(`${API}restaurant_update/${user?.rest_id}`, requestOptions).then((response) => {
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
            getData();
            return () => {
                if(timer.current)
                    clearTimeout(timer.current);
            };
        }, []);

        const handleChange = (event) => {
            setRestaurant({
                ...restaurant,
                [event.target.name]: event.target.value
            });
        };

        const getLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(showPosition);
            } else {
                setIsToastOpen(true);
                setMessage('Geolocation is not supported by this browser.');
                setType('warning');
            }
        }

        const showPosition = (position) => {
            // console.log(position)
            setRestaurant({
                ...restaurant,
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            });
        }

        return (
            <Page title="Restaurant Profile">
                <Box m={4}>
                    <form autoComplete="off" noValidate>
                        <Toast isOpen={isToastOpen} message={message} onClose={() => setIsToastOpen(false)} type={type}/>
                        {(isLoading || isSaving) && <LinearProgress color="secondary"/>}
                        <Card>
                            <CardHeader
                                subheader="The information can be edited"
                                title="Restaurant Profile"
                            />
                            <Divider/>
                            <CardContent>
                                <Grid
                                    container
                                    spacing={3}
                                >
                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            color="secondary"
                                            fullWidth
                                            label="Restaurant name"
                                            placeholder="Enter Restaurant name"
                                            name="name"
                                            onChange={handleChange}
                                            required
                                            value={restaurant.name}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            color="secondary"
                                            multiline
                                            fullWidth
                                            rows={2}
                                            label="Description"
                                            placeholder="Enter Description"
                                            name="description"
                                            onChange={handleChange}
                                            required
                                            value={restaurant.description}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            color="secondary"
                                            fullWidth
                                            label="Menu Type"
                                            name="type"
                                            onChange={handleChange}
                                            required
                                            select
                                            SelectProps={{native: true}}
                                            value={restaurant.type}
                                            variant="outlined"
                                        >
                                            {
                                                [
                                                    {label: 'All', value: 'All'},
                                                    {label: 'Breakfast', value: 'Breakfast'},
                                                    {label: 'Lunch', value: 'Lunch'},
                                                    {label: 'Dinner', value: 'Dinner'},
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
                                            fullWidth
                                            label="Ethnicity"
                                            placeholder="Enter Ethnicity"
                                            name="ethnicity"
                                            onChange={handleChange}
                                            type="text"
                                            required
                                            value={restaurant.ethnicity}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            color="secondary"
                                            variant="outlined"
                                            fullWidth
                                            id="opening"
                                            label="Opening"
                                            type="time"
                                            required
                                            value={restaurant.opening}
                                            onInput={(e)=> setRestaurant({...restaurant, opening: e.target.value})}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            color="secondary"
                                            variant="outlined"
                                            fullWidth
                                            id="closing"
                                            label="Closing"
                                            type="time"
                                            required
                                            value={restaurant.closing}
                                            onInput={(e)=> setRestaurant({...restaurant, closing: e.target.value})}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            color="secondary"
                                            fullWidth
                                            label="Restaurant Category"
                                            placeholder="Enter Restaurant Category"
                                            name="category_labels"
                                            onChange={handleChange}
                                            type="text"
                                            required
                                            value={restaurant.category_labels}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            color="secondary"
                                            fullWidth
                                            label="Food Category"
                                            placeholder="Enter Food Category"
                                            name="category"
                                            onChange={handleChange}
                                            type="text"
                                            required
                                            value={restaurant.category}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            color="secondary"
                                            multiline
                                            fullWidth
                                            rows={2}
                                            label="Address"
                                            placeholder="Enter Address"
                                            name="address"
                                            onChange={handleChange}
                                            type="text"
                                            required
                                            value={restaurant.address}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            color="secondary"
                                            fullWidth
                                            label="Post/Zip Code"
                                            placeholder="Enter Post/Zip Code"
                                            name="postcode"
                                            onChange={handleChange}
                                            type="text"
                                            required
                                            value={restaurant.postcode}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            color="secondary"
                                            fullWidth
                                            label="Locality"
                                            placeholder="Enter Locality"
                                            name="locality"
                                            onChange={handleChange}
                                            type="text"
                                            required
                                            value={restaurant.locality}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            color="secondary"
                                            fullWidth
                                            label="Region"
                                            placeholder="Enter Region"
                                            name="region"
                                            onChange={handleChange}
                                            type="text"
                                            required
                                            value={restaurant.region}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            color="secondary"
                                            fullWidth
                                            label="Contact"
                                            placeholder="Enter Contact"
                                            name="contact"
                                            onChange={handleChange}
                                            type="text"
                                            required
                                            value={restaurant.contact}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            color="secondary"
                                            fullWidth
                                            label="E-mail"
                                            placeholder="Enter E-mail"
                                            name="email"
                                            onChange={handleChange}
                                            type="email"
                                            required
                                            value={restaurant.email}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item md={12} xs={12}>
                                        <TextField
                                            color="secondary"
                                            fullWidth
                                            label="Website"
                                            placeholder="Enter Website"
                                            name="web"
                                            onChange={handleChange}
                                            type="web"
                                            value={restaurant.web}
                                            variant="outlined"
                                        />
                                    </Grid>
                                </Grid>
                                <CardHeader
                                    subheader={
                                        <Box display="flex" alignItems="center">
                                            <Typography>Update location?</Typography>
                                            <Switch
                                                checked={location}
                                                onChange={e=> {
                                                    setLocation(e.target.checked);
                                                    if(e.target.checked)
                                                        getLocation();
                                                }}
                                                name="checkedA"
                                                inputProps={{ 'aria-label': 'secondary checkbox' }}
                                            />
                                        </Box>
                                    }
                                    title="Restaurant Location"
                                />
                                <Divider/>
                                {
                                    location && (
                                        <Grid
                                            container
                                            spacing={3}
                                            style={{marginTop: 10}}
                                        >
                                            <Grid item md={6} xs={12}>
                                                <TextField
                                                    type="number"
                                                    color="secondary"
                                                    fullWidth
                                                    label="Latitude"
                                                    placeholder="Enter Latitude"
                                                    name="lat"
                                                    onChange={handleChange}
                                                    required
                                                    value={restaurant.lat}
                                                    variant="outlined"
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item md={6} xs={12}>
                                                <TextField
                                                    type="number"
                                                    color="secondary"
                                                    fullWidth
                                                    label="Longitude"
                                                    placeholder="Enter Longitude"
                                                    name="lng"
                                                    onChange={handleChange}
                                                    required
                                                    value={restaurant.lng}
                                                    variant="outlined"
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                />
                                            </Grid>
                                        </Grid>
                                    )
                                }
                            </CardContent>
                            <Divider/>
                            {(isLoading || isSaving) && <LinearProgress color="secondary"/>}
                            <Box display="flex" justifyContent="flex-end" p={2}>
                                <Button
                                    color="secondary"
                                    variant="contained"
                                    onClick={updateData}
                                    disabled={isSaving || location && (!restaurant.lat || !restaurant.lng)}
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

export default RestaurantProfile;
