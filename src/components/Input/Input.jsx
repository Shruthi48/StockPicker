import React from 'react';
import './styles/Input.scss';

function Input({classValues, onChange, placeholder, value}) {
    return (
        <input className={classValues} onChange={onChange} placeholder={placeholder} >
            
        </input>
    )
}

export default Input
