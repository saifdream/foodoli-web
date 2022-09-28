import React, {memo, useState} from "react";
import Page from "../../../../components/Page";
import Box from "@material-ui/core/Box";
import {
    Card, CardContent, CardHeader, Dialog, DialogActions, DialogContent, DialogTitle,
    Divider, FormControlLabel,
    Grid, IconButton, LinearProgress,
    List,
    ListItem, ListItemText,
    Paper, Switch,
    Tab,
    TextField,
    Typography
} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {authFormHeader, authHeader} from "../../../../_helpers/auth-header";
import fetch from "cross-fetch";
import {API, getHttpErrorMessage} from "../../../../constant";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import {makeStyles} from "@material-ui/core/styles";
import {getRestaurantMenuList} from "../../../../store/actions/restaurant";
import Tabs from "@material-ui/core/Tabs";
import PropTypes from "prop-types";
import Toast from "../../../../components/Toast";
import Button from "@material-ui/core/Button";
import {Add, Edit, EditOutlined} from "@material-ui/icons";

function TabPanel(props) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `foodoli-tab-${index}`,
        'aria-controls': `foodoli-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
    heading: {
        color: '#00a651',
        //fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightBold,
    },
}));

const Menus = memo(
    () => {
        const classes = useStyles();
        const {user} = useSelector(state => state.user);
        const [isToastOpen, setIsToastOpen] = useState(false);
        const [isSaving, setIsSaving] = useState(false);
        const [message, setMessage] = useState('');
        const [type, setType] = useState('info');
        const timer = React.useRef();

        const dispatch = useDispatch();

        const [menu, setMenu] = useState({
            action: 'Add',
            menu_id: '',
            name: '',
            details: '',
            price: 0,
            category: '',
            category_id: '',
            status: false,
        });

        const {menus: menuList, isLoading} = useSelector(state => state.restaurants);

        const [isCategoryLoading, setIsCategoryLoading] = useState(false);
        const [category, setCategory] = useState({
            action: 'Add',
            id: '',
            name: ''
        });
        const [categories, setCategories] = useState([]);
        const getCategoryData = () => {
            timer.current = window.setTimeout(() => {
                setIsCategoryLoading(true);
                const requestOptions = {
                    method: "GET",
                    headers: authHeader(),
                };

                fetch(`${API}get_category_list/${user?.rest_id}`, requestOptions).then((response) => {
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
                            setCategories(data);
                        }
                    });
                }).catch((err) => {
                    setMessage('Something went wrong!!');
                    setType('error');
                    setIsToastOpen(true);
                }).finally(() => {
                    setIsCategoryLoading(false);
                });
            })
        }

        const addMenu= () => {
            if (
                !menu.name ||
                !menu.details ||
                !menu.price ||
                !menu.category_id
            ) {
                setIsToastOpen(true);
                setMessage("Please give required !");
                setType('warning');
                return;
            }

            timer.current = window.setTimeout(() => {
                setIsSaving(true);
                let formData = new FormData();
                formData.append('rest_id', user?.rest_id);
                formData.append('category_id', menu.category_id);
                formData.append('name', menu.name);
                formData.append('details', menu.details);
                formData.append('price', menu.price);
                const isActive = menu.status === true ? 1 : 0;
                formData.append('is_active', isActive);

                const requestOptions = {
                    method: "POST",
                    headers: authFormHeader(),
                    body: formData,
                };

                const url = menu.action === 'Add' ? `${API}restaurant_menu_create` : `${API}restaurant_menu_update/${menu.menu_id}`
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
                            dispatch(getRestaurantMenuList(user?.rest_id));
                            getCategoryData();
                            setIsToastOpen(true);
                            setMessage(data?.message || 'Successful');
                            setType('success');
                            setTimeout(()=> {
                                setMenu({
                                    action: 'Add',
                                    menu_id: '',
                                    name: '',
                                    details: '',
                                    price: 0,
                                    category: '',
                                    category_id: '',
                                    status: false,
                                });
                                setValue(0);
                            }, 1000)
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

        const addCategory= () => {
            console.log(category);
            //return;
            if (!category) {
                setIsToastOpen(true);
                setMessage("Please give required !");
                setType('warning');
                return;
            }

            timer.current = window.setTimeout(() => {
                setIsSaving(true);
                let formData = new FormData();
                formData.append('name', category.name);

                const requestOptions = {
                    method: "POST",
                    headers: authFormHeader(),
                    body: formData,
                };

                const url = category.action === 'Add' ? `${API}category_create/${user?.rest_id}` : `${API}category_update/${category.id}`
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
                            getCategoryData();
                            setIsToastOpen(true);
                            setMessage(data?.message || 'Successful');
                            setType('success');
                            setTimeout(()=> {
                                setCategory({
                                    action: 'Add',
                                    id: '',
                                    name: '',
                                });
                            }, 1000);
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
                    handleClose();
                });
            })
        }

        React.useEffect(() => {
            dispatch(getRestaurantMenuList(user?.rest_id));
            getCategoryData();
            return () => {
                if(timer.current)
                    clearTimeout(timer.current);
            };
        }, []);

        const [value, setValue] = React.useState(0);

        const handleTabChange = (event, newValue) => {
            setValue(newValue);
        };

        const handleChange = (event) => {
            setMenu({
                ...menu,
                [event.target.name]: event.target.value
            });
        };

        const [open, setOpen] = React.useState(false);

        const handleClickOpen = () => {
            setOpen(true);
        };

        const handleClose = () => {
            setOpen(false);
        };

        return (
            <Page title="Menus">
                <Box m={4}>
                    <Typography variant="h4" style={{textAlign: 'center', marginBottom: 15}}>Restaurant Menus</Typography>
                    <Divider/>
                    { isLoading &&  <LinearProgress color="secondary"/> }
                    <Box className={classes.root}>
                        <Tabs
                            value={value}
                            onChange={handleTabChange}
                            aria-label="orders tabs"
                            centered
                            //variant="fullWidth"
                        >
                            <Tab label="Existing Menu" {...a11yProps(0)} />
                            <Tab label={`${menu.action === 'Add' ? 'New' : 'Update'} Menu`} {...a11yProps(1)} />
                            <Tab label="Existing Category" {...a11yProps(2)} />
                        </Tabs>
                        <TabPanel value={value} index={0}>
                            {
                                menuList.map((item, index) => {
                                    return (
                                        <Accordion key={item?.id}>
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon/>}
                                                aria-controls="panel1a-content"
                                                id="panel1a-header"
                                            >
                                                <Typography variant="h5" className={classes.heading}>{item?.name}</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <List component='nav' style={{width: '100%'}}>
                                                    {
                                                        item.menus.length === 0 && <Typography variant="subtitle1">No menus</Typography>
                                                    }
                                                    {
                                                        item.menus.map((m) => {
                                                            return (
                                                                <ListItem
                                                                    className={classes.root}
                                                                    divider
                                                                    button
                                                                    key={m?.id}
                                                                    onClick={()=> {
                                                                        setValue(1);
                                                                        setMenu({
                                                                            ...menu,
                                                                            menu_id: m.id,
                                                                            name: m.name,
                                                                            details: m.details,
                                                                            price: m.price,
                                                                            category_id: m.category_id,
                                                                            status: m.is_active == 1,
                                                                            action: 'Edit'
                                                                        });
                                                                        setIsToastOpen(false);
                                                                    }}
                                                                >
                                                                    <Grid container spacing={2}>
                                                                        <Grid item xs={12} sm container>
                                                                            <Grid item xs container direction="column" spacing={2}>
                                                                                <Grid item xs>
                                                                                    <Typography gutterBottom variant="h5">
                                                                                        {m?.name}
                                                                                    </Typography>
                                                                                    <Typography gutterBottom variant="subtitle1">
                                                                                        {m?.details}
                                                                                    </Typography>
                                                                                </Grid>
                                                                            </Grid>
                                                                            <Grid item style={{textAlign: 'right'}}>
                                                                                <Typography gutterBottom variant="h5">
                                                                                    $ {m?.price}
                                                                                </Typography>
                                                                                <EditOutlined/>
                                                                            </Grid>
                                                                        </Grid>
                                                                    </Grid>
                                                                </ListItem>
                                                            )
                                                        })
                                                    }
                                                </List>
                                            </AccordionDetails>
                                        </Accordion>
                                    )
                                })
                            }
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            <form autoComplete="off" noValidate>
                                <Toast isOpen={isToastOpen} message={message} onClose={() => setIsToastOpen(false)} type={type}/>
                                {isSaving && <LinearProgress color="secondary"/>}
                                <Card>
                                    <CardHeader
                                        title={`${menu.action === 'Add' ? 'New' : 'Update'} Menu`}
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
                                                    label="Menu name"
                                                    placeholder="Enter Menu name"
                                                    name="name"
                                                    onChange={handleChange}
                                                    required
                                                    value={menu.name}
                                                    variant="outlined"
                                                />
                                            </Grid>
                                            <Grid item md={6} xs={12}>
                                                <TextField
                                                    color="secondary"
                                                    multiline
                                                    fullWidth
                                                    rows={2}
                                                    label="Details"
                                                    placeholder="Enter Details"
                                                    name="details"
                                                    onChange={handleChange}
                                                    required
                                                    value={menu.details}
                                                    variant="outlined"
                                                />
                                            </Grid>
                                            <Grid item md={6} xs={12}>
                                                <Grid component="label" container justify={'center'} alignItems="center" spacing={1}>
                                                    <Grid item xs={10} md={10}>
                                                        <TextField
                                                            color="secondary"
                                                            fullWidth
                                                            label="Category"
                                                            name="category_id"
                                                            onChange={handleChange}
                                                            required
                                                            select
                                                            SelectProps={{native: true}}
                                                            value={menu.category_id}
                                                            variant="outlined"
                                                        >
                                                            <option value="">Select One</option>
                                                            {
                                                                categories.map((option) => (
                                                                    <option key={option.id} value={option.id}>
                                                                        {option.name}
                                                                    </option>
                                                                ))
                                                            }
                                                        </TextField>
                                                    </Grid>
                                                    <Grid item>
                                                        <IconButton color="secondary" onClick={handleClickOpen}>
                                                            <Add/>
                                                        </IconButton>
                                                    </Grid>
                                                </Grid>
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
                                                    value={menu.price}
                                                    variant="outlined"
                                                />
                                            </Grid>
                                            <Grid item md={12} xs={12}>
                                                <Grid component="label" container justify={'center'} alignItems="center" spacing={1}>
                                                    <Grid item>Status</Grid>
                                                    <Grid item>
                                                        <FormControlLabel
                                                            label=""
                                                            control={
                                                                <Switch
                                                                    checked={menu.status}
                                                                    onChange={(e)=> setMenu({...menu, status: e.target.checked})}
                                                                    name="status"
                                                                    color="secondary"
                                                                />
                                                            }
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                    <Divider/>
                                    <Box display="flex" justifyContent="flex-end" p={2}>
                                        <Button
                                            color="secondary"
                                            variant="contained"
                                            onClick={addMenu}
                                            disabled={isSaving}
                                            size="large"
                                        >
                                            Save details
                                        </Button>
                                    </Box>
                                </Card>
                            </form>
                        </TabPanel>
                        <TabPanel value={value} index={2}>
                            <Paper m={2}>
                                <List
                                    component="nav"
                                    aria-labelledby="nested-list-subheader"
                                    className={classes.root}
                                >
                                    {
                                        categories.map((c, index)=> (
                                            <ListItem button divider key={c?.id}>
                                                <ListItemText primary={
                                                    <>
                                                        <Typography>{`${index + 1}. ${c.name}`}</Typography>
                                                        <IconButton
                                                            style={{float: 'right', top: 5, right: 5, position: 'absolute'}}
                                                            onClick={()=> {
                                                                handleClickOpen();
                                                                setCategory({name: c.name, id: c.id, action: 'Edit'});
                                                            }}
                                                        >
                                                            <Edit/>
                                                        </IconButton>
                                                    </>
                                                } />
                                            </ListItem>
                                        ))
                                    }
                                </List>
                            </Paper>
                        </TabPanel>
                    </Box>
                    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title">Category</DialogTitle>
                        <DialogContent>
                            <TextField
                                color="secondary"
                                autoFocus
                                id="category"
                                label="Enter Category Name"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={category.name}
                                onChange={(e)=> setCategory({...category, name: e.target.value})}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} color="secondary">
                                Cancel
                            </Button>
                            <Button onClick={addCategory} color="secondary">
                                Save
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Box>
            </Page>
        )
    }
)

export default Menus;
