import React from "react";
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import Users from "./user/pages/Users";
import Login from "./user/pages/Login";
import Welcome from "./user/pages/Welcome";
import UserImages from "./images/pages/UserImages";
import Signup from "./user/pages/Signup";
import UploadImage from "./upload_images/pages/UploadImage";
import { AuthContext } from "./shared/context/auth-context";
import { useAuth } from "./shared/hooks/auth-hook";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/core/styles";
import Navigation from "./shared/components/UIElements/Navigation";
import Logout from "./shared/components/UIElements/Logout";
import CssBaseline from "@material-ui/core/CssBaseline";

const customVars = createMuiTheme({
    palette: {
        type: "dark",
        primary: {
            light: "#64d8cb",
            main: "#26a69a",
            dark: "#00766c",
            contrastText: "#fff"
        },
        secondary: {
            light: "#a7c0cd",
            main: "#78909c",
            dark: "#4b636e",
            contrastText: "#fff"
        },
        error: {
            light: "#ff867c",
            main: "#ef5350",
            dark: "#b61827",
            contrastText: "#fff"
        },
        background: {
            default: "#000"
        }
    }
});

const App = () => {
    const {
        token,
        login,
        logout,
        hideAppBar,
        showAppBar,
        setNavigateToFalse,
        isAppBarDisplayed,
        isNavigate,
        userId,
        name,
        isAdmin,
        isSlub,
        isSesjaNarzeczenska,
        isSesjaSlubna,
        isSesjaOkolicznosciowa,
        welcomeURL
    } = useAuth();
    let routes;
    if (token && isAdmin) {
        routes = (
            <Switch>
                <Route path="/" exact>
                    <Users />
                </Route>
                <Route path="/signup" exact>
                    <Signup />
                </Route>
                <Route path="/upload/:userid/:category" exact>
                    <UploadImage />
                </Route>
                <Route path="/upload" exact>
                    <UploadImage />
                </Route>
                <Route path="/images/:userid/:category" exact>
                    <UserImages />
                </Route>
                <Redirect to="/" />
            </Switch>
        );
    } else if (token && !isAdmin) {
        routes = (
            <Switch>
                <Route path="/" exact>
                    <UserImages userId={userId} isSlub={isSlub} isSesjaNarzeczenska={isSesjaNarzeczenska} isSesjaOkolicznosciowa={isSesjaOkolicznosciowa} />
                </Route>
                {/*temporary redirections for weddings*/}
                <Route path="/annapiotr" exact>
                    <Logout logout={logout} setNavigateToFalse={setNavigateToFalse} />
                    <Redirect to={`/login`} push={true} />}
                </Route>
                <Route path="/izaarek" exact>
                    <Logout logout={logout} setNavigateToFalse={setNavigateToFalse} />
                    <Redirect to={`/login`} push={true} />}
                </Route>
                <Route path="/dajanasylwester" exact>
                    <Logout logout={logout} setNavigateToFalse={setNavigateToFalse} />
                    <Redirect to={`/login`} push={true} />}
                </Route>
                {/*temporary redirections for baptists*/}
                <Route path="/karolina" exact>
                    <Logout logout={logout} setNavigateToFalse={setNavigateToFalse} />
                    <Redirect to={`/login`} push={true} />}
                </Route>
                <Route path="/patryk" exact>
                    <Logout logout={logout} setNavigateToFalse={setNavigateToFalse} />
                    <Redirect to={`/login`} push={true} />}
                </Route>
                <Route path="/filip" exact>
                    <Logout logout={logout} setNavigateToFalse={setNavigateToFalse} />
                    <Redirect to={`/login`} push={true} />}
                </Route>
                <Route path="/alicja" exact>
                    <Logout logout={logout} setNavigateToFalse={setNavigateToFalse} />
                    <Redirect to={`/login`} push={true} />}
                </Route>
                <Route path="/antosia" exact>
                    <Logout logout={logout} setNavigateToFalse={setNavigateToFalse} />
                    <Redirect to={`/login`} push={true} />}
                </Route>
                <Route path="/amelia" exact>
                    <Logout logout={logout} setNavigateToFalse={setNavigateToFalse} />
                    <Redirect to={`/login`} push={true} />}
                </Route>
                <Route path="/tymon" exact>
                    <Logout logout={logout} setNavigateToFalse={setNavigateToFalse} />
                    <Redirect to={`/login`} push={true} />}
                </Route>
                <Route path="/images/:userid/:category" exact>
                    <UserImages isSlub={isSlub} />
                </Route>
                <Redirect to="/" />
            </Switch>
        );
    } else {
        routes = (
            <Switch>
                <Route path="/" exact>
                    {isNavigate && !isAdmin && <Redirect to={`/login/${welcomeURL}`} push={true} />}
                    <Login />
                </Route>
                <Route path="/login/:welcomeURL" exact>
                    <Welcome />
                </Route>
                <Route path="/login" exact>
                    <Login />
                </Route>
                <Route path="/signup">
                    <Signup />
                </Route>
                {/*temporary redirections for weddings*/}
                <Route path="/annapiotr">
                    <Logout logout={logout} setNavigateToFalse={setNavigateToFalse} />
                    <Redirect to={`/login/annapiotr`} push={true} />
                </Route>
                <Route path="/izaarek">
                    <Logout logout={logout} setNavigateToFalse={setNavigateToFalse} />
                    <Redirect to={`/login/izaarek`} push={true} />
                </Route>
                <Route path="/dajanasylwester">
                    <Logout logout={logout} setNavigateToFalse={setNavigateToFalse} />
                    <Redirect to={`/login/dajanasylwester`} push={true} />
                </Route>
                {/*temporary redirections for baptists*/}
                <Route path="/karolina">
                    <Logout logout={logout} setNavigateToFalse={setNavigateToFalse} />
                    <Redirect to={`/login/karolina`} push={true} />
                </Route>
                <Route path="/patryk">
                    <Logout logout={logout} setNavigateToFalse={setNavigateToFalse} />
                    <Redirect to={`/login/patryk`} push={true} />
                </Route>
                <Route path="/filip">
                    <Logout logout={logout} setNavigateToFalse={setNavigateToFalse} />
                    <Redirect to={`/login/filip`} push={true} />
                </Route>
                <Route path="/alicja">
                    <Logout logout={logout} setNavigateToFalse={setNavigateToFalse} />
                    <Redirect to={`/login/alicja`} push={true} />
                </Route>
                <Route path="/antosia">
                    <Logout logout={logout} setNavigateToFalse={setNavigateToFalse} />
                    <Redirect to={`/login/antosia`} push={true} />
                </Route>
                <Route path="/amelia">
                    <Logout logout={logout} setNavigateToFalse={setNavigateToFalse} />
                    <Redirect to={`/login/amelia`} push={true} />
                </Route>
                <Route path="/tymon">
                    <Logout logout={logout} setNavigateToFalse={setNavigateToFalse} />
                    <Redirect to={`/login/tymon`} push={true} />
                </Route>
                <Redirect to="/" />
            </Switch>
        );
    }

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn: !!token,
                isAdmin: isAdmin,
                isAppBarDisplayed: isAppBarDisplayed,
                isNavigate: isNavigate,
                token: token,
                userId: userId,
                name: name,
                login: login,
                logout: logout,
                showAppBar: showAppBar,
                hideAppBar: hideAppBar,
                setNavigateToFalse: setNavigateToFalse
            }}
        >
            <ThemeProvider theme={customVars}>
                <Router>
                    <CssBaseline>
                        {token && isAppBarDisplayed && (
                            <Navigation
                                token={token}
                                isAdmin={isAdmin}
                                logout={logout}
                                userId={userId}
                                name={name}
                                isSlub={isSlub}
                                isSesjaNarzeczenska={isSesjaNarzeczenska}
                                isSesjaSlubna={isSesjaSlubna}
                                isSesjaOkolicznosciowa={isSesjaOkolicznosciowa}
                            />
                        )}
                        {routes}
                    </CssBaseline>
                </Router>
            </ThemeProvider>
        </AuthContext.Provider>
    );
};
export default App;
