import React, {memo} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {useSelector} from "react-redux";
import {Box, Grid, List, ListItem} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    heading: {
        color: '#00a651',
        //fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightBold,
    },
}));

const Menu = memo(
    () => {
        const classes = useStyles();
        const menusList = useSelector(state => state.restaurants.menus);

        if(menusList && menusList?.length === 0)
            return (
                <Box display="flex" justifyContent="center" mt={2}>
                    <Typography variant="body1">No menu found.</Typography>
                </Box>
            )

        return (
            <div className={classes.root}>
                {
                    menusList.map((item, index) => {
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
                                    {
                                        item.menus.length === 0 &&(
                                            <ListItem className={classes.root}>
                                                <Typography variant="body1">No menus</Typography>
                                            </ListItem>
                                        )
                                    }
                                    <List component='nav' style={{width: '586px'}}>
                                        {
                                            item.menus.map((menu) => {
                                                return (
                                                    <ListItem
                                                        className={classes.root}
                                                        divider
                                                        button
                                                        key={menu?.name}
                                                    >
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} sm container>
                                                                <Grid item xs container direction="column" spacing={2}>
                                                                    <Grid item xs>
                                                                        <Typography gutterBottom variant="h5">
                                                                            {menu?.name}
                                                                        </Typography>
                                                                        <Typography gutterBottom variant="subtitle1">
                                                                            {menu?.details}
                                                                        </Typography>
                                                                    </Grid>
                                                                </Grid>
                                                                <Grid item style={{textAlign: 'right'}}>
                                                                    <Typography gutterBottom variant="h5">
                                                                        $ {menu?.price}
                                                                    </Typography>
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
            </div>
        );
    }
)

export default Menu;
