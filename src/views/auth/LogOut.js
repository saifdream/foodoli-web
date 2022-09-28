import React, {memo, useLayoutEffect} from "react";
import { Link } from "react-router-dom";
import Box from "@material-ui/core/Box";
import {userActions} from "../../store/actions/user";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router";

const Logout = memo(
    () => {
      const dispatch = useDispatch();
      const navigate = useNavigate();
      useLayoutEffect(() => {
        dispatch(userActions.resetUser());
        navigate('/');
      });

      return (
          <Box display="flex" justifyContent="center" alignItems="center">
            <h3>You are logged out!!</h3>
            <Link to="/">Go to signin</Link>
          </Box>
      );
    }
)

export default Logout;
