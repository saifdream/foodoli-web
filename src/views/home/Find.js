import React, {memo, useEffect} from "react";
import {Box, Button, CircularProgress, Grid, makeStyles, Paper, TextField, Typography} from "@material-ui/core";
import {Autocomplete, createFilterOptions} from "@material-ui/lab";
import {useNavigate} from "react-router";
import {API, getHttpErrorMessage} from "../../constant";
import fetch from 'cross-fetch';
import {authFormHeader, authHeader} from "../../_helpers/auth-header";

const useStyles = makeStyles((theme) => ({
    root: {
        //width: 500,
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    },
    findButton: {
        background: '#00a651',
        border: 0,
        borderRadius: 3,
        boxShadow: '0 3px 5px 3x rgb(0,229,100, .3)',
        color: 'white',
        height: 53,
        fontSize: 18,
        fontWeight: 'bolder',
        padding: '0 30px',
        textTransform: 'capitalize',
        '&:hover': {
            background: '#ffffff',
            color: '#00a651'
        },
    },
    searchSpecials: {
        position: 'relative',
        display: 'block',
        maxWidth: '750px',
        padding: '8px',
        background: 'rgba(0, 0, 0, 0.6)',
        textAlign: 'left',
        margin: '0px auto',
        borderRadius: '6px',
    },
}));

const filterOptions = createFilterOptions({
    matchFrom: 'start',
    stringify: (option) => option,
});

function sleep(delay = 0) {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
}

