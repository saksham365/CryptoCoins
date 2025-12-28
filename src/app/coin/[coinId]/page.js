"use client";
import React, { useContext, useEffect, useState, use } from "react";
import { CoinContext } from "../../../context/CoinContext";
import "./CoinDetails.css";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import BuyButton from "../../../components/BuyButton";
import Link from 'next/link';

const CoinDetails = ({ params }) => {
    const resolvedParams = use(params);
    const { coinId } = resolvedParams;

    const { currency, API_KEY } = useContext(CoinContext);
    const [coinData, setCoinData] = useState(null);
    const [historicalData, setHistoricalData] = useState(null);
    const [days, setDays] = useState(1);
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCoinData = async () => {
            setLoading(true);
            try {
                const options = {
                    method: "GET",
                    headers: { accept: "application/json", "x-cg-demo-api-key": API_KEY },
                };

                const detailsRes = await fetch(
                    `https://api.coingecko.com/api/v3/coins/${coinId}`,
                    options
                );
                const details = await detailsRes.json();
                setCoinData(details);

                let chart = { prices: [] };
                try {
                    const chartRes = await fetch(
                        `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency.name}&days=${days}`,
                        options
                    );
                    if (!chartRes.ok) throw new Error('Chart fetch failed');
                    chart = await chartRes.json();
                } catch (e) {
                    console.error("Chart fetch error:", e);
                }
                setHistoricalData(chart.prices || []);

                // Ensure status_updates exists
                if (details.status_updates) {
                    setNews(details.status_updates);
                }
            } catch (err) {
                console.error("Error fetching coin data:", err);
            } finally {
                setLoading(false);
            }
        };

        if (coinId && currency?.name) {
            fetchCoinData();
        }
    }, [coinId, currency, days, API_KEY]);

    if (loading || !coinData) {
        return (
            <div className="coin-details" style={{ textAlign: 'center', marginTop: '50px' }}>
                <div className="spinner"></div> Loading...
            </div>
        );
    }

    const chartData = {
        labels: historicalData?.map((item) => {
            const date = new Date(item[0]);
            return days === 1
                ? `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`
                : `${date.getDate()}/${date.getMonth() + 1}`;
        }) || [],
        datasets: [{
            label: `Price (${currency.symbol})`,
            data: historicalData?.map((item) => item[1]) || [],
            borderColor: '#16c784', // Green like reference
            backgroundColor: 'rgba(22, 199, 132, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            borderWidth: 2
        }]
    };

    const currentPrice = coinData.market_data.current_price[currency.name];
    const priceChange = coinData.market_data.price_change_percentage_24h;

    return (
        <div className="coin-details-container">
            {/* Header */}
            <div className="coin-header-card">
                <div className="header-left">
                    <img src={coinData.image.large} alt={coinData.name} />
                    <h1>{coinData.name} <span className="symbol">({coinData.symbol.toUpperCase()})</span></h1>
                    <div className="price-tag">
                        {currency.symbol}{currentPrice.toLocaleString()}
                        <span className={`change ${priceChange >= 0 ? "up" : "down"}`}>
                            {priceChange >= 0 ? "▲" : "▼"} {Math.abs(priceChange).toFixed(2)}%
                        </span>
                    </div>
                </div>
                <div className="header-right">
                    <BuyButton buttonText={`Buy ${coinData.symbol.toUpperCase()}`} />
                </div>
            </div>

            <div className="dashboard-grid">
                {/* Main Column: Chart & News */}
                <div className="main-column">
                    <div className="chart-card">
                        <div className="chart-header">
                            <h3>Price Chart</h3>
                            <div className="time-toggles">
                                {[1, 7, 30, 365].map(d => (
                                    <button
                                        key={d}
                                        onClick={() => setDays(d)}
                                        className={days === d ? 'active' : ''}
                                    >
                                        {d === 1 ? '1D' : d === 7 ? '1W' : d === 30 ? '1M' : '1Y'}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="chart-canvas">
                            <Line data={chartData} options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: { legend: { display: false } },
                                scales: {
                                    x: { grid: { display: false } },
                                    y: { grid: { color: 'rgba(128,128,128,0.1)' } }
                                }
                            }} />
                        </div>
                    </div>

                    {/* News/Updates Section */}
                    <div className="news-card">
                        <h3>Latest News & Updates</h3>
                        {news.length > 0 ? (
                            <div className="news-list">
                                {news.map((item, index) => (
                                    <div key={index} className="news-item">
                                        <h4>{item.user_title || "Update"}</h4>
                                        <p>{item.description}</p>
                                        <small>{item.created_at ? new Date(item.created_at).toLocaleDateString() : ''}</small>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="no-news">No recent updates available from the developer.</p>
                        )}
                    </div>
                </div>

                {/* Sidebar Column: About, Stats, Sentiment */}
                <div className="sidebar-column">
                    <div className="info-card">
                        <h3>About {coinData.name}</h3>
                        <div className="coin-desc" dangerouslySetInnerHTML={{ __html: coinData.description.en ? coinData.description.en.split('. ')[0] + '.' : 'No description available.' }}></div>
                        <br />
                        <p style={{ fontSize: '0.9rem', color: '#888' }}>
                            {coinData.name} is a cryptocurrency operating on the blockchain.
                            Ranked #{coinData.market_cap_rank}.
                        </p>
                    </div>

                    <div className="stats-list-card">
                        <h3>Key Stats</h3>
                        <ul>
                            <li>
                                <span className="label">Market Cap</span>
                                <span className="value">{currency.symbol} {coinData.market_data.market_cap[currency.name].toLocaleString()}</span>
                            </li>
                            <li>
                                <span className="label">24h Volume</span>
                                <span className="value">{currency.symbol} {coinData.market_data.total_volume[currency.name].toLocaleString()}</span>
                            </li>
                            <li>
                                <span className="label">FDV</span>
                                <span className="value">{coinData.market_data.fully_diluted_valuation[currency.name] ? `${currency.symbol} ${coinData.market_data.fully_diluted_valuation[currency.name]?.toLocaleString()}` : 'N/A'}</span>
                            </li>
                            <li>
                                <span className="label">Circulating Supply</span>
                                <span className="value">{coinData.market_data.circulating_supply.toLocaleString()} {coinData.symbol.toUpperCase()}</span>
                            </li>
                            <li>
                                <span className="label">Total Supply</span>
                                <span className="value">{coinData.market_data.total_supply ? coinData.market_data.total_supply.toLocaleString() : '∞'} {coinData.symbol.toUpperCase()}</span>
                            </li>
                        </ul>
                    </div>

                    <div className="sentiment-card">
                        <h3>Community Sentiment</h3>
                        <div className="gauge-container">
                            <div className="gauge">
                                <div className="gauge-fill" style={{ transform: `rotate(${(coinData.sentiment_votes_up_percentage / 100) * 180}deg)` }}></div>
                                <div className="gauge-cover">
                                    {coinData.sentiment_votes_up_percentage}%
                                    <span>Bullish</span>
                                </div>
                            </div>
                            <div className="sentiment-labels">
                                <span style={{ color: 'green' }}>Positive</span>
                                <span style={{ color: 'red' }}>Negative</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoinDetails;
