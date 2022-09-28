import React, {memo, useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {useDispatch, useSelector} from "react-redux";
import {getTodaysReservation, searchTodaysReservation} from "../../../../../store/actions/restaurant";
import dateFormat from "dateformat";
import {IconButton, InputAdornment, LinearProgress, SvgIcon, TextField} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import {Search} from "@material-ui/icons";
import Details from "./details";

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

const Todays = memo(
    () => {
        const classes = useStyles();
        const dispatch = useDispatch();
        const {user} = useSelector(state => state.user);
        const {todaysReservationList, isLoading} = useSelector(state => state.restaurants);
        const [searchText, setSearchText] = useState('');

        useEffect(() => {
            console.log("Fire")
            dispatch(getTodaysReservation(user?.rest_id));
        }, []);

        const handleSearchTextChange = (e) => {
            setSearchText(e.target.value);
            if(e.target.value && e.target.value.length > 3)
                dispatch(searchTodaysReservation(user?.rest_id, e.target.value));

            if(!e.target.value)
                dispatch(getTodaysReservation(user?.rest_id));
        }

        console.log("Before Rendering")

        return (
            <>
                <Box display="flex" justifyContent="flex-end" alignItems="center">
                    <TextField
                        color="secondary"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SvgIcon
                                        fontSize="small"
                                        color="colorSecondary"
                                    >
                                        <Search />
                                    </SvgIcon>
                                </InputAdornment>
                            )
                        }}
                        value={searchText}
                        onChange={handleSearchTextChange}
                        placeholder={`Search Client`}
                        variant="outlined"
                        size="small"

                    />
                </Box>
                <Box mt={2}>
                    { isLoading &&  <LinearProgress color="secondary"/> }
                    <TableContainer component={Paper}>
                        <Table className={classes.table} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center" colSpan={6}>
                                        Customer Info
                                    </TableCell>
                                    <TableCell align="center" colSpan={2}>
                                        <span style={{float: 'left'}}>|</span>
                                        Time
                                    </TableCell>
                                    <TableCell align="center" colSpan={3}>
                                        <span style={{float: 'left'}}>|</span>
                                        Price & Status
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="center">Sl.</TableCell>
                                    <TableCell>Client ID</TableCell>
                                    <TableCell align="center">First Name</TableCell>
                                    <TableCell align="center">Last Name</TableCell>
                                    <TableCell align="center">Email</TableCell>
                                    <TableCell align="center">Contact</TableCell>
                                    <TableCell align="center">Reservation</TableCell>
                                    <TableCell align="center">Pickup/Dine</TableCell>
                                    <TableCell align="right">Total Price ($)</TableCell>
                                    <TableCell align="center">Status</TableCell>
                                    <TableCell align="center">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    todaysReservationList.length === 0 && <TableCell align="center" colSpan={11}>No reservation found</TableCell>
                                }
                                {
                                    todaysReservationList.map((row, index) => (
                                        <TableRow key={row.id}>
                                            <TableCell align="right">{index + 1}</TableCell>
                                            <TableCell component="th" scope="row">{row.client_id}</TableCell>
                                            <TableCell align="center">{row.first_name}</TableCell>
                                            <TableCell align="center">{row.last_name}</TableCell>
                                            <TableCell align="center">{row.email}</TableCell>
                                            <TableCell align="center">{row.contact}</TableCell>
                                            <TableCell align="center">{dateFormat(row.created_at, 'h:MM:ss')}</TableCell>
                                            <TableCell align="center">{row.approximate_time}</TableCell>
                                            <TableCell align="center">{row.total}</TableCell>
                                            <TableCell align="center">
                                                {
                                                    row.status === '0' && <span style={{color: "coral"}}>Cancel</span>
                                                }
                                                {
                                                    row.status === '1' && <span style={{color: "#0059FF"}}>Pending</span>
                                                }
                                                {
                                                    row.status === '2' && <span style={{color: "green"}}>Confirmed</span>
                                                }
                                            </TableCell>
                                            <TableCell align="center">
                                                <Details reservation={row}/>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </>
        );
    }
)

export default Todays;
