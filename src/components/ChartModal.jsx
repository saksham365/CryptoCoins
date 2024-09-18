import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import './ChartModal.css'

const ChartModal = ({ isOpen, onRequestClose, coinId }) => {
  const [historicalData, setHistoricalData] = useState(null);
  const [days, setDays] = useState(1); // Default to 1 day
  const [loading, setLoading] = useState(false);

  // API to fetch historical data based on the coinId and days
  const fetchHistoricalData = async (coinId, days) => {
    setLoading(true);
    const url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`;
    const response = await axios.get(url);
    setHistoricalData(response.data.prices);
    setLoading(false);
  };

  useEffect(() => {
    if (coinId) {
      fetchHistoricalData(coinId, days); // Fetch data on modal open or when `days` change
    }
  }, [coinId, days]);

  // Function to format time or date based on selected days
  const formatLabel = (timestamp) => {
    const date = new Date(timestamp);

    if (days === 1) {
      // If it's the 1-day chart, show time (HH:MM)
      return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    } else {
      // Otherwise, show the date (MM/DD)
      return `${date.getMonth() + 1}/${date.getDate()}`;
    }
  };

  // Chart data format for Chart.js
  const chartData = {
    labels: historicalData ? historicalData.map((data) => formatLabel(data[0])) : [],
    datasets: [
      {
        label: `${days}-day price trend`,
        data: historicalData ? historicalData.map((data) => data[1]) : [],
        borderColor: 'rgba(75, 192, 192, 1)',
        fill: false,
      },
    ],
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Coin Historical Data"
      className="chart-modal"
      overlayClassName="modal-overlay" // Adding custom class to style the overlay
    >
      <h2>Historical Data for {coinId}</h2>

      {/* Select the time range (1 day, 7 days, 30 days) */}
      <div className="day-selector">
        <button className='buttons' onClick={() => setDays(1)}>1 Day</button>
        <button className='buttons' onClick={() => setDays(7)}>7 Days</button>
        <button className='buttons' onClick={() => setDays(30)}>30 Days</button>
      </div>

      {/* Show loading spinner if fetching data */}
      {loading ? (
        <p>Loading...</p>
      ) : historicalData ? (
        <div className="chart-container">
          {/* Display the line chart */}
          <Line data={chartData} />
        </div>
      ) : (
        <p>No data available</p>
      )}

      <button onClick={onRequestClose}>Close</button>
    </Modal>
  );
};

export default ChartModal;
