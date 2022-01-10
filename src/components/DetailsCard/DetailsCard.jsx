import React from 'react';
import './styles/DetailsCard.scss';


const detailsMap = {
    'Name': 'Name',
    'Symbol': 'Symbol',
    'Description': 'Description',
    'Current Price': 'AnalystTargetPrice',
    'Industry': 'Industry',
    'PE Ratio': 'PERatio',
    'MarketCap': 'MarketCapitalization',
}

function DetailsCard({details}) {
    return (
        <div className="details-list__container">
            {Object.keys(detailsMap).map((item,index) => {
                return (<div key={`${index.toString()}-details-list`} className="details-list">
                    <div className="details-list-left">{item}</div>
                    <div className="details-list-right">{details[detailsMap[item]]}</div>
                </div>)
            })}
            
        </div>
    )
}

export default DetailsCard
