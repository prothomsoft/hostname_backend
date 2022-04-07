import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Backdrop from "@material-ui/core/Backdrop";
import LoginComponent from "../components/LoginComponent";

const Login = props => {
    const useStyles = makeStyles(theme => ({
        backdrop: {
            zIndex: theme.zIndex.drawer + 100
        }
    }));
    const classes = useStyles();

    return (
        <Backdrop invisible={true} className={classes.backdrop} open={true}>
            <LoginComponent />
        </Backdrop>
    );
};

export default Login;
