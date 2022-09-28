import React, {memo, useState} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {Eye} from "react-feather";
import {Divider, IconButton, LinearProgress, makeStyles, TableCell} from "@material-ui/core";
import {authHeader} from "../../../../../_helpers/auth-header";
import fetch from "cross-fetch";
import {API, getHttpErrorMessage} from "../../../../../constant";
import {useSelector} from "react-redux";
import Toast from "../../../../../components/Toast";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";

//const TAX_RATE = 0.07;

const useStyles = makeStyles({
    table: {
        minWidth: 700,
    },
});

function ccyFormat(num) {
    return `${num.toFixed(2)}`;
}

function priceRow(qty, unit) {
    return qty * unit;
}

function createRow(id, title, qty, unit) {
    const price = priceRow(qty, unit);
    return { id, title, qty, unit, price };
}

function subtotal(items) {
    return items.map(({ price }) => price).reduce((sum, i) => sum + i, 0);
}

const Details = memo(
    ({reservation}) => {
        const classes = useStyles();

        const {user} = useSelector(state => state.user);
        const [isToastOpen, setIsToastOpen] = useState(false);
        const [isLoading, setIsLoading] = useState(false);
        const [isSaving, setIsSaving] = useState(false);
        const [message, setMessage] = useState('');
        const [type, setType] = useState('info');
        const [reservations, setReservations] = useState([]);
        const timer = React.useRef();

        const [open, setOpen] = React.useState(false);

        const getData = () => {
            timer.current = window.setTimeout(() => {
                setIsLoading(true);
                const requestOptions = {
                    method: "GET",
                    headers: authHeader(),
                };

                fetch(`${API}special/reservation_details/${reservation?.id}`, requestOptions).then((response) => {
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

                        console.log(data)
                        setReservations(data);
                    });
                }).catch((err) => {
                    setMessage('Something went wrong!!');
                    setType('error');
                    setIsToastOpen(true);
                }).finally(() => {
                    setIsLoading(false);
                });
            })
        };

        const confirmReservation = () => {
            timer.current = window.setTimeout(() => {
                setIsSaving(true);
                const requestOptions = {
                    method: "GET",
                    headers: authHeader(),
                };

                fetch(`${API}special/reservation_confirm/${reservation?.id}`, requestOptions).then((response) => {
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

                        console.log(data)

                        if(data?.success) {
                            setIsToastOpen(true);
                            setMessage(data?.message || 'Successful');
                            setType('success');
                        }

                        if(!data?.success) {
                            setIsToastOpen(true);
                            setMessage('Something went wrong!');
                            setType('error');
                        }
                    });
                }).catch((err) => {
                    setMessage('Something went wrong!!');
                    setType('error');
                    setIsToastOpen(true);
                }).finally(() => {
                    setIsSaving(false);
                });
            })
        };

        const handleClickOpen = () => {
            setOpen(true);
            getData();
        };

        const handleClose = () => {
            setOpen(false);
        };

        const rows = reservations?.map((item) => createRow(`${item?.id}`, `${item?.sp_title}`, `${item.qty}`, `${item?.price}` ) ) || [];

        const invoiceSubtotal = subtotal(rows);
        //const invoiceTaxes = TAX_RATE * invoiceSubtotal;
        //const invoiceTotal = invoiceTaxes + invoiceSubtotal;

        return (
            <div>
                <IconButton color="secondary" onClick={handleClickOpen}>
                    <Eye/>
                </IconButton>
                <Toast isOpen={isToastOpen} message={message} onClose={() => setIsToastOpen(false)} type={type}/>
                <Dialog maxWidth={'md'} open={open} onClose={handleClose} aria-labelledby="form-dialog-title" disableBackdropClick disableEscapeKeyDown>
                    <DialogTitle id="form-dialog-title">Reservation Details</DialogTitle>
                    <Divider/>
                    <DialogContent>
                        <DialogContentText>
                            { isLoading &&  <LinearProgress color="secondary"/> }
                            <TableContainer component={Paper}>
                                <Table className={classes.table} aria-label="spanning table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center" colSpan={3}>
                                                Details
                                            </TableCell>
                                            <TableCell align="right">Price</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Special Name</TableCell>
                                            <TableCell align="right">Qty.</TableCell>
                                            <TableCell align="right">Price ($)</TableCell>
                                            <TableCell align="right">Sum ($)</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {rows.map((row) => (
                                            <TableRow key={row.id}>
                                                <TableCell>{row.title}</TableCell>
                                                <TableCell align="right">{row.qty}</TableCell>
                                                <TableCell align="right">{row.price}</TableCell>
                                                <TableCell align="right">{ccyFormat(row.price * row.qty)}</TableCell>
                                            </TableRow>
                                        ))}

                                        <TableRow>
                                            <TableCell rowSpan={3} />
                                            {/*<TableCell colSpan={2}>Subtotal</TableCell>*/}
                                            <TableCell colSpan={2}>Total</TableCell>
                                            <TableCell align="right">{ccyFormat(invoiceSubtotal)}</TableCell>
                                        </TableRow>
                                        {/*<TableRow>
                                        <TableCell>Tax</TableCell>
                                        <TableCell align="right">{`${(TAX_RATE * 100).toFixed(0)} %`}</TableCell>
                                        <TableCell align="right">{ccyFormat(invoiceTaxes)}</TableCell>
                                    </TableRow>*/}
                                        {/*<TableRow>
                                        <TableCell colSpan={2}>Total</TableCell>
                                        <TableCell align="right">{ccyFormat(invoiceTotal)}</TableCell>
                                    </TableRow>*/}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </DialogContentText>
                    </DialogContent>
                    <Divider/>
                    <DialogActions>
                        <Button onClick={handleClose} color="default">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
)

export default Details;
