import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import {MapPin} from "react-feather";
import {PhotoAlbum, RateReview, RestaurantMenu} from "@material-ui/icons";
import {Grid, Typography} from "@material-ui/core";
import React, {memo} from "react";
import Map from "./Map";
import {useSelector} from "react-redux";
import Menu from "./Menu";
import Reviews from "./Reviews";
import ImageGridList from "./Images";

const MyTab = memo(
    () => {
        const restaurant = useSelector(state => state.restaurants.restaurant);

        return (
            <Tabs>
                <TabList style={{color: '#00a651'}}>
                    <Tab style={{padding: '10px 35px'}}>
                        <Grid
                            container
                            spacing={0}
                            direction="column"
                            alignItems="center"
                            justify="center"
                        >
                            <Grid item>
                                <MapPin fontSize="small"/>
                            </Grid>
                            <Grid item>
                                <Typography variant={'h6'}>Map</Typography>
                            </Grid>
                        </Grid>
                    </Tab>
                    <Tab style={{padding: '10px 35px'}}>
                        <Grid
                            container
                            spacing={0}
                            direction="column"
                            alignItems="center"
                            justify="center"
                        >
                            <Grid item>
                                <RestaurantMenu/>
                            </Grid>
                            <Grid item>
                                <Typography variant={'h6'}>Menu</Typography>
                            </Grid>
                        </Grid>
                    </Tab>
                    <Tab style={{padding: '10px 35px'}}>
                        <Grid
                            container
                            spacing={0}
                            direction="column"
                            alignItems="center"
                            justify="center"
                        >
                            <Grid item>
                                <RateReview/>
                            </Grid>
                            <Grid item>
                                <Typography variant={'h6'}>Reviews</Typography>
                            </Grid>
                        </Grid>
                    </Tab>
                    <Tab style={{padding: '10px 35px'}}>
                        <Grid
                            container
                            spacing={0}
                            direction="column"
                            alignItems="center"
                            justify="center"
                        >
                            <Grid item>
                                <PhotoAlbum/>
                            </Grid>
                            <Grid item>
                                <Typography variant={'h6'}>Photos</Typography>
                            </Grid>
                        </Grid>
                    </Tab>
                </TabList>

                <TabPanel>
                    {restaurant && <Map restaurant={restaurant}/>}
                </TabPanel>
                <TabPanel>
                    {restaurant && <Menu restaurant={restaurant}/>}
                </TabPanel>
                <TabPanel>
                    {restaurant && <Reviews/>}
                </TabPanel>
                <TabPanel>
                    {restaurant && <ImageGridList/>}
                </TabPanel>
            </Tabs>
        )
    }
);

export default MyTab;
