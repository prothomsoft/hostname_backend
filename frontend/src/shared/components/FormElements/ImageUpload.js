import React, { useRef, useState } from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";

const ImageUpload = (props) => {
    const [files, setFiles] = useState();
    const [isValid, setIsValid] = useState(false);

    const filePickerRef = useRef();

    const pickedHandler = (event) => {
        let pickedFiles;
        let filesAreValid = isValid;
        if (event.target.files && event.target.files.length > 0) {
            pickedFiles = event.target.files;
            setFiles(pickedFiles);
            setIsValid(true);
            filesAreValid = true;
        } else {
            setIsValid(false);
            filesAreValid = false;
        }
        props.onInput(props.id, pickedFiles, filesAreValid, files);
    };

    const pickImageHandler = () => {
        filePickerRef.current.click();
    };

    const useStyles = makeStyles((theme) => ({
        margin: {
            margin: theme.spacing(2),
        },
    }));

    const classes = useStyles();

    return (
        <FormControl className={classes.margin}>
            <input id={props.id} ref={filePickerRef} style={{ display: "none" }} type="file" multiple accept=".jpg,.png,.jpeg" onChange={pickedHandler} />
            <Button type="button" onClick={pickImageHandler} variant="contained" color="primary">
                PICK IMAGES
            </Button>
            {!isValid && <p>{props.errorText}</p>}
        </FormControl>
    );
};

export default ImageUpload;
