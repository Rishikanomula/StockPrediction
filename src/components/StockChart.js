import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const StockChart = ({ stockData }) => {
    if (!stockData || !stockData.chart || !stockData.chart.result) return null;

    const prices = stockData.chart.result[0].indicators.quote[0].close;
    const timestamps = stockData.chart.result[0].timestamp;

    // Convert timestamps to readable dates
    const formattedData = timestamps.map((time, index) => ({
        date: new Date(time * 1000).toLocaleDateString(),
        price: prices[index],
    }));

    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={formattedData}>
                <XAxis dataKey="date" />
                <YAxis domain={["auto", "auto"]} />
                <Tooltip />
                <CartesianGrid stroke="#ccc" />
                <Line type="monotone" dataKey="price" stroke="#8884d8" />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default StockChart;
