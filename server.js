const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors()); // Enable CORS
app.use(express.json());

const YAHOO_FINANCE_API = "https://query1.finance.yahoo.com/v8/finance/chart";

// API Route to fetch stock data
app.get("/stock/:symbol", async (req, res) => {
    try {
        const symbol = req.params.symbol; // Get stock symbol (e.g., AAPL)
        const response = await axios.get(`${YAHOO_FINANCE_API}/${symbol}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Error fetching stock data" });
    }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
