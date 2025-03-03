import { useState } from "react";
import axios from "axios";
import SearchBar from "./SearchBar"; // Import statement added

const StockPrediction = () => {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPrediction = async (symbol) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", { symbol });
      setPrediction(response.data.predicted_price);
    } catch (err) {
      setError("Failed to fetch prediction. Check the stock symbol and try again.");
    }

    setLoading(false);
  };

  return (
    <div className="stock-prediction">
      <h2>Stock Price Prediction</h2>
      <SearchBar onSearch={fetchPrediction} />
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {prediction && <h3>Predicted Price: ${prediction.toFixed(2)}</h3>}
    </div>
  );
};

export default StockPrediction;
