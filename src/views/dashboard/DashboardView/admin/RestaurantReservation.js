import 'date-fns';
import React, {useState} from 'react';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import {authFormHeader, authHeader} from "../../../../_helpers/auth-header";
import fetch from "cross-fetch";
import {API, getHttpErrorMessage} from "../../../../constant";
import Box from "@material-ui/core/Box";
import {Grid, LinearProgress, TableFooter, TextField} from "@material-ui/core";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import {ArrowBack, ArrowForward} from "@material-ui/icons";
import Toast from "../../../../components/Toast";
import dateformat from "dateformat";

const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
});

const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions);

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

export default function RestaurantReservation({rest}) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const [from, setFrom] = useState(new Date());
    const [to, setTo] = useState(new Date());

    const [isLoading, setIsLoading] = useState(false);
    const [isToastOpen, setIsToastOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState('');

    const [reservationList, setReservationList] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(1);
    const timer = React.useRef();

    const getData = () => {
        timer.current = window.setTimeout(() => {
            setIsLoading(true);
            let formData = new FormData();
            formData.append('rest_id', rest?.id);
            formData.append('page', page);
            formData.append('from', dateformat(from, 'yyyy-mm-dd'));
            formData.append('to', dateformat(to, 'yyyy-mm-dd'));

            const requestOptions = {
                method: "POST",
                headers: authFormHeader(),
                body: formData
            };

            fetch(`${API}special/admin_reservation_restaurant_search`, requestOptions).then((response) => {
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

                    setReservationList(data['orders']);
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

    const handleClickOpen = () => {
        console.log(rest)
        getData();
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button variant="outlined" color="secondary" onClick={handleClickOpen}>
                See Details
            </Button>
            <Dialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
                fullWidth={true}
                maxWidth={'lg'}
                disableBackdropClick
                disableEscapeKeyDown
            >
                <Toast isOpen={isToastOpen} message={message} onClose={() => setIsToastOpen(false)} type={type}/>
                <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                    {rest?.name}
                </DialogTitle>
                <DialogContent dividers>
                    <Box m={2}>
                        <Box my={2}>
                            <Grid container spacing={2} justify="center">
                                <Grid item>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <Grid
                                            container
                                            direction="row"
                                            justify="space-between"
                                            alignItems="center"
                                        >
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
                                <Grid item style={{marginTop: 10}}>
                                    <Button color="secondary" variant="outlined" onClick={getData}>Get Reservations</Button>
                                </Grid>
                            </Grid>
                        </Box>
                        <TableContainer component={Paper}>
                            { isLoading &&  <LinearProgress color="secondary"/> }
                            <Table className={classes.table} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">Sl.</TableCell>
                                        <TableCell>Date</TableCell>
                                        <TableCell align="center">Confirmed</TableCell>
                                        <TableCell align="center">Pending</TableCell>
                                        <TableCell align="center">Cancelled</TableCell>
                                        <TableCell align="center">Total</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        reservationList.length === 0 && <TableCell align="center" colSpan={6}>No restaurant found</TableCell>
                                    }
                                    {
                                        reservationList.map((row, index) => (
                                            <TableRow key={row.id}>
                                                <TableCell align="center">{index + 1}</TableCell>
                                                <TableCell component="th" scope="row">{row?.date}</TableCell>
                                                <TableCell align="center">{(row?.confirmed >= 1)? row?.confirmed : 0}</TableCell>
                                                <TableCell align="center">{(row?.pending >= 1)? row?.pending : 0}</TableCell>
                                                <TableCell align="center">{(row?.cancelled >= 1)? row?.cancelled : 0}</TableCell>
                                                <TableCell align="center">{row?.cancelled + row?.confirmed + row?.pending }</TableCell>
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
                </DialogContent>
            </Dialog>
        </div>
    );
}
