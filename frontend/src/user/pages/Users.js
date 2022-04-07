import React, { useEffect, useState } from "react";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import UsersTable from "../components/UsersTable";
import { makeStyles } from "@material-ui/core/styles";
import { useHttpClient } from "../../shared/hooks/http-hook";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";

const Users = () => {
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [loadedUsers, setLoadedUsers] = useState();

    useEffect(() => {
        const getUsers = async () => {
            try {
                const responseData = await sendRequest("/users/", {}, "GET");
                setLoadedUsers(responseData.users);
            } catch (err) {}
        };
        getUsers();
    }, [sendRequest]);

    const userDeletedHandler = (deletedUserId) => {
        setLoadedUsers((prevUsers) => prevUsers.filter((user) => user.id !== deletedUserId));
    };

    const userHiddenHandler = (hiddenUserId, status) => {
        setLoadedUsers((prevUsers) => prevUsers.map((user) => (user.id !== hiddenUserId ? user : { ...user, isHidden: status })));
    };

    const useStyles = makeStyles((theme) => ({
        container: {
            padding: theme.spacing(15, 0, 4, 0),
        },
        backdrop: {
            zIndex: theme.zIndex.drawer + 1,
            color: "#fff",
        },
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
        <Container className={classes.container}>
            <Container maxWidth="lg">
                <ErrorModal error={error} onClear={clearError} />
                {!isLoading && loadedUsers && <UsersTable items={loadedUsers} onDelete={userDeletedHandler} onHide={userHiddenHandler} />}
            </Container>
        </Container>
    );
};

export default Users;
