import React from 'react';
import './styles/Button.scss'

function Button({onClick, buttonText, classValues}) {
    return (
        <div role="button" onClick={onClick} className={classValues}>
            {buttonText}
        </div>
    )
}

export default Button
