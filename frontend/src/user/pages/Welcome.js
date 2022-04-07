import React, { useEffect, useState, useRef, useContext } from "react";
import { Redirect, useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { useHttpClient } from "../../shared/hooks/http-hook";
import Backdrop from "@material-ui/core/Backdrop";
import ImageGallery from "../../images/components/ImageGallery";
import LoginComponent from "../components/LoginComponent";
import { disableBodyScroll } from "body-scroll-lock";
import CircularProgress from "@material-ui/core/CircularProgress";
import { AuthContext } from "../../shared/context/auth-context";

const Welcome = props => {
    const auth = useContext(AuthContext);
    let welcomeURL = useParams().welcomeURL;
    const { sendRequest, error } = useHttpClient();
    const [loadedImages, setLoadedImages] = useState(false);
    useEffect(() => {
        setLoadedImages(false);
    }, [welcomeURL]);

    let targetElement = null;
    const targetRef = useRef(targetElement);

    useEffect(() => {
        const getImages = async () => {
            try {
                const responseData = await sendRequest("/images/welcome/" + welcomeURL + "/welcome", {}, "GET");
                let newImages = responseData.images.map(image => {
                    return {
                        key: image.id,
                        src: image.src,
                        width: parseInt(image.width),
                        height: parseInt(image.height)
                    };
                });
                setLoadedImages(newImages);
            } catch (err) {}
        };
        disableBodyScroll(targetElement);
        getImages();
    }, [welcomeURL, sendRequest, targetElement]);

    const useStyles = makeStyles(theme => ({
        backdrop: {
            zIndex: theme.zIndex.drawer + 100
        }
    }));
    const classes = useStyles();

    if (error) {
        auth.setNavigateToFalse();
        return <Redirect to="/" />;
    }

    if (!loadedImages) {
        return (
            <Backdrop className={classes.backdrop} open={true}>
                <CircularProgress color="secondary" />
            </Backdrop>
        );
    }
    return (
        <React.Fragment>
            <Backdrop invisible={true} className={classes.backdrop} open={true}>
                <LoginComponent />
            </Backdrop>
            {loadedImages && <ImageGallery forwardRef={targetRef} allPhotos={loadedImages} />}
        </React.Fragment>
    );
};

export default Welcome;
