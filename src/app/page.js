"use client";
import React, { useContext, useEffect, useState, useRef } from "react";
import "./Home.css";
import { CoinContext } from "../context/CoinContext";
import ChartModal from "../components/ChartModal";

const Home = () => {
  const { allCoin, currency } = useContext(CoinContext);

  const [displayCoin, setDisplayCoin] = useState([]);
  const [input, setInput] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [sortCriteria, setSortCriteria] = useState("market_cap_rank");
  const [sortDirection, setSortDirection] = useState("asc");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const coinsPerPage = 10;
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const inputHandler = (event) => {
    const searchValue = event.target.value;
    setInput(searchValue);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      filterCoins(searchValue);
    }, 500);
  };

  const filterCoins = (searchValue = input) => {
    if (!searchValue) {
      setDisplayCoin(allCoin);
    } else {
      const filteredCoins = allCoin.filter((item) => {
        const priceString = item.current_price.toString();
        return (
          item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          priceString.includes(searchValue)
        );
      });
      setDisplayCoin(filteredCoins);
    }
    setCurrentPage(1);
  };

  useEffect(() => {
    // Keep displayCoin in sync with allCoin
    filterCoins(input);
  }, [allCoin]);
  // Dependency only allCoin. Input is handled by handler and filterCoins reads it, 
  // but if input changes we want to wait for debounce. 
  // Actually the previous logic had issues.
  // Let's rely on filterCoins being called by handler + useEffect for allCoin updates.

  const toggleFavorite = (coinId) => {
    setFavorites((prevFavorites) => {
      const isFavorite = prevFavorites.includes(coinId);
      const updatedFavorites = isFavorite
        ? prevFavorites.filter((id) => id !== coinId)
        : [...prevFavorites, coinId];
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      return updatedFavorites;
    });
  };

  const handleRowClick = (coinId) => {
    setSelectedCoin(coinId);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedCoin(null);
  };

  const sortCoins = (criteria) => {
    const direction = sortCriteria === criteria && sortDirection === "asc" ? "desc" : "asc";
    setSortCriteria(criteria);
    setSortDirection(direction);

    // Sorting logic applied to a copy of displayCoin
    const sorted = [...displayCoin].sort((a, b) => {
      const aValue = criteria === "name" ? a.name.toLowerCase() : a[criteria === 'price' ? 'current_price' : 'market_cap_rank'];
      const bValue = criteria === "name" ? b.name.toLowerCase() : b[criteria === 'price' ? 'current_price' : 'market_cap_rank'];
      return direction === "asc" ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
    });
    setDisplayCoin(sorted);
  };

  // Pagination Logic
  const indexOfLastCoin = currentPage * coinsPerPage;
  const indexOfFirstCoin = indexOfLastCoin - coinsPerPage;
  const currentCoins = displayCoin.slice(indexOfFirstCoin, indexOfLastCoin);
  const totalPages = Math.ceil(displayCoin.length / coinsPerPage);

  const getVisiblePages = () => {
    // Simple pagination logic for now (all pages if few, or limited)
    // Reusing old logic or simplifying
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // Logic to show current window of pages roughly
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, start + 4);
      if (end - start < 4) start = Math.max(1, end - 4); // adjusting start
      for (let i = start; i <= end; i++) pages.push(i);
    }
    return pages;
  };

  const favoriteCoinsList = allCoin.filter(coin => favorites.includes(coin.id));

  return (
    <div className="home">
      <div className="hero">
        <h2>Top 50 Crypto Coins</h2>
        <p>
          Stay ahead in the crypto market with real-time insights on the top 50
          cryptocurrencies by market cap, all in one intuitive dashboard.
        </p>
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            onChange={inputHandler}
            value={input}
            type="text"
            placeholder="Search crypto..."
            required
          />
          <button type="submit">Search</button>
        </form>
      </div>

      {/* Favorites Section */}
      {favoriteCoinsList.length > 0 && (
        <div className="favorites-section">
          <h3>Your Watchlist</h3>
          <div className="favorites-grid">
            {favoriteCoinsList.map(coin => (
              <div key={coin.id} className="fav-card" onClick={() => handleRowClick(coin.id)}>
                <div className="fav-card-top">
                  <img src={coin.image} alt={coin.name} />
                  <div>
                    <h4>{coin.name}</h4>
                    <span>{coin.symbol.toUpperCase()}</span>
                  </div>
                  <button
                    className="fav-btn active"
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(coin.id); }}
                  >
                    <i className="ri-star-fill"></i>
                  </button>
                </div>
                <div className="fav-card-price">
                  <p>{currency.symbol} {coin.current_price.toLocaleString()}</p>
                  <span className={coin.price_change_percentage_24h >= 0 ? "green" : "red"}>
                    {coin.price_change_percentage_24h?.toFixed(2)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="crypto-table">
        <div className="table-header">
          <p className="fav">Fav</p>
          <p>#</p>
          <p>
            Coins
            <button
              type="button"
              onClick={() => {
                sortCoins("name");
              }}
            >
              <span
                className={`sort-arrow ${sortCriteria === "name" ? sortDirection : ""
                  }`}
              ></span>
            </button>
          </p>
          <p>
            Price
            <button
              type="button"
              onClick={() => {
                sortCoins("price");
              }}
            >
              <span
                className={`sort-arrow ${sortCriteria === "price" ? sortDirection : ""
                  }`}
              ></span>
            </button>
          </p>
          <p style={{ textAlign: "center" }}>24H Change</p>
          <p className="market-cap">Market Cap</p>
        </div>
        {currentCoins.map((item) => (
          <div className="table-layout" key={item.id} onClick={() => handleRowClick(item.id)}>
            <button onClick={(e) => { e.stopPropagation(); toggleFavorite(item.id); }}>
              <i className={`ri-star-${favorites.includes(item.id) ? "fill" : "line"}`} style={{ color: favorites.includes(item.id) ? 'gold' : 'inherit' }}></i>
            </button>
            <p>{item.market_cap_rank}</p>
            <div>
              <img src={item.image} alt={item.name} />
              <p>{item.name + " - " + item.symbol}</p>
            </div>
            <p>{currency.symbol} {item.current_price.toLocaleString()}</p>
            <p className={item.price_change_percentage_24h > 0 ? "green" : "red"}>
              {Math.floor(item.price_change_percentage_24h * 100) / 100}
            </p>
            <p className="market-cap">{currency.symbol} {item.market_cap.toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div className="pagination-controls">
        <button className="prev" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Previous</button>
        <div className="page-numbers">
          {getVisiblePages().map(p => (
            <button key={p} onClick={() => setCurrentPage(p)} className={currentPage === p ? 'active-page' : ''}>{p}</button>
          ))}
        </div>
        <button className="next" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</button>
      </div>

      <ChartModal isOpen={modalIsOpen} onRequestClose={closeModal} coinId={selectedCoin} />
    </div>
  );
};

export default Home;
