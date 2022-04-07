import React, { useEffect } from "react";

const Logout = props => {
    const { logout, setNavigateToFalse } = props;

    useEffect(() => {
        console.log("wer");
        logout();
        setNavigateToFalse();
    }, [logout, setNavigateToFalse]);

    return <React.Fragment></React.Fragment>;
};

export default Logout;
