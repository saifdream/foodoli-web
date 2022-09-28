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
import {getReservation} from "../../../../../store/actions/restaurant";
import dateFormat from "dateformat";
import {IconButton, LinearProgress, TableFooter, Typography} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Details from "./details";
import {ArrowBack, ArrowForward} from "@material-ui/icons";

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

const Cancelled = memo(
    () => {
        const classes = useStyles();
        const dispatch = useDispatch();
        const {user} = useSelector(state => state.user);
        const {cancelledReservationList, totalCancelledPages, isLoading} = useSelector(state => state.restaurants);
        const [page, setPage] = useState(1);

        useEffect(() => {
            console.log("Fire")
            dispatch(getReservation('Cancelled', user?.rest_id, page));
        }, []);

        console.log("Before Rendering")

        if(!cancelledReservationList) {
            return <Typography variant="body1" style={{textAlign: 'center'}}>Preparing view</Typography>
        }

        return (
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
                                    Date & Time
                                </TableCell>
                                <TableCell align="center" colSpan={2}>
                                    <span style={{float: 'left'}}>|</span>
                                    Price
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
                                <TableCell align="center">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                cancelledReservationList.length === 0 && <TableCell align="center" colSpan={10}>No reservation found</TableCell>
                            }
                            {
                                cancelledReservationList.map((row, index) => (
                                    <TableRow key={row.id}>
                                        <TableCell align="right">{index + 1}</TableCell>
                                        <TableCell component="th" scope="row">{row.client_id}</TableCell>
                                        <TableCell align="center">{row.first_name}</TableCell>
                                        <TableCell align="center">{row.last_name}</TableCell>
                                        <TableCell align="center">{row.email}</TableCell>
                                        <TableCell align="center">{row.contact}</TableCell>
                                        <TableCell align="center">{dateFormat(row.created_at, 'yyyy-mm-dd HH:MM')}</TableCell>
                                        <TableCell align="center">{row.approximate_time}</TableCell>
                                        <TableCell align="center">{row.total}</TableCell>
                                        <TableCell align="center">
                                            <Details reservation={row}/>
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                        {
                            totalCancelledPages > 1 && (
                                <TableFooter>
                                    <TableRow>
                                        <TableCell colSpan={8}>Total Pages: {totalCancelledPages} Current Page: {page}</TableCell>
                                        <TableCell align="right">
                                            <IconButton onClick={()=> {
                                                if(!isLoading && page > 1) {
                                                    setPage(page - 1);
                                                    dispatch(getReservation('Cancelled', user?.rest_id, page + 1));
                                                }
                                            }}>
                                                <ArrowBack/>
                                            </IconButton>
                                        </TableCell>
                                        <TableCell align="left">
                                            <IconButton onClick={()=> {
                                                if(!isLoading && totalCancelledPages > page) {
                                                    setPage(page + 1);
                                                    dispatch(getReservation('Cancelled', user?.rest_id, page + 1));
                                                }
                                            }}>
                                                <ArrowForward/>
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                </TableFooter>
                            )
                        }
                    </Table>
                </TableContainer>
            </Box>
        );
    }
)

export default Cancelled;
