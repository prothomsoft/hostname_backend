import { createContext } from "react";

export const AuthContext = createContext({
    isLoggedIn: false,
    isAdmin: false,
    isAppBarDisplayed: true,
    isSlub: false,
    isSesjaNarzeczenska: false,
    isSesjaSlubna: false,
    isSesjaOkolicznosciowa: false,
    name: null,
    userId: null,
    token: null,
    login: () => {},
    logout: () => {},
    showAppBar: () => {},
    hideAppBar: () => {},
    setNavigateToFalse: () => {}
});
