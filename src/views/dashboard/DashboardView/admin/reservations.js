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
import {IconButton, LinearProgress, TableFooter} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import {authFormHeader, authHeader} from "../../../../_helpers/auth-header";
import fetch from "cross-fetch";
import {API, getHttpErrorMessage} from "../../../../constant";
import {getReservation} from "../../../../store/actions/restaurant";
import {ArrowBack, ArrowForward} from "@material-ui/icons";
import RestaurantReservation from "./RestaurantReservation";
import Toast from "../../../../components/Toast";

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

const AdminReservations = memo(
    () => {
        const classes = useStyles();
        const dispatch = useDispatch();
        const {user} = useSelector(state => state.user);
        const [searchText, setSearchText] = useState('');

        const [isLoading, setIsLoading] = useState(false);
        const [isToastOpen, setIsToastOpen] = useState(false);
        const [message, setMessage] = useState('');
        const [type, setType] = useState('');

        const [restaurantList, setRestaurantList] = useState([]);
        const [totalPages, setTotalPages] = useState(0);
        const [page, setPage] = useState(1);
        const timer = React.useRef();

        const getData = () => {
            timer.current = window.setTimeout(() => {
                setIsLoading(true);
                const requestOptions = {
                    method: "GET",
                    headers: authHeader(),
                };

                fetch(`${API}special/admin_reservation`, requestOptions).then((response) => {
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

                        console.log(data)

                        setRestaurantList(data['restaurant_details']);
                        setTotalPages(data['total_pages']);
                    });
                }).catch((err) => {
                    setIsToastOpen(true);
                    setMessage('Something went wrong!');
                    setType('error');
                }).finally(() => {
                    setIsLoading(false);
                });
            })
        }

        useEffect(() => {
            console.log("Fire")
            getData();
        }, [])

        return (
            <>
                <Box m={2}>
                    <Toast isOpen={isToastOpen} message={message} onClose={() => setIsToastOpen(false)} type={type}/>
                    { isLoading &&  <LinearProgress color="secondary"/> }
                    <TableContainer component={Paper}>
                        <Table className={classes.table} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">Sl.</TableCell>
                                    <TableCell>Restaurant</TableCell>
                                    <TableCell align="center">Confirmed</TableCell>
                                    <TableCell align="center">Pending</TableCell>
                                    <TableCell align="center">Cancelled</TableCell>
                                    <TableCell align="center">Total</TableCell>
                                    <TableCell align="center">Details</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    restaurantList.length === 0 && <TableCell align="center" colSpan={6}>No restaurant found</TableCell>
                                }
                                {
                                    restaurantList.map((row, index) => (
                                        <TableRow key={row.id}>
                                            <TableCell align="center">{index + 1}</TableCell>
                                            <TableCell component="th" scope="row">{row?.name}</TableCell>
                                            <TableCell align="center">{(row?.confirmed >= 1)? row?.confirmed : 0}</TableCell>
                                            <TableCell align="center">{(row?.pending >= 1)? row?.pending : 0}</TableCell>
                                            <TableCell align="center">{(row?.cancelled >= 1)? row?.cancelled : 0}</TableCell>
                                            <TableCell align="center">{row?.cancelled + row?.confirmed + row?.pending }</TableCell>
                                            <TableCell align="center">
                                                <RestaurantReservation rest={row}/>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                            {
                                totalPages > 1 && (
                                    <TableFooter>
                                        <TableRow>
                                            <TableCell colSpan={8}>Total Pages: {totalPages} Current Page: {page}</TableCell>
                                            <TableCell align="right">
                                                <IconButton onClick={()=> {
                                                    if(!isLoading && page > 1) {
                                                        setPage(page - 1);
                                                        getData();
                                                    }
                                                }}>
                                                    <ArrowBack/>
                                                </IconButton>
                                            </TableCell>
                                            <TableCell align="left">
                                                <IconButton onClick={()=> {
                                                    if(!isLoading && totalPages > page) {
                                                        setPage(page + 1);
                                                        getData();
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
            </>
        );
    }
)

export default AdminReservations;
