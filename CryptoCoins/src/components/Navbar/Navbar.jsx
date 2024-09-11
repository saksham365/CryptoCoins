import React from 'react'
import './Navbar.css'

const Navbar = () => {
  return (
    <div className='navbar'>
      <h1>CryptoCoins</h1>
      <ul>
        <li>Home</li>
        <li>Favorites</li>
      </ul>
      <div className='nav-right'>
        <select >
            <option value="usd">USD</option>
            <option value="inr">INR</option>
        </select>
      </div>
    </div>

  )
}

export default Navbar
