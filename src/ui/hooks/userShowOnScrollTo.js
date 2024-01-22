import {useEffect, useState} from "react";

const UseShowOnScrollTo = scrollHeight => {
    const [shown, setShown] = useState(scrollHeight ? false : true);

    useEffect(() => {
        const handleScroll = () => {
            const shouldShow = scrollHeight ? window.scrollY > scrollHeight : true;
            setShown(shouldShow);
        }

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return shown;
};
export {UseShowOnScrollTo};