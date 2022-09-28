import 'date-fns';
import React, {memo, useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {useDispatch, useSelector} from "react-redux";
import {getReservation, getReservationReport} from "../../../../../store/actions/restaurant";
import {Button, Grid, IconButton, LinearProgress, TableFooter, TextField, Typography} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import {ArrowBack, ArrowForward} from "@material-ui/icons";
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker} from '@material-ui/pickers';
import dateformat from "dateformat";

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

const days = [ "Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

const Report = memo(
    () => {
        const classes = useStyles();
        const dispatch = useDispatch();
        const {user} = useSelector(state => state.user);
        const {reportReservationList, totalReportPages, isLoading} = useSelector(state => state.restaurants);
        const [day, setDay] = useState('');
        const [special, setSpecial] = useState('');
        const [from, setFrom] = useState(new Date());
        const [to, setTo] = useState(new Date());
        const [page, setPage] = useState(1);

        useEffect(() => {
            console.log("Report Fire")
            //dispatch(getReservationReport(user?.rest_id, page))
        }, []);

        const getReport = () => {
            let formData = new FormData();
            formData.append('rest_id', user?.rest_id);
            formData.append('day', day);
            formData.append('special', special.trim());
            formData.append('from', dateformat(from, 'yyyy-mm-dd'));
            formData.append('to', dateformat(to, 'yyyy-mm-dd'));

            dispatch(getReservationReport(formData, page));
        }

        console.log(reportReservationList)
        console.log("Before Rendering")
        if(!reportReservationList) {
            return <Typography variant="body1" style={{textAlign: 'center'}}>Preparing view</Typography>
        }

        return (
            <Box mt={2}>
                <Box my={2}>
                    <Grid container spacing={2}>
                        <Grid item>
                            <TextField
                                margin="dense"
                                color="secondary"
                                fullWidth
                                label="Day"
                                name="day"
                                onChange={(e) => setDay(e.target.value)}
                                select
                                SelectProps={{native: true}}
                                InputLabelProps={{shrink: true}}
                                value={day}
                                variant="outlined"
                            >
                                <option value="">Select One</option>
                                {
                                    days.map((day) => (
                                        <option key={day} value={day}>{day}</option>
                                    ))
                                }
                            </TextField>
                        </Grid>
                        <Grid item>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <Grid
                                    container
                                    direction="row"
                                    justify="space-between"
                                    alignItems="center"
                                >
                                    {/*<Typography variant="h6" style={{paddingLeft: 10, paddingRight: 10}}>From</Typography>*/}
                                    <KeyboardDatePicker
                                        color="secondary"
                                        margin="dense"
                                        id="from-date-picker-dialog"
                                        label="From"
                                        format="MM/dd/yyyy"
                                        value={from}
                                        onChange={(date) => setFrom(date)}
                                        maxDate={to}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                        autoOk
                                        variant="inline"
                                        inputVariant="outlined"
                                        InputAdornmentProps={{ position: "end" }}
                                        required
                                    />
                                    &nbsp;
                                    {/*<Typography variant="h6" style={{paddingLeft: 10, paddingRight: 10}}>To</Typography>*/}
                                    <KeyboardDatePicker
                                        color="secondary"
                                        margin="dense"
                                        id="to-date-picker-dialog"
                                        label="To"
                                        format="MM/dd/yyyy"
                                        value={to}
                                        minDate={from}
                                        onChange={(date) => setTo(date)}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                        autoOk
                                        variant="inline"
                                        inputVariant="outlined"
                                        InputAdornmentProps={{ position: "end" }}
                                        required
                                    />
                                </Grid>
                            </MuiPickersUtilsProvider>
                        </Grid>
                        <Grid item>
                            <TextField
                                color="secondary"
                                margin="dense"
                                fullWidth
                                label="Special"
                                placeholder="Search Special"
                                name="special"
                                onChange={(e) => setSpecial(e.target.value)}
                                required
                                value={special}
                                variant="outlined"
                                InputLabelProps={{shrink: true}}
                            />
                        </Grid>
                        <Grid item style={{marginTop: 10}}>
                            <Button color="secondary" variant="outlined" onClick={getReport}>Get Report</Button>
                        </Grid>
                    </Grid>
                </Box>
                <TableContainer component={Paper}>
                    { isLoading &&  <LinearProgress color="secondary"/> }
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
                            </TableRow>
                            <TableRow>
                                <TableCell align="center">Sl.</TableCell>
                                <TableCell>Title</TableCell>
                                <TableCell align="center">Order</TableCell>
                                <TableCell align="center">Confirmed</TableCell>
                                <TableCell align="center">Pending</TableCell>
                                <TableCell align="center">Cancel</TableCell>
                                <TableCell align="center">Date</TableCell>
                                <TableCell align="center">Day</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                reportReservationList.length === 0 && <TableCell align="center" colSpan={10}>No data found</TableCell>
                            }
                            {
                                reportReservationList.map((row, index) => (
                                    <TableRow key={row.id}>
                                        <TableCell align="right">{index + 1}</TableCell>
                                        <TableCell component="th" scope="row">{row.title}</TableCell>
                                        <TableCell align="center">{row.confirmed + row.pending + row.cancelled}</TableCell>
                                        <TableCell align="center">{row.confirmed}</TableCell>
                                        <TableCell align="center">{row.pending}</TableCell>
                                        <TableCell align="center">{row.cancelled}</TableCell>
                                        <TableCell align="center">{dateformat(new Date(row.created_at), 'yyyy-mm-dd HH:MM')}</TableCell>
                                        <TableCell align="center">{dateformat(new Date(row.created_at), 'dddd')}</TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                        {
                            totalReportPages > 1 && (
                                <TableFooter>
                                    <TableRow>
                                        <TableCell colSpan={7}>Total Pages: {totalReportPages} Current Page: {page}</TableCell>
                                        <TableCell align="right">
                                            <IconButton onClick={()=> {
                                                if(!isLoading && page > 1) {
                                                    setPage(page - 1);
                                                    dispatch(getReservation('Pending', user?.rest_id, page + 1));
                                                }
                                            }}>
                                                <ArrowBack/>
                                            </IconButton>
                                        </TableCell>
                                        <TableCell align="left">
                                            <IconButton onClick={()=> {
                                                if(!isLoading && totalReportPages > page) {
                                                    setPage(page + 1);
                                                    dispatch(getReservation('Pending', user?.rest_id, page + 1));
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

export default Report;
