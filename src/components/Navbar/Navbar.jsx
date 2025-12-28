"use client";
import React, { useContext } from "react";
import "./Navbar.css";
import { CoinContext } from "../../context/CoinContext";
import { ThemeContext } from "../../context/ThemeContext";
import Link from "next/link";

const Navbar = () => {
  const { setCurrency } = useContext(CoinContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const currencyHandler = (event) => {
    switch (event.target.value) {
      case "usd": {
        setCurrency({ name: "usd", symbol: "$" });
        break;
      }
      case "inr": {
        setCurrency({ name: "inr", symbol: "₹" });
        break;
      }
      default: {
        setCurrency({ name: "usd", symbol: "$" });
        break;
      }
    }
  };

  return (
    <div className="navbar">
      <Link href={'/'}>
      <h1>CryptoCoins</h1>
      </Link>

      <div className="nav-right">
        <select onChange={currencyHandler}>
          <option value="usd">USD</option>
          <option value="inr">INR</option>
        </select>
        <button className="theme-toggle" onClick={toggleTheme}>
            {theme === 'light' ? <i className="ri-moon-line"></i> : <i className="ri-sun-line"></i>}
        </button>
      </div>
    </div>
  );
};

export default Navbar;
