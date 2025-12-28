"use client";
import React, { useEffect, useState, useContext } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { CoinContext } from '../context/CoinContext';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import './ChartModal.css'

const ChartModal = ({ isOpen, onRequestClose, coinId }) => {
  const [historicalData, setHistoricalData] = useState(null);
  const [days, setDays] = useState(1);
  const [loading, setLoading] = useState(false);
  const { API_KEY } = useContext(CoinContext);
  const [error, setError] = useState(null);

  // Set app element for accessibility
  useEffect(() => {
     Modal.setAppElement('body');
  }, []);

  const fetchHistoricalData = async (coinId, days) => {
    setLoading(true);
    setError(null);
    try {
        const url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`;
        const options = {
            headers: {
                accept: "application/json",
                "x-cg-demo-api-key": API_KEY,
            }
        };
        const response = await axios.get(url, options);
        setHistoricalData(response.data.prices);
    } catch (err) {
        console.error("Error fetching historical data:", err);
        setError("Failed to load chart data. Please try again later.");
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    if (coinId) {
      fetchHistoricalData(coinId, days);
    }
  }, [coinId, days]);

  const formatLabel = (timestamp) => {
    const date = new Date(timestamp);
    if (days === 1) {
      return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    } else {
      return `${date.getMonth() + 1}/${date.getDate()}`;
    }
  };

  let borderColor = '#007bff'; 
  let gradientStart = 'rgba(0, 123, 255, 0.5)';
  let gradientEnd = 'rgba(0, 123, 255, 0)';

  if (historicalData && historicalData.length > 0) {
      const startPrice = historicalData[0][1];
      const endPrice = historicalData[historicalData.length - 1][1];
      
      if (endPrice >= startPrice) {
          // Profit - Green
          borderColor = 'rgb(0, 255, 76)';
          gradientStart = 'rgba(0, 255, 76, 0.5)';
          gradientEnd = 'rgba(0, 255, 76, 0)';
      } else {
          // Loss - Red
          borderColor = 'rgb(255, 0, 0)';
          gradientStart = 'rgba(255, 0, 0, 0.5)';
          gradientEnd = 'rgba(255, 0, 0, 0)';
      }
  }

  const chartData = {
    labels: historicalData ? historicalData.map((data) => formatLabel(data[0])) : [],
    datasets: [
      {
        label: `Price (USD)`,
        data: historicalData ? historicalData.map((data) => data[1]) : [],
        borderColor: borderColor,
        backgroundColor: (context) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 400);
            gradient.addColorStop(0, gradientStart);
            gradient.addColorStop(1, gradientEnd);
            return gradient;
        },
        borderWidth: 2,
        pointRadius: 0, 
        pointHoverRadius: 5,
        fill: true,
        tension: 0.4, 
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false, 
        },
        tooltip: {
             backgroundColor: 'rgba(0,0,0,0.8)',
             titleColor: 'white',
             bodyColor: 'white',
             padding: 10,
             cornerRadius: 8,
             displayColors: false,
        }
    },
    scales: {
        x: {
            grid: {
                display: false, 
                drawBorder: false,
            },
            ticks: {
                 maxTicksLimit: 7, 
                 color: '#888'
            }
        },
        y: {
            grid: {
                 color: 'rgba(200, 200, 200, 0.1)', 
                 drawBorder: false,
            },
            ticks: {
                color: '#888',
                callback: function(value) {
                    return '$' + value.toLocaleString(); 
                }
            }
        }
    },
    interaction: {
        mode: 'index',
        intersect: false,
    },
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Coin Historical Data"
      className="chart-modal"
      overlayClassName="modal-overlay" 
      ariaHideApp={false} 
    >
      <div className="modal-header">
         <div className="modal-title">
            <img src={`https://assets.coingecko.com/coins/images/1/small/bitcoin.png`} alt="" style={{display:'none'}} /> {/* Placeholder or dynamic icon if available */}
            <h2>{coinId?.charAt(0).toUpperCase() + coinId?.slice(1)} Price Chart</h2>
         </div>
         <button className='close-btn' onClick={onRequestClose}>
            <i className="ri-close-line"></i>
         </button>
      </div>

      <div className="day-selector">
        <button className={days === 1 ? 'active' : ''} onClick={() => setDays(1)}>24H</button>
        <button className={days === 7 ? 'active' : ''} onClick={() => setDays(7)}>7D</button>
        <button className={days === 30 ? 'active' : ''} onClick={() => setDays(30)}>30D</button>
        <button className={days === 365 ? 'active' : ''} onClick={() => setDays(365)}>1Y</button>
      </div>

      {loading ? (
        <div className="loading-container">
            <div className="spinner"></div>
        </div>
      ) : error ? (
        <div className="error-container" style={{height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'red'}}>
            <p>{error}</p>
        </div>
      ) : historicalData ? (
        <div className="chart-container">
          <Line data={chartData} options={chartOptions} />
        </div>
      ) : (
        <p>No data available</p>
      )}
      
    </Modal>
  );
};

export default ChartModal;
