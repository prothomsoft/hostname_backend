import React, { useEffect, useState } from "react";
import { Redirect, useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { useHttpClient } from "../../shared/hooks/http-hook";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import ImageGallery from "../components/ImageGallery";
import { clearAllBodyScrollLocks } from "body-scroll-lock";

const UserImages = (props) => {
    let userid = useParams().userid;
    let category = useParams().category;
    const { userId, isSlub, isSesjaNarzeczenska, isSesjaOkolicznosciowa } = props;

    if (typeof userid === "undefined" || userid == null) {
        userid = userId;
    }

    if (!category) {
        category = "slub";
        if (!isSlub && isSesjaNarzeczenska) {
            category = "sesja_narzeczenska";
        }
        if (!isSlub && isSesjaOkolicznosciowa) {
            category = "sesja_okolicznosciowa";
        }
    }

    const { sendRequest, error } = useHttpClient();
    const [loadedImages, setLoadedImages] = useState(false);
    useEffect(() => {
        setLoadedImages(false);
        clearAllBodyScrollLocks();
    }, [category]);

    useEffect(() => {
        const getImages = async () => {
            try {
                const responseData = await sendRequest("/images/user/" + userid + "/" + category, {}, "GET");
                let newImages = responseData.images.map((image) => {
                    return {
                        key: image.id,
                        src: image.src,
                        width: parseInt(image.width),
                        height: parseInt(image.height),
                    };
                });
                setLoadedImages(newImages);
            } catch (err) {}
        };
        getImages();
    }, [userid, category, sendRequest]);

    const useStyles = makeStyles((theme) => ({
        backdrop: {
            zIndex: theme.zIndex.drawer + 100,
            color: "#fff",
        },
    }));
    const classes = useStyles();

    if (error) {
        return <Redirect to="/" />;
    }

    if (!loadedImages) {
        return (
            <Backdrop className={classes.backdrop} open={true}>
                <CircularProgress color="secondary" />
            </Backdrop>
        );
    }
    return <React.Fragment>{loadedImages && <ImageGallery allPhotos={loadedImages} />}</React.Fragment>;
};

export default UserImages;
