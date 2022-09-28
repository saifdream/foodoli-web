import React, {memo, useEffect} from "react";
import Page from "../../../../components/Page";
import Box from "@material-ui/core/Box";
import {
    Tab,
    Typography
} from "@material-ui/core";
import Tabs from "@material-ui/core/Tabs";
import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core/styles";
import {Outlet, useNavigate} from "react-router-dom";
import Divider from "@material-ui/core/Divider";

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

const Reservations = memo(
    () => {
        const classes = useStyles();
        const navigate = useNavigate();
        const [value, setValue] = React.useState(0);

        const handleTabChange = (event, newValue) => {
            setValue(newValue);
            switch (newValue) {
                case 0:
                    navigate('todays');
                    break;
                case 1:
                    navigate('confirmed');
                    break;
                case 2:
                    navigate('cancelled');
                    break;
                case 3:
                    navigate('pending');
                    break;
                case 4:
                    navigate('report');
                    break;
            }
        };

        useEffect(()=> {
            switch (window.location.pathname) {
                case "/dashboard/owner/reservations/todays":
                    setValue(0);
                    break;
                case "/dashboard/owner/reservations/confirmed":
                    setValue(1);
                    break;
                case "/dashboard/owner/reservations/cancelled":
                    setValue(2);
                    break;
                case "/dashboard/owner/reservations/pending":
                    setValue(3);
                    break;
                case "/dashboard/owner/reservations/report":
                    setValue(4);
                    break;
            }
        })

        return (
            <Page title="Reservations">
                <Box m={4}>
                    <Typography variant="h4" style={{textAlign: 'center', marginBottom: 15}}>Restaurant Reservations</Typography>
                    <Divider/>
                    <Box className={classes.root}>
                        <Tabs
                            value={value}
                            onChange={handleTabChange}
                            aria-label="orders tabs"
                            centered
                            //variant="fullWidth"
                        >
                            <Tab label="Today's" {...a11yProps(0)} />
                            <Tab label="Confirmed" {...a11yProps(1)} />
                            <Tab label="Cancelled" {...a11yProps(2)} />
                            <Tab label="Pending" {...a11yProps(3)} />
                            <Tab label="Report" {...a11yProps(4)} />
                        </Tabs>
                        <TabPanel value={value} index={0}>
                            <Outlet/>
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            <Outlet/>
                        </TabPanel>
                        <TabPanel value={value} index={2}>
                            <Outlet/>
                        </TabPanel>
                        <TabPanel value={value} index={3}>
                            <Outlet/>
                        </TabPanel>
                        <TabPanel value={value} index={4}>
                            <Outlet/>
                        </TabPanel>
                    </Box>
                </Box>
            </Page>
        )
    }
)

export default Reservations;
