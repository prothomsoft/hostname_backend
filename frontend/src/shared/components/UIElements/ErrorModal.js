import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

const ErrorModal = props => {
    return (
        <Dialog open={!!props.error} onClose={props.onClear}>
            <DialogTitle id="alert-dialog-title">{""}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">{props.error}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClear} color="primary">
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ErrorModal;
