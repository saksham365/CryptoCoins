# CryptoCoins
This project is a cryptocurrency dashboard built using React that fetches data from the CoinGecko API. It allows users to view real-time prices of the top 50 cryptocurrencies, search and filter them, sort by name or price, mark favorites, and view historical data charts for individual cryptocurrencies.

## Live Demo
You can view the live project at: [https://crypto-coins-eta.vercel.app/]

## Prerequisites
Before you begin, ensure you have the following installed:
Node.js
npm (comes with Node.js) or yarn

## Installation
1. Clone the repository
   ```
   git clone https://github.com/saksham365/CryptoCoins.git
   ```
2. Navigate to the project directory
   ```
   cd CryptoCoins
   ```
3. Install Dependencies
 ```
   npm install
   yarn install(if you are using yarn)
```

## Running the project
```
npm run dev
yarn dev(if you are using yarn)
```

## API endpoints used

List of Cryptocurrencies: Fetch the complete list of available cryptocurrencies (used to display the top 50).

```GET https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1```

Real-Time Prices: Used to fetch real-time prices for cryptocurrencies.

```GET https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd```

Historical Market Chart: Used to fetch historical data for a specific cryptocurrency (for chart display).

```GET https://api.coingecko.com/api/v3/coins/{coin_id}/market_chart?vs_currency=usd&days=30```
