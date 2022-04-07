import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Input from "../../shared/components/FormElements/Input";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { VALIDATOR_REQUIRE } from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

const Signup = () => {
    const { sendRequest, error, clearError } = useHttpClient();
    const history = useHistory();
    const [isUpdateModeLoading, setUpdateModeLoading] = useState(true);

    const [formState, inputHandler, setFormData] = useForm(
        {
            name: {
                value: "",
                isValid: false
            },
            welcomeURL: {
                value: "",
                isValid: false
            },
            creationDate: {
                value: "",
                isValid: false
            },
            login: {
                value: "",
                isValid: false
            }
        },
        false
    );

    useEffect(() => {
        setFormData(
            {
                name: {
                    value: "",
                    isValid: false
                },
                welcomeURL: {
                    value: "",
                    isValid: false
                },
                creationDate: {
                    value: "",
                    isValid: false
                },
                login: {
                    value: "",
                    isValid: false
                }
            },
            false
        );
        setUpdateModeLoading(false);
    }, [setFormData]);

    const signupSubmitHandler = async event => {
        event.preventDefault();
        try {
            await sendRequest(
                "/users/signup",
                {
                    name: formState.inputs.name.value,
                    welcomeURL: formState.inputs.welcomeURL.value,
                    creationDate: formState.inputs.creationDate.value,
                    login: formState.inputs.login.value
                },
                "POST"
            );
            history.push("/");
        } catch (err) {}
    };

    const useStyles = makeStyles(theme => ({
        container: {
            padding: theme.spacing(15, 0, 4, 0)
        },
        backdrop: {
            zIndex: theme.zIndex.drawer + 1,
            color: "#fff"
        },
        paper: {
            padding: theme.spacing(3),
            display: "flex",
            flexDirection: "column",
            textAlign: "center",
            background: "rgba(0, 0, 0, 1)"
        },
        input: {
            width: "100%"
        },
        submit: {
            width: "100%",
            margin: theme.spacing(3, 0, 0, 0),
            padding: theme.spacing(1.2, 2.3, 1, 2.3)
        }
    }));

    const classes = useStyles();

    if (isUpdateModeLoading) {
        return (
            <Backdrop className={classes.backdrop} open={true}>
                <CircularProgress color="inherit" />
            </Backdrop>
        );
    }

    return (
        <Container className={classes.container}>
            <Container maxWidth="xs">
                <ErrorModal error={error} onClear={clearError} />
                <Paper elevation={1} className={classes.paper}>
                    <Typography component="h1" variant="button">
                        SIGNUP FORM
                    </Typography>
                    <form onSubmit={signupSubmitHandler} noValidate>
                        <Input
                            element="input"
                            id="name"
                            margin="normal"
                            className={classes.input}
                            required={true}
                            type="text"
                            variant="outlined"
                            color="primary"
                            label="MARTA i MICHAŁ"
                            validators={[VALIDATOR_REQUIRE()]}
                            errorText="Please enter a Name."
                            onInput={inputHandler}
                            initialValue={formState.inputs.name.value}
                            initialValid={formState.inputs.name.isValid}
                        />
                        <Input
                            element="input"
                            id="welcomeURL"
                            margin="normal"
                            className={classes.input}
                            required={true}
                            type="text"
                            variant="outlined"
                            color="primary"
                            label="martamichal"
                            validators={[VALIDATOR_REQUIRE()]}
                            errorText="Please enter a welcome URL."
                            onInput={inputHandler}
                            initialValue={formState.inputs.welcomeURL.value}
                            initialValid={formState.inputs.welcomeURL.isValid}
                        />
                        <Input
                            element="input"
                            id="creationDate"
                            margin="normal"
                            className={classes.input}
                            required={true}
                            type="text"
                            variant="outlined"
                            color="primary"
                            label="2020-02-25"
                            validators={[VALIDATOR_REQUIRE()]}
                            errorText="Please enter a creation Date."
                            onInput={inputHandler}
                            initialValue={formState.inputs.creationDate.value}
                            initialValid={formState.inputs.creationDate.isValid}
                        />
                        <Input
                            element="input"
                            id="login"
                            margin="normal"
                            className={classes.input}
                            required={true}
                            type="text"
                            variant="outlined"
                            color="primary"
                            label="marta&michał"
                            validators={[VALIDATOR_REQUIRE()]}
                            errorText="Please enter a Login."
                            onInput={inputHandler}
                            initialValue={formState.inputs.login.value}
                            initialValid={formState.inputs.login.isValid}
                        />
                        <Button type="submit" disabled={!formState.isValid} variant="contained" color="primary" className={classes.submit}>
                            SIGNUP
                        </Button>
                    </form>
                </Paper>
            </Container>
        </Container>
    );
};

export default Signup;
