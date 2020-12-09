import React from 'react'
import "../App.css";

const CustomCursor = ({ mouseX, mouseY}) => {

    console.log(mouseX, mouseY);

    return (
        <div className="circularCursor" style={{ left: mouseX, top: mouseY }} />
    )
}

export default CustomCursor