import { useState, useCallback } from "react";
const axios = require("axios");

export const useHttpClient = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const sendRequest = useCallback(async (path, data = {}, method = "POST", headers = { Accept: "application/json", "Content-Type": "application/json;charset=UTF-8" }, timeout = 4000000) => {
        setIsLoading(true);

        let host = process.env.REACT_APP_DEVELOPMENT_HOST;
        if (process.env.NODE_ENV === "production") {
            host = process.env.REACT_APP_PRODUCTION_HOST;
        }

        try {
            const options = {
                url: host + path,
                data: data,
                method: method,
                headers: headers,
                timeout: timeout,
            };
            const response = await axios(options);

            if (response.status !== 200) {
                throw new Error(response.statusText);
            }

            setIsLoading(false);
            return response.data;
        } catch (err) {
            setError(err.response.data.message);
            setIsLoading(false);
            throw err;
        }
    }, []);

    const clearError = () => {
        setError(null);
    };

    return { isLoading, error, sendRequest, clearError };
};
