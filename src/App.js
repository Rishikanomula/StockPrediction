import React, { useState } from "react";
import SearchBar from "./components/SearchBar";
import StockChart from "./components/StockChart";

function App() {
    const [stockData, setStockData] = useState(null);

    return (
        <div>
            <h1>Stock Price Prediction</h1>
            <SearchBar setStockData={setStockData} />
            
            {stockData && stockData.chart && stockData.chart.result && (
                <div>
                    <h2>Stock: {stockData.chart.result[0].meta.symbol}</h2>
                    <p>Current Price: ${stockData.chart.result[0].meta.regularMarketPrice}</p>
                    <p>Previous Close: ${stockData.chart.result[0].meta.previousClose}</p>

                    <StockChart stockData={stockData} /> {/* 📈 Show the chart */}
                </div>
            )}
        </div>
    );
}

export default App;
