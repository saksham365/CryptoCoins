import React, { useContext } from 'react'
import './Navbar.css'
import { CoinContext } from '../../context/CoinContext'

const Navbar = () => {

  const {setCurrency} = useContext(CoinContext)
  const currencyHandler = (event) => {
    switch(event.target.value){
      case "usd":{
        setCurrency({name:"usd", symbol:"$"});
        break;
      }
      case "inr":{
        setCurrency({name:"inr", symbol:"₹"});
        break;
      }
      default:{
        setCurrency({name:"usd", symbol:"$"});
        break;
      }

    }
  }

  return (
    <div className='navbar'>
      <h1>CryptoCoins</h1>
      <ul>
        <li>Home</li>
        <li>Favorites</li>
      </ul>
      <div className='nav-right'>
        <select onChange={currencyHandler}>
            <option value="usd">USD</option>
            <option value="inr">INR</option>
        </select>
      </div>
    </div>

  )
}

export default Navbar
