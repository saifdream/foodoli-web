import React, {useEffect, useState} from "react";
import {Button, InputAdornment, LinearProgress, SvgIcon, TextField} from "@material-ui/core";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Box from "@material-ui/core/Box";
import {authFormHeader} from "../../../../_helpers/auth-header";
import fetch from "cross-fetch";
import {API, getHttpErrorMessage} from "../../../../constant";
import {useSelector} from "react-redux";
import {Search} from "@material-ui/icons";
import {makeStyles} from "@material-ui/core/styles";
import TableBody from "@material-ui/core/TableBody";
import Toast from "../../../../components/Toast";

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

const OwnerActivation = () => {
    const classes = useStyles();
    const [isLoading, setIsLoading] = useState(false);
    const [isToastOpen, setIsToastOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState('');
    const timer = React.useRef();

    const {user} = useSelector(state => state.user);
    const [userList, setUserList] = useState([]);
    const [searchText, setSearchText] = useState('');

    const getData = (search) => {
        timer.current = window.setTimeout(() => {
            setIsLoading(true);
            let formData = new FormData();
            formData.append('user_id', user?.id);
            if(search)
                formData.append('client', search);
            formData.append('user_type', '2');

            const requestOptions = {
                method: "POST",
                headers: authFormHeader(),
                body: formData,
            };

            fetch(`${API}user/get_user_search`, requestOptions).then((response) => {
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

                    // console.log(data)
                    setUserList(data)
                });
            }).catch((err) => {
                setIsToastOpen(true);
                setMessage('Something went wrong!');
                setType('error');
            }).finally(() => {
                setIsLoading(false);
            });
        }, 700);
    }

    const updateStatus = (status, id) => {
        timer.current = window.setTimeout(() => {
            setIsLoading(true);
            let formData = new FormData();
            formData.append('user_id', id);
            formData.append('status', (status === 1 ? 2 : 1).toString());

            const requestOptions = {
                method: "POST",
                headers: authFormHeader(),
                body: formData,
            };

            fetch(`${API}user_activation`, requestOptions).then((response) => {
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

                    // console.log(data)
                    if(data?.success) {
                        setIsToastOpen(true);
                        setMessage(data?.messaege || 'Successfully Updated');
                        setType('success');

                        getData();
                    }

                    if(!data?.success) {
                        setIsToastOpen(true);
                        setMessage('Something went wrong!');
                        setType('error');
                    }
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
        getData('');
        return () => {
            clearTimeout(timer.current);
        };
    }, []);

    const handleSearchTextChange = (e) => {
        clearTimeout(timer.current);
        setSearchText(e.target.value);
        getData(e.target.value);
    }

    return (
        <>
            <Box mx={2} display="flex" justifyContent="flex-end" alignItems="center">
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
            <Box m={2}>
                { isLoading &&  <LinearProgress color="secondary"/> }
                <Toast isOpen={isToastOpen} message={message} onClose={() => setIsToastOpen(false)} type={type}/>
                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Sl.</TableCell>
                                <TableCell>Client ID</TableCell>
                                <TableCell align="center">First Name</TableCell>
                                <TableCell align="center">Last Name</TableCell>
                                <TableCell align="center">Email</TableCell>
                                <TableCell align="center">Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                userList.length === 0 && <TableCell align="center" colSpan={6}>No user found</TableCell>
                            }
                            {
                                userList.map((row, index) => (
                                    <TableRow key={row.id}>
                                        <TableCell align="center">{index + 1}</TableCell>
                                        <TableCell component="th" scope="row">{row.client_id}</TableCell>
                                        <TableCell align="center">{row.first_name}</TableCell>
                                        <TableCell align="center">{row.last_name}</TableCell>
                                        <TableCell align="center">{row.email}</TableCell>
                                        <TableCell align="center">
                                            {
                                                row.status === 1 && (
                                                    <Button
                                                        variant="outlined"
                                                        style={{textTransform: 'capitalize'}}
                                                        onClick={()=> updateStatus(row?.status, row?.id)}
                                                    >
                                                        <span style={{color: "#0059FF"}}>Active</span>
                                                    </Button>
                                                )
                                            }
                                            {
                                                row.status !== 1 && (
                                                    <Button
                                                        variant="outlined"
                                                        style={{textTransform: 'capitalize'}}
                                                        onClick={()=> updateStatus(row?.status, row?.id)}
                                                    >
                                                        <span style={{color: "green"}}>Inactive</span>
                                                    </Button>
                                                )
                                            }
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </>
    )
}

export default OwnerActivation;
