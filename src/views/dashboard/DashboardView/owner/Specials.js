import React, {memo, useState} from "react";
import Page from "../../../../components/Page";
import Box from "@material-ui/core/Box";
import {
    Card,
    CardContent,
    CardHeader, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel,
    Grid, IconButton, InputAdornment,
    LinearProgress,
    makeStyles, Radio, RadioGroup, Switch,
    TextField,
    Typography
} from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import Toast from "../../../../components/Toast";
import {useSelector} from "react-redux";
import {authFormHeader, authHeader} from "../../../../_helpers/auth-header";
import fetch from "cross-fetch";
import {API, getHttpErrorMessage, IMAGE_URL} from "../../../../constant";
import Button from "@material-ui/core/Button";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import {Edit} from "@material-ui/icons";
import List from "@material-ui/core/List";

const useStyles = makeStyles((theme) => ({
    root: {},
    editIcon: {
        right: 0,
        top: 0,
        position: 'absolute',
        color: 'green',
    },
}));

const Specials = memo(
    () => {
        const classes = useStyles();
        const {user} = useSelector(state => state.user);
        const [isToastOpen, setIsToastOpen] = useState(false);
        const [isSaving, setIsSaving] = useState(false);
        const [isLoading, setIsLoading] = useState(false);
        const [message, setMessage] = useState('');
        const [type, setType] = useState('info');
        const timer = React.useRef();

        const [special, setSpecial] = useState({
            action: 'Add',
            special_id: '',
            title: '',
            description: '',
            price: '',
            discount: '',
            for: '',
            available: {sunday: false, monday: false, tuesday: false, wednesday: false, thursday: false, friday: false, saturday: false},
            status: false,
            image: null,
        });

        const [selectedFiles, setSelectedFiles] = useState();
        const [previewUrl, setPreviewUrl] = useState();

        const [specials, setSpecials] = useState([]);

        const getData = () => {
            timer.current = window.setTimeout(() => {
                setIsLoading(true);
                const requestOptions = {
                    method: "GET",
                    headers: authHeader(),
                };

                fetch(`${API}special_show/${user?.rest_id}`, requestOptions).then((response) => {
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
                            setSpecials(data);
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

        const addSpecial= () => {
            if (
                !special.title ||
                !special.description ||
                !special.price ||
                !special.for
            ) {
                setIsToastOpen(true);
                setMessage("Please give required !");
                setType('warning');
                return;
            }

            if (special.action === 'Add' && !selectedFiles) {
                setIsToastOpen(true);
                setMessage("Please select an special image!");
                setType('warning');
                return;
            }

            timer.current = window.setTimeout(() => {
                setIsSaving(true);
                let formData = new FormData();
                if (special.action === 'Add')
                    formData.append('rest_id', user?.rest_id);
                formData.append('title', special.title);
                formData.append('description', special.description);
                formData.append('price', special.price);
                formData.append('discount', special.discount);
                formData.append('for', special.for);
                let available = "";
                console.log(special.available)
                for (const key in special.available) {
                    if (special.available.hasOwnProperty(key)) {
                        if(special.available[key]) available += `${key},`;
                    }
                }
                console.log(available)
                formData.append('available', available.slice(0, -1).split(',').toString());
                const isActive = special.status === true ? 1 : 0;
                formData.append('status',  isActive.toString());
                if (selectedFiles)
                    formData.append('image', selectedFiles[0]);

                const requestOptions = {
                    method: "POST",
                    headers: authFormHeader(),
                    body: formData,
                };

                const url = special.action === 'Add' ? `${API}special` : `${API}special_update/${special.special_id}`
                fetch(url, requestOptions).then((response) => {
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
                                setSpecial({
                                    action: 'Add',
                                    special_id: '',
                                    title: '',
                                    description: '',
                                    price: '',
                                    discount: '',
                                    for: '',
                                    available: {sunday: false, monday: false, tuesday: false, wednesday: false, thursday: false, friday: false, saturday: false},
                                    status: false,
                                    image: null,
                                });
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
                if(timer.current)
                    clearTimeout(timer.current);
            };
        }, []);

        const handleChange = (event) => {
            setSpecial({
                ...special,
                [event.target.name]: event.target.value
            });
        };

        const setEditSpecial = (item) => {
            console.log(item)
            const days = {sunday: false, monday: false, tuesday: false, wednesday: false, thursday: false, friday: false, saturday: false};
            const available = item.available.split(',');
            for (const key in available) {
                if (available.hasOwnProperty(key)) {
                    days[available[key].toLowerCase()] = true;
                }
            }
            console.log(days)
            setTimeout(() => {
                setSpecial({
                    ...special,
                    action: 'Edit',
                    special_id: item.id,
                    title: item.title,
                    description: item.description,
                    for: item.for,
                    price: item.price,
                    discount: item.discount,
                    status: item.status,
                    image: item.image,
                    available: {...days}
                });
            }, 500)
        };

        return (
            <Page title="Specials">
                <Toast isOpen={isToastOpen} message={message} onClose={() => setIsToastOpen(false)} type={type}/>
                <Box m={2}>
                    <Typography variant="h4" style={{textAlign: 'center', marginBottom: 15}}>Restaurant Specials</Typography>
                    <Divider/>
                    <br/>
                    <Grid
                        container
                        spacing={3}
                    >
                        <Grid item md={6} sm={12} xs={12}>
                            <Card>
                                {isLoading && <LinearProgress color="secondary"/>}
                                <CardHeader title="Existing Specials"/>
                                <Divider/>
                                <CardContent>
                                    { specials.length === 0 && <Typography variant="body1">No specials added.</Typography> }
                                    <List>
                                        {
                                            specials.map((item) => (
                                                <React.Fragment key={item?.id}>
                                                    <ListItem alignItems="flex-start">
                                                        <IconButton
                                                            onClick={() => setEditSpecial(item)}
                                                            aria-label={`info about ${item.title}`}
                                                            className={classes.editIcon}
                                                        >
                                                            <Edit/>
                                                        </IconButton>
                                                        <ListItemAvatar>
                                                            <img
                                                                style={{
                                                                    width: 120,
                                                                    backgroundColor: '#f2f7f4',
                                                                    marginRight: 15
                                                                }}
                                                                src={item?.image ? `${IMAGE_URL}specials/${item?.image}` : '/static/images/green-logo-400x300.png'}
                                                                alt={item?.title}
                                                            />
                                                        </ListItemAvatar>
                                                        <ListItemText
                                                            primary={<Typography variant="h6" color="textSecondary">{item?.title}</Typography>}
                                                            secondary={
                                                                <React.Fragment>
                                                                    <Typography variant="body2" color="textPrimary">{item?.description}</Typography>
                                                                    <Typography
                                                                        component="span"
                                                                        variant="body2"
                                                                        className={classes.inline}
                                                                        color="textPrimary"
                                                                    >
                                                                        Price: $ {item?.price}
                                                                    </Typography>
                                                                    ,&nbsp;
                                                                    <Typography
                                                                        component="span"
                                                                        variant="body2"
                                                                        className={classes.inline}
                                                                        color="textPrimary"
                                                                    >
                                                                        Discount: {item?.discount}% After discount: ${item.price - item.price * item.discount/100 }
                                                                    </Typography>
                                                                    <br/>
                                                                    <Typography
                                                                        component="span"
                                                                        variant="body2"
                                                                        className={classes.inline}
                                                                        color="textPrimary"
                                                                    >
                                                                        Available: {item?.available}
                                                                    </Typography>
                                                                    <br/>
                                                                    <Typography variant="caption">Number Of Click: { item.click_count }</Typography>
                                                                </React.Fragment>
                                                            }
                                                        />
                                                    </ListItem>
                                                    <Divider variant="inset" component="li"/>
                                                </React.Fragment>
                                            ))
                                        }
                                    </List>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item md={6} sm={12} xs={12}>
                            <Card>
                                {isSaving && <LinearProgress color="secondary"/>}
                                <CardHeader title={`${special.action === 'Add' ? 'Add A' : 'Update'} Special`}/>
                                <Divider/>
                                <CardContent>
                                    <form autoComplete="off" noValidate>
                                        <Grid
                                            container
                                            spacing={3}
                                        >
                                            <Grid item md={12} xs={12}>
                                                <TextField
                                                    color="secondary"
                                                    fullWidth
                                                    label="Title"
                                                    placeholder="Enter Title"
                                                    name="title"
                                                    onChange={handleChange}
                                                    required
                                                    value={special.title}
                                                    variant="outlined"
                                                />
                                            </Grid>
                                            <Grid item md={12} xs={12}>
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
                                                    value={special.description}
                                                    variant="outlined"
                                                />
                                            </Grid>
                                            <Grid item md={6} xs={12}>
                                                <TextField
                                                    color="secondary"
                                                    fullWidth
                                                    label="Price"
                                                    placeholder="Enter Price"
                                                    name="price"
                                                    onChange={handleChange}
                                                    type="number"
                                                    required
                                                    value={special.price}
                                                    variant="outlined"
                                                    InputProps={{
                                                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item md={6} xs={12}>
                                                <TextField
                                                    color="secondary"
                                                    fullWidth
                                                    label="Discount"
                                                    placeholder="Enter Discount"
                                                    name="discount"
                                                    onChange={handleChange}
                                                    type="number"
                                                    required
                                                    value={special.discount}
                                                    variant="outlined"
                                                    InputProps={{
                                                        startAdornment: <InputAdornment position="start">%</InputAdornment>,
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item md={12} xs={12}>
                                                <FormControl component="fieldset">
                                                    <FormLabel component="legend" style={{color: '#000'}}>Special For</FormLabel>
                                                    <RadioGroup
                                                        row
                                                        aria-label="for"
                                                        name="for"
                                                        value={special.for}
                                                        onChange={handleChange}
                                                    >
                                                        <FormControlLabel value="Breakfast" control={<Radio color="secondary" />} label="Breakfast" />
                                                        <FormControlLabel value="Lunch" control={<Radio color="secondary" />} label="Lunch" />
                                                        <FormControlLabel value="Dinner" control={<Radio color="secondary" />} label="Dinner" />
                                                    </RadioGroup>
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={12} xs={12}>
                                                <FormLabel component="legend" style={{color: '#000'}}>Availability</FormLabel>
                                                <FormGroup row>
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={special.available.sunday}
                                                                onChange={(e) => setSpecial({...special, available: {...special.available, sunday: !special.available.sunday}})}
                                                                name="sunday" />
                                                        }
                                                        label="Sunday"
                                                    />
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={special.available.monday}
                                                                onChange={(e) => setSpecial({...special, available: {...special.available, monday: !special.available.monday}})}
                                                                name="monday" />
                                                        }
                                                        label="Monday"
                                                    />
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={special.available.tuesday}
                                                                onChange={(e) => setSpecial({...special, available: {...special.available, tuesday: !special.available.tuesday}})}
                                                                name="tuesday" />
                                                        }
                                                        label="Tuesday"
                                                    />
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={special.available.wednesday}
                                                                onChange={(e) => setSpecial({...special, available: {...special.available, wednesday: !special.available.wednesday}})}
                                                                name="wednesday" />
                                                        }
                                                        label="Wednesday"
                                                    />
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={special.available.thursday}
                                                                onChange={(e) => setSpecial({...special, available: {...special.available, thursday: !special.available.thursday}})}
                                                                name="thursday" />
                                                        }
                                                        label="Thursday"
                                                    />
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={special.available.friday}
                                                                onChange={(e) => setSpecial({...special, available: {...special.available, friday: !special.available.friday}})}
                                                                name="friday" />
                                                        }
                                                        label="Friday"
                                                    />
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={special.available.saturday}
                                                                onChange={(e) => setSpecial({...special, available: {...special.available, saturday: !special.available.saturday}})}
                                                                name="saturday" />
                                                        }
                                                        label="Saturday"
                                                    />
                                                </FormGroup>
                                            </Grid>
                                            <Grid item md={12} xs={12}>
                                                <Grid component="label" container justify={'center'} alignItems="center">
                                                    <Grid item>Status</Grid>
                                                    <Grid item>
                                                        <FormControlLabel
                                                            label=""
                                                            control={
                                                                <Switch
                                                                    checked={special.status}
                                                                    onChange={(e)=> setSpecial({...special, status: e.target.checked})}
                                                                    name="status"
                                                                    color="secondary"
                                                                />
                                                            }
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Grid>
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
                                                        !previewUrl && special.image && (
                                                            <img
                                                                style={{
                                                                    width: 120,
                                                                    backgroundColor: '#f2f7f4',
                                                                    marginRight: 15
                                                                }}
                                                                src={special?.image ? `${IMAGE_URL}specials/${special?.image}` : '/static/images/green-logo-400x300.png'}
                                                                alt={special?.title}
                                                            />
                                                        )
                                                    }
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
                                        onClick={addSpecial}
                                        disabled={isSaving}
                                        size="large"
                                    >
                                        Save details
                                    </Button>
                                </Box>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>
            </Page>
        )
    }
)

export default Specials;
