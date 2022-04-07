import React, { useContext } from "react";
import Input from "../../shared/components/FormElements/Input";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { VALIDATOR_REQUIRE } from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import FacebookIcon from "@material-ui/icons/Facebook";
import InstagramIcon from "@material-ui/icons/Instagram";

const LoginComponent = () => {
    const auth = useContext(AuthContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [formState, inputHandler] = useForm(
        {
            login: {
                value: "",
                isValid: false
            }
        },
        false
    );

    const loginSubmitHandler = async event => {
        event.preventDefault();
        try {
            const responseData = await sendRequest(
                "/users/login",
                {
                    login: formState.inputs.login.value.trim()
                },
                "POST"
            );
            auth.login(
                responseData.userId,
                responseData.isAdmin,
                responseData.token,
                responseData.name,
                responseData.isSlub,
                responseData.isSesjaNarzeczenska,
                responseData.isSesjaSlubna,
                responseData.isSesjaOkolicznosciowa,
                responseData.welcomeURL
            );
        } catch (err) {}
    };

    const useStyles = makeStyles(theme => ({
        backdrop: {
            zIndex: theme.zIndex.drawer + 1,
            color: "#fff"
        },
        paper: {
            padding: theme.spacing(3),
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "rgba(0, 0, 0, 1)"
        },
        avatar: {
            margin: theme.spacing(1, 0, 3, 0),
            width: "100px"
        },
        input: {
            width: "100%"
        },
        submit: {
            width: "100%",
            margin: theme.spacing(3, 0, 0, 0),
            padding: theme.spacing(1.2, 2.3, 1, 2.3)
        },
        copyrightsTop: {
            padding: theme.spacing(4, 0, 2, 0),
            width: "100%",
            textAlign: "center"
        },
        copyrightsBottom: {
            width: "100%",
            textAlign: "center"
        },
        space: {
            padding: theme.spacing(0, 0, 1, 0)
        }
    }));

    const classes = useStyles();
    if (isLoading) {
        return (
            <Backdrop className={classes.backdrop} open={true}>
                <CircularProgress color="inherit" />
            </Backdrop>
        );
    }

    return (
        <Container>
            <Container maxWidth="xs">
                <ErrorModal error={error} onClear={clearError} />
                <Paper className={classes.paper}>
                    <Link color="inherit" href="https://99foto.pl/" target="_blank">
                        <img src="https://sk99foto.s3.eu-west-3.amazonaws.com/logo/99foto_logo.svg" className={classes.avatar} alt="" />{" "}
                    </Link>
                    <Typography component="h1" variant="button" className={classes.space}>
                        LOGOWANIE DO STREFY KLIENTA
                    </Typography>
                    <form onSubmit={loginSubmitHandler} noValidate>
                        <Input
                            element="input"
                            id="login"
                            margin="normal"
                            className={classes.input}
                            required={true}
                            type="text"
                            variant="outlined"
                            color="primary"
                            label="Twoje hasło"
                            validators={[VALIDATOR_REQUIRE()]}
                            errorText="Twoje hasło jest polem wymaganym."
                            onInput={inputHandler}
                            initialValue={formState.inputs.login.value}
                            initialValid={formState.inputs.login.isValid}
                        />
                        <Button type="submit" disabled={!formState.isValid} variant="contained" color="primary" size="large" className={classes.submit}>
                            LOGOWANIE
                        </Button>
                    </form>
                    <Container className={classes.copyrightsTop}>
                        <Typography variant="button">{"OBSERWUJ MNIE"}</Typography>
                    </Container>
                    <Container className={classes.copyrightsBottom}>
                        <Typography variant="button">
                            <Link color="inherit" href="https://www.facebook.com/99foto" target="_blank">
                                <FacebookIcon fontSize={"large"} />
                            </Link>
                            {"  "}
                            <Link color="inherit" href="https://www.instagram.com/99foto.pl/" target="_blank">
                                <InstagramIcon fontSize={"large"} />
                            </Link>
                        </Typography>
                    </Container>
                </Paper>
            </Container>
        </Container>
    );
};
export default LoginComponent;
