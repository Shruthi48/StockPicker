import React, {useState, useEffect} from 'react';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import Dropdown from '../../components/Dropdown/Dropdown';
import {debounce} from './../../utils/utils';
import {API_KEY, API_URL} from './../../config';
import {fetchData} from './../../api/fetch';
import DetailsCard from './../../components/DetailsCard/DetailsCard';


import './styles/SearchPage.scss';


function SearchPage() {
    const [inputValue, setInputValue] = useState(null);
    const [dropdownArray, setDropdownArray] = useState([]);
    const  [ showDropDown, setShowDropdown] = useState(false);
    const [selectedSymbol, setSelectedSymbol] = useState('');
    const [stockDetails, setStockDetails] = useState({});
    const [showStockDetails, setShowStockDetails] = useState(false);
    const searchedSymbols = [];
    const nextSymbols = [];

    const appendParams = (searchParams) => {
        const formattedUrl = new URL(API_URL);
        Object.keys(searchParams).forEach(item => {
            formattedUrl.searchParams.append(item, searchParams[item]);
        })
        return formattedUrl.href;
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
        const searchParams = {
            'function': 'SYMBOL_SEARCH',
            'keywords': inputValue,
            'apikey': API_KEY
        }
        const urlWithParams = appendParams(searchParams);
       
        const data = fetchData(urlWithParams);
        data.then(response => {
            setDropdownArray(response.bestMatches);
            setShowDropdown(true);
        }).catch((err) => {
            console.log('error', err);
        })

        console.log(urlWithParams);

    },[inputValue])


    const fetchStockData = (symbol) => {
        const searchParams = {
            'function': 'OVERVIEW',
            'symbol': symbol,
            'apikey': API_KEY
        }
        const urlWithParams = appendParams(searchParams);
        console.log('urlWithParams', urlWithParams);
        const stockData = fetchData(urlWithParams);
        stockData.then(response => {
            console.log('response...', response);
            
                setStockDetails(response);
                setShowStockDetails(true);
                searchedSymbols.push(inputValue);
            
            
        })

    }


    useEffect(() => {
      
        fetchStockData(selectedSymbol);
        
    }, [selectedSymbol])


  

    const onClick = () => {
        fetchStockData(inputValue);
    }

    const onClickPrevious = () => {
        const symbolToSearch = searchedSymbols.pop();
        if(symbolToSearch) {
            nextSymbols.push(symbolToSearch);
            fetchStockData(symbolToSearch);
        }
       
    }

    const onClickNext = () => {
        const symbolToSearch = nextSymbols.pop();
        if(symbolToSearch) {
            searchedSymbols.push(symbolToSearch);
            fetchStockData(symbolToSearch);
        }  
    }


    const getStockDetails = () => {
        if(showStockDetails && stockDetails['Error Message']) {
            return <div className="error-text"> {stockDetails['Error Message']}</div>
        } else if(stockDetails['Note']) {
            return <div className="note-text">{stockDetails['Note']}</div>
        } else if (Object.keys(stockDetails).length == 0) {
            return <div className="error-text"> No Stock Details Found for "{inputValue}"</div>
        } else {
            
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
                <Button buttonText={'Submit'} onClick={onClick} classValues={'primary-btn'}/>
            </div>
            <div>
                
            </div>
           
            {
                getStockDetails()
            }
            <div className="search-nav__button">
            <Button buttonText={'Previous'} onClick={onClickPrevious} classValues={'primary-btn prev-btn'} disabled={searchedSymbols.length === 0}/>
            <Button buttonText={'Next'} onClick={onClickNext} classValues={'primary-btn next-btn'} disabled={nextSymbols.length === 0}/>
            </div>
        </div>
    )
}

export default SearchPage
