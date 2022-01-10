import React, {useState, useEffect} from 'react';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import Dropdown from '../../components/Dropdown/Dropdown';
import {debounce} from './../../utils/utils';
import {API_KEY, API_URL} from './../../config';
import {fetchData} from './../../api/fetch';
import DetailsCard from './../../components/DetailsCard/DetailsCard';


import './styles/SearchPage.scss';

const previousNextArray = [];


function SearchPage() {
    const [inputValue, setInputValue] = useState(null);
    const [dropdownArray, setDropdownArray] = useState([]);
    const [ showDropDown, setShowDropdown] = useState(false);
    const [selectedSymbol, setSelectedSymbol] = useState('');
    const [stockDetails, setStockDetails] = useState({});
    const [showStockDetails, setShowStockDetails] = useState(false);
    const [currentSymbol, setCurrentSymbol] = useState('');
    

    const appendParams = (searchParams) => {
        const formattedUrl = new URL(API_URL);
        Object.keys(searchParams).forEach(item => {
            formattedUrl.searchParams.append(item, searchParams[item]);
        })
        return formattedUrl.href;
    }

    const fetchAllSymbols = () => {
        const searchParams = {
            'function': 'SYMBOL_SEARCH',
            'keywords': inputValue,
            'apikey': API_KEY
        }
        const urlWithParams = appendParams(searchParams);
       
        const data = fetchData(urlWithParams);
        return data;
    }

    const onChange = (event) => {
        console.log(event.target.value);
        setInputValue(event.target.value);
        setShowDropdown(false);
    }

    const onSelect=(event) => {
        setSelectedSymbol(event.target.dataset.symbol);
        setShowDropdown(false);
    }

    useEffect(() => {
        if(inputValue) {
            const symbolData = fetchAllSymbols(inputValue);
            symbolData.then(response => {
                setDropdownArray(response.bestMatches);
                setShowDropdown(true);
            }).catch((err) => {
                console.log('error', err);
            })
        }
    },[inputValue])


    const fetchStockData = (symbol) => {
        const searchParams = {
            'function': 'OVERVIEW',
            'symbol': symbol,
            'apikey': API_KEY
        }
        setCurrentSymbol(symbol);
        const urlWithParams = appendParams(searchParams);
        console.log('urlWithParams', urlWithParams);
        const stockData = fetchData(urlWithParams);
        stockData.then(response => {
            console.log('response...', response);
            
                setStockDetails(response);
                setShowStockDetails(true);
                if(!previousNextArray.includes(symbol)) {
                    previousNextArray.push(symbol);
                }      
            
        })

    }


    useEffect(() => {
        if(selectedSymbol) {
          fetchStockData(selectedSymbol);
        }
    }, [selectedSymbol])

    const onClickSubmit = () => {
        fetchStockData(inputValue);
    }

    const getPreviousSymbol = () => {
        const currentIndex = previousNextArray.indexOf(currentSymbol);
        if(currentIndex > -1) {
            return previousNextArray[currentIndex - 1];
        }
    }

    const getNextSymbol = () => {
        console.log('previousNextArray', previousNextArray);
        const currentIndex = previousNextArray.indexOf(currentSymbol);
        if(currentIndex > -1) {
            return previousNextArray[currentIndex + 1];
        } else {

        }
    }

    const onClickPrevious = () => {
        const symbolToSearch = getPreviousSymbol();
        if(symbolToSearch) {
            fetchStockData(symbolToSearch);
        }
       
    }

    const onClickNext = () => {
        const symbolToSearch = getNextSymbol();
        
        if(symbolToSearch) {
            fetchStockData(symbolToSearch);
        }  
    }


    const getStockDetails = () => {
        if(stockDetails['Error Message']) {
            return <div className="error-text"> {stockDetails['Error Message']}</div>
        } else if(stockDetails['Note']) {
            return <div className="note-text">{stockDetails['Note']}</div>
        } else if (Object.keys(stockDetails).length == 0) {
            return <div className="error-text"> No Stock Details Found for "{currentSymbol}"</div>
        } else if (Object.keys(stockDetails).length != 0){
            return <DetailsCard details={stockDetails} />
        }
    }

    
    return (
        <div className="search-container">
            <div className="search-input__container">
                <div>
                <Input classValues={'search-input'} onChange={debounce(onChange)} ></Input>
                {inputValue && showDropDown && <Dropdown list={dropdownArray} onSelect={onSelect}/>}
                </div>
                <Button buttonText={'Submit'} onClick={onClickSubmit} classValues={'primary-btn'}/>
            </div>
            <div>
                
            </div>
           
            {
                showStockDetails && getStockDetails()
            }
            {
                showStockDetails && (
                    <div className="search-nav__button">
                    <Button buttonText={'Previous'} onClick={onClickPrevious} classValues={'primary-btn prev-btn'} />
                    <Button buttonText={'Next'} onClick={onClickNext} classValues={'primary-btn next-btn'}/>
                    </div>
                )
            }
           
        </div>
    )
}

export default SearchPage
