import {useEffect, useState} from "react";

const UseIsSmallScreen = size => {
    const [windowSize, setWindowSize] = useState(undefined);
    useEffect(() => {
        function handleResize() {
            setWindowSize(window.innerWidth);
        }

        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return size ? windowSize <= size : windowSize <= 800;
}

export {UseIsSmallScreen}