import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Typography from "@material-ui/core/Typography";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import List from "@material-ui/core/List";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Link from "@material-ui/core/Link";

const Navigation = (props) => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const { token, isAdmin, logout, userId, name, isSlub, isSesjaNarzeczenska, isSesjaSlubna, isSesjaOkolicznosciowa } = props;

    const handleDrawerOpen = () => {
        setDrawerOpen(true);
    };
    const handleDrawerClose = () => {
        setDrawerOpen(false);
    };
    const handleDrawerCloseAndLogout = () => {
        setDrawerOpen(false);
        logout();
    };
    const useStyles = makeStyles((theme) => ({
        title: {
            flexGrow: 1,
        },
        hide: {
            display: "none",
        },
        drawer: {
            flexShrink: 0,
        },
        appBar: {
            backgroundColor: "#111",
        },
        drawerPaper: {
            backgroundColor: "#111",
        },
        link: {
            color: "#FFF",
        },
        drawerHeader: {
            display: "flex",
            alignItems: "center",
            padding: theme.spacing(0, 1),
            ...theme.mixins.toolbar,
            justifyContent: "flex-start",
        },
    }));
    const classes = useStyles();

    return (
        <React.Fragment>
            <AppBar position="relative" className={clsx(classes.appBar)}>
                <Toolbar>
                    <Typography variant="h6" noWrap className={classes.title}>
                        {isAdmin && (
                            <Link variant="h6" className={classes.link} component={NavLink} to={`/`}>
                                ADMIN
                            </Link>
                        )}
                        {!isAdmin && <React.Fragment>{name}</React.Fragment>}
                    </Typography>
                    <IconButton color="inherit" aria-label="open drawer" edge="end" onClick={handleDrawerOpen} className={clsx(drawerOpen && classes.hide)}>
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="right"
                open={drawerOpen}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <div className={classes.drawerHeader}>
                    <IconButton onClick={handleDrawerClose}>
                        <ChevronRightIcon />
                    </IconButton>
                </div>
                <List>
                    {token && !isAdmin && (
                        <React.Fragment>
                            {isSlub && (
                                <ListItem button key="SLUB" component={NavLink} to={`/images/${userId}/slub`} onClick={handleDrawerClose}>
                                    <ListItemText primary=" ZDJĘCIA ŚLUBNE " />
                                </ListItem>
                            )}
                            {isSesjaNarzeczenska && (
                                <ListItem button key="SESJA NARZECZEŃSKA" component={NavLink} to={`/images/${userId}/sesja_narzeczenska`} onClick={handleDrawerClose}>
                                    <ListItemText primary=" SESJA NARZECZEŃSKA " />
                                </ListItem>
                            )}
                            {isSesjaSlubna && (
                                <ListItem button key="SESJA SLUBNA" component={NavLink} to={`/images/${userId}/sesja_slubna`} onClick={handleDrawerClose}>
                                    <ListItemText primary=" SESJA ŚLUBNA " />
                                </ListItem>
                            )}
                            {isSesjaOkolicznosciowa && (
                                <ListItem button key="SESJA OKOLICZNOŚCIOWA" component={NavLink} to={`/images/${userId}/sesja_okolicznosciowa`} onClick={handleDrawerClose}>
                                    <ListItemText primary=" SESJA OKOLICZNOŚCIOWA " />
                                </ListItem>
                            )}
                        </React.Fragment>
                    )}
                    {!token && (
                        <React.Fragment>
                            <ListItem button key="LOGIN" component={NavLink} to="/login" onClick={handleDrawerClose}>
                                <ListItemText primary=" LOGIN " />
                            </ListItem>
                            <ListItem button key="SIGNUP" component={NavLink} to="/signup" onClick={handleDrawerClose}>
                                <ListItemText primary=" SIGNUP " />
                            </ListItem>
                        </React.Fragment>
                    )}
                    {token && isAdmin && (
                        <React.Fragment>
                            <ListItem button key="LIST OF USERS" component={NavLink} to="/">
                                <ListItemText primary=" LIST OF USERS " onClick={handleDrawerClose} />
                            </ListItem>
                            <ListItem button key="ADD NEW USER" component={NavLink} to="/signup">
                                <ListItemText primary=" ADD NEW USER " onClick={handleDrawerClose} />
                            </ListItem>
                            <ListItem button key="ADD USER IMAGES" component={NavLink} to="/upload">
                                <ListItemText primary=" ADD USER IMAGES " onClick={handleDrawerClose} />
                            </ListItem>
                        </React.Fragment>
                    )}
                    {token && (
                        <ListItem button key="WYLOGUJ" component={NavLink} to="/logout" onClick={handleDrawerCloseAndLogout}>
                            <ListItemText primary=" WYLOGUJ " />
                        </ListItem>
                    )}
                </List>
            </Drawer>
        </React.Fragment>
    );
};

export default Navigation;
