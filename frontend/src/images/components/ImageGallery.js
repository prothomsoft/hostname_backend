import React, { useEffect, useReducer, useState, useRef, useCallback, useContext } from "react";
import Gallery from "react-photo-gallery";
import ScrollUpButton from "react-scroll-up-button";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import { makeStyles } from "@material-ui/core/styles";
import { AuthContext } from "../../shared/context/auth-context";

let perPage = 20;

const columns = containerWidth => {
    let columns = 1;
    if (containerWidth >= 500) columns = 2;
    if (containerWidth >= 900) columns = 3;
    if (containerWidth >= 1500) columns = 4;
    return columns;
};

const reducer = (state, action) => {
    switch (action.type) {
        case "start":
            return { ...state, loading: false, images: action.allPhotos.slice(0, perPage), finish: false, after: perPage };
        case "loaded":
            return {
                ...state,
                loading: false,
                images: [...state.images, ...action.newImages],
                after: state.after + action.newImages.length,
                currentImage: 0,
                viewerIsOpen: false,
                finish: state.after + action.newImages.length === action.allPhotosLength
            };
        case "lightboxOpen":
            return { ...state, currentImage: action.index, viewerIsOpen: true };
        case "lightboxMoveNext":
            return { ...state, currentImage: action.index, viewerIsOpen: true };
        case "lightboxMovePrevious":
            return { ...state, currentImage: action.index, viewerIsOpen: true };
        case "lightboxClosed":
            return { ...state, currentImage: 0, viewerIsOpen: false };
        default:
            throw new Error("Error");
    }
};

const ImageGallery = props => {
    const { allPhotos } = props;
    const auth = useContext(AuthContext);
    const [state, dispatch] = useReducer(reducer, {
        loading: false,
        images: allPhotos.slice(0, perPage),
        finish: false,
        after: perPage
    });
    const { loading, images, after, finish, currentImage, viewerIsOpen } = state;

    useEffect(() => {
        dispatch({ type: "start", allPhotos });
    }, [allPhotos]);

    const load = useCallback(() => {
        const newImages = allPhotos.slice(after, after + perPage);
        const allPhotosLength = allPhotos.length;
        dispatch({ type: "loaded", newImages, allPhotosLength });
    }, [after, allPhotos]);

    const openLightbox = useCallback(
        (event, { index }) => {
            auth.hideAppBar();
            dispatch({ type: "lightboxOpen", index });
        },
        [auth]
    );

    const closeLightbox = () => {
        auth.showAppBar();
        dispatch({ type: "lightboxClosed" });
    };

    const moveNext = () => {
        let index = (currentImage + 1) % allPhotos.length;
        dispatch({ type: "lightboxMoveNext", index });
    };

    const movePrevious = () => {
        let index = (currentImage + allPhotos.length - 1) % allPhotos.length;
        dispatch({ type: "lightboxMovePrevious", index });
    };

    const loader = useRef(load);
    useEffect(() => {
        loader.current = load;
    }, [load]);

    const observer = useRef(
        new IntersectionObserver(
            entries => {
                const first = entries[0];
                if (first.isIntersecting) {
                    loader.current();
                }
            },
            { threshhold: 1 }
        )
    );

    const [element, setElement] = useState(null);

    useEffect(() => {
        const currentElement = element;
        const currentObserver = observer.current;
        if (currentElement) {
            currentObserver.observe(currentElement);
        }
        return () => {
            if (currentElement) {
                currentObserver.unobserve(currentElement);
            }
        };
    }, [element]);

    const useStyles = makeStyles(theme => ({
        space: {
            padding: theme.spacing(2, 0, 2, 0)
        }
    }));
    const classes = useStyles();

    return (
        <div>
            <ScrollUpButton style={{ width: 40 }} ToggledStyle={{ right: 20 }} />
            <Gallery photos={images} direction={"column"} columns={columns} onClick={openLightbox} />
            {viewerIsOpen && (
                <Lightbox
                    enableZoom={false}
                    mainSrc={allPhotos[currentImage].src}
                    nextSrc={allPhotos[(currentImage + 1) % images.length].src}
                    prevSrc={allPhotos[(currentImage + allPhotos.length - 1) % allPhotos.length].src}
                    onCloseRequest={closeLightbox}
                    onMovePrevRequest={movePrevious}
                    onMoveNextRequest={moveNext}
                />
            )}
            {!loading && !finish && <div className={classes.space} ref={setElement} onClick={load}></div>}
        </div>
    );
};

export default ImageGallery;
