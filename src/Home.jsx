import React, { useContext, useEffect, useState, useRef } from "react";
import "./Home.css";
import { CoinContext } from "./context/CoinContext";
import ChartModal from "./components/ChartModal";

const Home = () => {
  const { allCoin, currency } = useContext(CoinContext);

  const [displayCoin, setDisplayCoin] = useState([]);
  const [input, setInput] = useState("");
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem("favorites");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });
  const [sortCriteria, setSortCriteria] = useState("market_cap_rank");
  const [sortDirection, setSortDirection] = useState("asc");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const coinsPerPage = 10;

  const [coinsPerPageData, setCoinsPerPageData] = useState({});

  const searchTimeoutRef = useRef(null);

  const inputHandler = (event) => {
    const searchValue = event.target.value;
    setInput(searchValue);

    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
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
    }, 500);
  };

  useEffect(() => {
    if (displayCoin.length === 0) {
      setDisplayCoin(allCoin);
    }
  }, [allCoin]);

  useEffect(() => {
    initializeCoinsData();
  }, [displayCoin, favorites]);

  const initializeCoinsData = () => {
    const top50Coins = displayCoin.slice(0, 50);
    const favoriteCoins = top50Coins.filter((coin) => favorites.includes(coin.id));
    const otherCoins = top50Coins.filter((coin) => !favorites.includes(coin.id));

    setCoinsPerPageData((prev) => ({
      ...prev,
      [1]: [...favoriteCoins, ...otherCoins.slice(0, coinsPerPage - favoriteCoins.length)],
    }));

    const totalOtherPages = Math.ceil(otherCoins.length / coinsPerPage);
    for (let i = 2; i <= totalOtherPages + 1; i++) {
      const indexOfLastCoin = i * coinsPerPage;
      const indexOfFirstCoin = indexOfLastCoin - coinsPerPage;

      const currentOtherCoins = otherCoins.slice(indexOfFirstCoin, indexOfLastCoin);
      setCoinsPerPageData((prev) => ({
        ...prev,
        [i]: currentOtherCoins,
      }));
    }
  };

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

  const currentCoins = coinsPerPageData[currentPage] || [];

  const sortCoins = (criteria) => {
    const favoriteCoins = currentCoins.filter((coin) => favorites.includes(coin.id));
    const otherCoins = currentCoins.filter((coin) => !favorites.includes(coin.id));

    const sortedOtherCoins = [...otherCoins].sort((a, b) => {
      const aValue = criteria === "name" ? a.name.toLowerCase() : a.current_price;
      const bValue = criteria === "name" ? b.name.toLowerCase() : b.current_price;

      return sortDirection === "asc" ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
    });

    const sortedCoins = [...favoriteCoins, ...sortedOtherCoins];

    setCoinsPerPageData((prev) => ({
      ...prev,
      [currentPage]: sortedCoins,
    }));
  };

  const totalPages = Math.min(5, Math.ceil(displayCoin.length / coinsPerPage));

  const getVisiblePages = () => {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="home">
      <div className="hero">
        <h2>Top 50 Crypto Coins</h2>
        <p>
          Stay ahead in the crypto market with real-time insights on the top 50
          cryptocurrencies by market cap, all in one intuitive dashboard.
        </p>
        <form
          id="form"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
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

      <div className="crypto-table">
        <div className="table-header">
          <p className="fav">Fav</p>
          <p>#</p>
          <p>
            Coins
            <button
              type="button"
              onClick={() => {
                setSortCriteria("name");
                setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                sortCoins("name");
              }}
            >
              <span
                className={`sort-arrow ${
                  sortCriteria === "name" ? sortDirection : ""
                }`}
              ></span>
            </button>
          </p>
          <p>
            Price
            <button
              type="button"
              onClick={() => {
                setSortCriteria("price");
                setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                sortCoins("price");
              }}
            >
              <span
                className={`sort-arrow ${
                  sortCriteria === "price" ? sortDirection : ""
                }`}
              ></span>
            </button>
          </p>
          <p style={{ textAlign: "center" }}>24H Change</p>
          <p className="market-cap">Market Cap</p>
        </div>
        {currentCoins.map((item, index) => (
          <div
            className="table-layout"
            key={index}
            onClick={() => handleRowClick(item.id)}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(item.id);
              }}
              className={favorites.includes(item.id) ? "favorite" : ""}
            >
              <i
                className={`ri-star-${
                  favorites.includes(item.id) ? "fill" : "line"
                }`}
              ></i>
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

      <div className="pagination-controls">
        <button className="prev" onClick={prevPage} disabled={currentPage === 1}>
          Previous
        </button>

        <div className="page-numbers">
          {getVisiblePages().map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => handlePageClick(pageNumber)}
              className={currentPage === pageNumber ? "active-page" : ""}
            >
              {pageNumber}
            </button>
          ))}
        </div>

        <button className="next" onClick={nextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>

      <ChartModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        coinId={selectedCoin}
      />
    </div>
  );
};

export default Home;
