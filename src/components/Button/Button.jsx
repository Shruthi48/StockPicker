import React from 'react';
import classname from 'classnames';
import './styles/Button.scss'

function Button({onClick, buttonText, classValues, isDisabled}) {
    return (
        <div role="button" onClick={onClick} className={classname(classValues,{
            'btn-disabled' : isDisabled
        })} disabled={isDisabled}>
            {buttonText}
        </div>
    )
}

export default Button
