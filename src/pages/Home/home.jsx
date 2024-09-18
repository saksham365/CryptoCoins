import React, { useContext, useEffect, useState } from "react";
import "./Home.css";
import { CoinContext } from "../../context/CoinContext";
import ChartModal from "../../components/ChartModal";
import debounce from 'lodash/debounce'; 

const Home = () => {
  const { allCoin, currency } = useContext(CoinContext);

  const [displayCoin, setDisplayCoin] = useState([]);
  const [input, setInput] = useState("");
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });
  const [sortCriteria, setSortCriteria] = useState('market_cap_rank');
  const [sortDirection, setSortDirection] = useState('asc');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState(null);

  // Debounced search function
  const debouncedSearch = debounce(async (searchInput) => {
    const coins = allCoin.filter((item) => {
      return item.name.toLowerCase().includes(searchInput.toLowerCase());
    });
    setDisplayCoin(coins);
  }, 1000); // Debounce delay

  const inputHandler = (event) => {
    setInput(event.target.value);
    debouncedSearch(event.target.value); // Call debounced search
  };

  useEffect(() => {
    setDisplayCoin(allCoin);
  }, [allCoin]);

  const toggleFavorite = (coinId) => {
    setFavorites((prevFavorites) => {
      const isFavorite = prevFavorites.includes(coinId);
      const updatedFavorites = isFavorite
        ? prevFavorites.filter(id => id !== coinId)
        : [...prevFavorites, coinId];
        
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      
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

  const sortedDisplayCoin = displayCoin.slice(0, 50).sort((a, b) => {
    if (favorites.includes(a.id) && !favorites.includes(b.id)) return -1;
    if (!favorites.includes(a.id) && favorites.includes(b.id)) return 1;

    const aValue = sortCriteria === 'name' ? a.name : sortCriteria === 'price' ? a.current_price : a.market_cap_rank;
    const bValue = sortCriteria === 'name' ? b.name : sortCriteria === 'price' ? b.current_price : b.market_cap_rank;
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    } else {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
    }
  });

  return (
    <div className="home">
      <div className="hero">
        <h2>Top 50 Crypto Coins</h2>
        <p>
          Stay ahead in the crypto market with real-time insights on the top 50
          cryptocurrencies by market cap, all in one intuitive dashboard.
        </p>
        <form id="form">
          <input
            onChange={inputHandler}
            value={input}
            type="text"
            placeholder="Search crypto..."
            required
          />
          <button type="button" onClick={() => debouncedSearch(input)}>Search</button>
        </form>
      </div>
      <div className="crypto-table">
        <div className="table-header">
          <p className="fav">Fav</p>
          <p>#</p>
          <p>
            Coins
            <button
              type="button"
              onClick={() => {
                setSortCriteria('name');
                setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
              }}
            >
              <span className={`sort-arrow ${sortCriteria === 'name' ? sortDirection : ''}`}></span>
            </button>
          </p>
          <p>
            Price
            <button
              type="button"
              onClick={() => {
                setSortCriteria('price');
                setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
              }}
            >
              <span className={`sort-arrow ${sortCriteria === 'price' ? sortDirection : ''}`}></span>
            </button>
          </p>
          <p style={{ textAlign: "center" }}>24H Change</p>
          <p className="market-cap">Market Cap</p>
        </div>
        {sortedDisplayCoin.map((item, index) => (
          <div
            className="table-layout"
            key={index}
            onClick={() => handleRowClick(item.id)}
          >
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent row click from firing
                toggleFavorite(item.id);
              }}
              className={favorites.includes(item.id) ? 'favorite' : ''}
            >
              <i className={`ri-star-${favorites.includes(item.id) ? 'fill' : 'line'}`}></i>
            </button>
            <p>{item.market_cap_rank}</p>
            <div>
              <img src={item.image} alt={item.name} />
              <p>{item.name + " - " + item.symbol}</p>
            </div>
            <p>
              {currency.symbol} {item.current_price.toLocaleString()}
            </p>
            <p
              className={item.price_change_percentage_24h > 0 ? "green" : "red"}
            >
              {Math.floor(item.price_change_percentage_24h * 100) / 100}
            </p>
            <p className="market-cap">
              {currency.symbol} {item.market_cap.toLocaleString()}
            </p>
          </div>
        ))}
      </div>
      <ChartModal isOpen={modalIsOpen} onRequestClose={closeModal} coinId={selectedCoin} />
    </div>
  );
};

export default Home;
