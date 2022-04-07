import React, { useEffect, useState, useContext } from "react";
import { useHistory, useParams } from "react-router-dom";
import Input from "../../shared/components/FormElements/Input";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import { VALIDATOR_REQUIRE } from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { makeStyles } from "@material-ui/core/styles";
import { AuthContext } from "../../shared/context/auth-context";
import Button from "@material-ui/core/Button";
import Backdrop from "@material-ui/core/Backdrop";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";

const UploadImage = () => {
    const auth = useContext(AuthContext);
    const { sendRequest, isLoading, error, clearError } = useHttpClient();
    const [loadedUsers, setLoadedUsers] = useState();
    const [isUpdateModeLoading, setUpdateModeLoading] = useState(true);
    const [uploadedFile, setUploadedFile] = useState("");
    const history = useHistory();

    let userid = useParams().userid;
    let category = useParams().category;

    if (typeof userid === "undefined" || userid == null) {
        userid = "";
    }

    if (!category) {
        category = "slub";
    }

    const categories = [
        {
            id: "welcome",
            name: "WELCOME",
        },
        {
            id: "sesja_narzeczenska",
            name: "SESJA NARZECZEŃSKA",
        },
        {
            id: "slub",
            name: "ŚLUB",
        },
        {
            id: "sesja_slubna",
            name: "SESJA ŚLUBNA",
        },
        {
            id: "sesja_okolicznosciowa",
            name: "SESJA OKOLICZNOŚCIOWA",
        },
    ];

    const [formState, inputHandler, setFormData] = useForm(
        {
            user: {
                value: "",
                isValid: false,
            },
            category: {
                value: "",
                isValid: false,
            },
            folder: {
                value: "",
                isValid: false,
            },
            images: {
                value: [],
                isValid: false,
            },
        },
        false
    );

    useEffect(() => {
        const getUsers = async () => {
            try {
                const responseData = await sendRequest("/users/", {}, "GET");
                setLoadedUsers(responseData.users);
            } catch (err) {}
        };
        getUsers();
        setFormData(
            {
                user: {
                    value: userid,
                    isValid: true,
                },
                category: {
                    value: category,
                    isValid: true,
                },
                folder: {
                    value: "",
                    isValid: true,
                },
                images: {
                    value: [],
                    isValid: false,
                },
            },
            true
        );
        setUpdateModeLoading(false);
    }, [sendRequest, setFormData, userid, category]);

    const uploadImageSubmitHandler = async (event) => {
        event.preventDefault();
        var formData = new FormData();
        formData.append("userId", formState.inputs.user.value);
        formData.append("category", formState.inputs.category.value);
        formData.append("folder", formState.inputs.folder.value);
        for (const key of Object.keys(formState.inputs.images.value)) {
            formData.set("images", formState.inputs.images.value[key]);
            try {
                let response = await sendRequest("/uploads/upload", formData, "POST", {
                    Authorization: "Bearer " + auth.token,
                    Accept: "application/json",
                    "Content-Type": "application/json;charset=UTF-8",
                });
                setUploadedFile(response.response[0].imgSrc);
            } catch (err) {}
        }
        history.push("/");
    };

    const useStyles = makeStyles((theme) => ({
        container: {
            padding: theme.spacing(15, 0, 4, 0),
        },
        space: {
            padding: theme.spacing(2),
        },
        backdrop: {
            zIndex: theme.zIndex.drawer + 1,
            color: "#fff",
        },
        paper: {
            padding: theme.spacing(3),
            display: "flex",
            flexDirection: "column",
            textAlign: "center",
            background: "rgba(0, 0, 0, 1)",
        },
        input: {
            width: "100%",
        },
        margin: {
            padding: theme.spacing(2),
        },
    }));

    const classes = useStyles();

    if (isUpdateModeLoading || isLoading) {
        return (
            <Backdrop className={classes.backdrop} open={true}>
                <Paper className={classes.paper} variant="outlined">
                    {uploadedFile}
                </Paper>
            </Backdrop>
        );
    }

    return (
        <Container className={classes.container}>
            <Container maxWidth="xs">
                <ErrorModal error={error} onClear={clearError} />
                <Paper elevation={1} className={classes.paper}>
                    <Typography component="h1" variant="button" className={classes.space}>
                        UPLOAD IMAGES
                    </Typography>
                    <form onSubmit={uploadImageSubmitHandler} noValidate>
                        {!isLoading && loadedUsers && (
                            <FormControl className={classes.margin}>
                                <Input
                                    element="select"
                                    id="user"
                                    type="text"
                                    variant="outlined"
                                    color="primary"
                                    className={classes.input}
                                    label="User name"
                                    data={loadedUsers}
                                    validators={[VALIDATOR_REQUIRE()]}
                                    errorText="Please enter a valid user name."
                                    onInput={inputHandler}
                                    initialValue={formState.inputs.user.value}
                                    initialValid={formState.inputs.user.isValid}
                                />
                            </FormControl>
                        )}
                        <br />
                        <FormControl className={classes.margin}>
                            <Input
                                element="select"
                                id="category"
                                type="text"
                                variant="outlined"
                                color="primary"
                                className={classes.input}
                                label="Category"
                                data={categories}
                                validators={[VALIDATOR_REQUIRE()]}
                                errorText="Please enter a valid category name."
                                onInput={inputHandler}
                                initialValue={formState.inputs.category.value}
                                initialValid={formState.inputs.category.isValid}
                            />
                        </FormControl>
                        <Input
                            element="input"
                            id="folder"
                            type="text"
                            variant="outlined"
                            margin="normal"
                            color="primary"
                            className={classes.input}
                            label="S3 folder name (2020_01_29)"
                            validators={[VALIDATOR_REQUIRE()]}
                            errorText="Please enter a valid s3 folder name."
                            onInput={inputHandler}
                            initialValue={formState.inputs.folder.value}
                            initialValid={formState.inputs.folder.isValid}
                        />

                        <ImageUpload center id="images" onInput={inputHandler} />
                        <FormControl className={classes.margin}>
                            <Button type="submit" disabled={!formState.isValid} variant="contained" color="primary">
                                UPLOAD
                            </Button>
                        </FormControl>
                    </form>
                </Paper>
            </Container>
        </Container>
    );
};

export default UploadImage;
