import React, {useState, useEffect} from 'react';

import {UseShowOnScrollTo} from "../hooks/userShowOnScrollTo";

import "./index.scss";

const BackToTop = ({smoothScroll, showAtHeight}) => {

    const showImg = UseShowOnScrollTo(showAtHeight);
    const onClick = () => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: smoothScroll ? "smooth" : "auto",
        });
    }

    return showImg ? <div className="BackToTop">
        <img src="https://static.wixstatic.com/media/da3fd9_5c68b1fac27d4d14bfa272178a596d9d~mv2.png"
             alt="יש ללחוץ על מנת לחזור לתחילת העמוד"
             onClick={onClick}/>
    </div> : <></>;
}

export {BackToTop};