const Find = memo (
    () => {
        const classes = useStyles();
        const navigate = useNavigate();

        const [looking, setLooking] = React.useState('');
        const [inputLooking, setInputLooking] = React.useState('');

        const [open, setOpen] = React.useState(false);
        const [options, setOptions] = React.useState([]);

        const [city, setCity] = React.useState(options[0]);
        const [inputCity, setInputCity] = React.useState('');
        const [isLoading, setIsLoading] = React.useState(false);

        const timer = React.useRef();

        //const loading = open && options.length === 0;

        /*useEffect(() => {
            let active = true;

            if (!loading) {
                return undefined;
            }

            if (!inputCity) {
                return undefined;
            }

            (async () => {
                const response = await fetch(`${API}get_city/${inputCity}`);
                const cities = await response.json();
                if (active) {
                    setOptions(cities);
                }
            })();

            return () => {
                active = false;
            };
        }, [loading]);*/

        const getCity = (city) => {
            clearTimeout(timer.current);
            if(city.length > 2) {
                timer.current = window.setTimeout(() => {
                    setIsLoading(true);
                    const requestOptions = {
                        method: "GET",
                        headers: authHeader(),
                    };

                    fetch(`${API}get_city/${city}`, requestOptions).then((response) => {
                        //console.log(response);
                        response.text().then(res => {
                            let data = "";
                            try {
                                data = res && JSON.parse(res);
                            } catch (e) {
                                console.log(getHttpErrorMessage(response, e));
                                return;
                            }

                            if (!response.ok) {
                                if (response.status === 401) {
                                    console.log(getHttpErrorMessage(response));
                                    return;
                                }

                                const error = data.error || data.message || data.errors || getHttpErrorMessage(response);
                                console.log(error);
                                return;
                            }

                            // console.log(data)
                            setOptions(data);
                        });
                    }).catch((err) => {
                        console.log(err)
                    }).finally(() => {
                        setIsLoading(false);
                    });
                })
            }
        }

        useEffect(() => {
            return () => {
                clearTimeout(timer.current);
            };
        }, []);

        useEffect(() => {
            if (!open) {
                setOptions([]);
            }
        }, [open]);

        const suggestion = [
            'Any', 'American', 'African', 'Asian', 'Australian', 'Chinese', 'Dessert', 'Ethnic', 'European', 'Exotic',
            'Fusion', 'Indian', 'Indonesian', 'International', 'Japanese', 'Korean', 'Malay', 'Mediterranean',
            'Middle Eastern', 'Mongolian', 'Peranakan', 'South American', 'Thai', 'Vietnamese', 'Western', 'Cuisines',
            'Halal Food', 'Mexican', 'Italian', 'French', 'Mediterranea', 'Spanish', 'Afgan', 'Argentinian', 'Brazilian',
            'Latin America', 'Caribbean', 'Filipino', 'Eastern Euro', 'German', 'German', 'Hawaiian', 'Turkish',
            'Fast Food', 'Pizza', 'Burgers', 'Sandwiches', 'Seafood', 'Steakhouse', 'Tex-Mex', 'Vegetarian', 'Southern',
            'Sushi', 'Taco', 'Bakery', 'Salad', 'Pho', 'Tapas', 'Tea', 'Soup', 'Bagels', 'Barbecue', 'Breakfast',
            'Cajun & Creo', 'Chicken', 'Coffee', 'Donuts', 'Ice Cream', 'Hot Dogs', 'Tandoori',
        ];

        const search = () => {
            navigate(`search?native=no&what=${inputLooking || 'Any'}&where=${inputCity}`);
        }

        return (
            <Box className={classes.root}>
                <Box className={classes.searchSpecials}>
                    <Grid
                        container
                        spacing={2}
                        direction="row"
                    >
                        <Grid item md={12} sm={12} xs={12} lg={4}>
                            <Paper>
                                <Autocomplete
                                    id="filter-looking"
                                    options={suggestion}
                                    getOptionLabel={(option) => option}
                                    filterOptions={filterOptions}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            placeholder="I'm looking for ..."
                                            variant="outlined"
                                        />
                                    )}
                                    value={looking}
                                    onChange={(e) => {
                                        // console.log(e.target?.textContent)
                                        setLooking(e.target?.textContent);
                                    }}
                                    inputValue={inputLooking}
                                    onInputChange={(event, newInputValue) => {
                                        // console.log(newInputValue);
                                        setInputLooking(newInputValue);
                                    }}
                                    freeSolo
                                />
                            </Paper>
                        </Grid>
                        <Grid item md={12} sm={12} xs={12} lg={4}>
                            <Paper>
                                <Autocomplete
                                    id="asynchronous-city"
                                    open={open}
                                    onOpen={() => {
                                        setOpen(true);
                                    }}
                                    onClose={() => {
                                        setOpen(false);
                                    }}
                                    getOptionSelected={(option, value) => option.name === value.name}
                                    getOptionLabel={(option) => option.name}
                                    options={options}
                                    loading={isLoading}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            placeholder="City or Zip code"
                                            variant="outlined"
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <React.Fragment>
                                                        {isLoading ? <CircularProgress color="inherit" size={20}/> : null}
                                                        {params.InputProps.endAdornment}
                                                    </React.Fragment>
                                                ),
                                            }}
                                        />
                                    )}
                                    value={city}
                                    onChange={(event, newValue) => {
                                        // console.log(newValue);
                                        setCity(newValue);
                                    }}
                                    inputValue={inputCity}
                                    onInputChange={(event, newInputValue) => {
                                        // console.log(newInputValue);
                                        setInputCity(newInputValue);
                                        getCity(newInputValue);
                                    }}
                                    loadingText={
                                        <Typography
                                            variant="subtitle2"
                                            style={{color: '#00a651'}}
                                        >
                                            Loading ...
                                        </Typography>
                                    }
                                    freeSolo
                                />
                            </Paper>
                        </Grid>
                        <Grid item md={12} sm={12} xs={12} lg={4}>
                            <Box display="flex" justifyContent="center">
                            <Button
                                variant="contained"
                                color="secondary"
                                className={classes.findButton}
                                disableElevation
                                onClick={() => search()}
                            >
                                Find Specials
                            </Button>
                            </Box>

                        </Grid>
                    </Grid>
                </Box>
            </Box>
        )
    }
)

export default Find;
