import React from 'react';
import './styles/Dropdown.scss';

function Dropdown({list, onSelect}) {
  
    return list ? (
        <div onClick={onSelect}>
        {list.map((item,index) => {
            return <div key={`${index.toString()}_list-item`} data-symbol={item[`1. symbol`]} className="dropdown-list"> {item[`1. symbol`]} </div>
        })}
        </div>
    ) : <div></div>
}

export default Dropdown
