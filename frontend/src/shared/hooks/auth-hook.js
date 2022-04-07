import { useState, useCallback, useEffect } from "react";

let logoutTimer;

export const useAuth = () => {
    const [token, setToken] = useState(false);
    const [isAppBarDisplayed, setIsAppBarDisplayed] = useState(true);
    const [isNavigate, setIsNavigate] = useState(false);
    const [tokenExpirationDate, setTokenExpirationDate] = useState();
    const [userId, setUserId] = useState(false);
    const [name, setName] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isSlub, setIsSlub] = useState(false);
    const [isSesjaNarzeczenska, setIsSesjaNarzeczenska] = useState(false);
    const [isSesjaSlubna, setIsSesjaSlubna] = useState(false);
    const [isSesjaOkolicznosciowa, setIsSesjaOkolicznosciowa] = useState(false);
    const [welcomeURL, setWelcomeURL] = useState(false);

    const login = useCallback((userId, isAdmin, token, name, isSlub, isSesjaNarzeczenska, isSesjaSlubna, isSesjaOkolicznosciowa, welcomeURL, expirationDate) => {
        setUserId(userId);
        setName(name);
        setIsAdmin(isAdmin);
        setIsSlub(isSlub);
        setIsSesjaNarzeczenska(isSesjaNarzeczenska);
        setIsSesjaSlubna(isSesjaSlubna);
        setIsSesjaOkolicznosciowa(isSesjaOkolicznosciowa);
        setWelcomeURL(welcomeURL);
        setToken(token);
        const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
        setTokenExpirationDate(tokenExpirationDate);
        localStorage.setItem(
            "userData",
            JSON.stringify({
                userId: userId,
                name: name,
                isAdmin: isAdmin,
                isSlub: isSlub,
                isSesjaNarzeczenska: isSesjaNarzeczenska,
                isSesjaSlubna: isSesjaSlubna,
                isSesjaOkolicznosciowa: isSesjaOkolicznosciowa,
                welcomeURL: welcomeURL,
                token: token,
                expiration: tokenExpirationDate.toISOString()
            })
        );
    }, []);

    const hideAppBar = useCallback(() => {
        setIsAppBarDisplayed(false);
    }, []);

    const showAppBar = useCallback(() => {
        setIsAppBarDisplayed(true);
    }, []);

    const logout = useCallback(() => {
        setIsNavigate(true);
        setUserId(null);
        setName(null);
        setIsAdmin(null);
        setIsSlub(null);
        setIsSesjaNarzeczenska(null);
        setIsSesjaSlubna(null);
        setIsSesjaOkolicznosciowa(null);
        setToken(null);
        setTokenExpirationDate(null);
        localStorage.removeItem("userData");
    }, []);

    const setNavigateToFalse = useCallback(() => {
        setIsNavigate(false);
    }, []);

    useEffect(() => {
        if (token && tokenExpirationDate) {
            const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
            logoutTimer = setTimeout(logout, remainingTime);
        } else {
            clearTimeout(logoutTimer);
        }
    }, [token, logout, tokenExpirationDate]);

    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem("userData"));
        if (storedData && storedData.token && new Date(storedData.expiration) > new Date()) {
            login(
                storedData.userId,
                storedData.isAdmin,
                storedData.token,
                storedData.name,
                storedData.isSlub,
                storedData.isSesjaNarzeczenska,
                storedData.isSesjaSlubna,
                storedData.isSesjaOkolicznosciowa,
                storedData.welcomeURL,
                new Date(storedData.expiration)
            );
        }
    }, [login]);

    return {
        token,
        login,
        logout,
        hideAppBar,
        showAppBar,
        setNavigateToFalse,
        userId,
        name,
        isAdmin,
        isAppBarDisplayed,
        isNavigate,
        isSlub,
        isSesjaNarzeczenska,
        isSesjaSlubna,
        isSesjaOkolicznosciowa,
        welcomeURL
    };
};
