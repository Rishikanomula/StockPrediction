import { useState } from "react";
import axios from "axios";

const SearchBar = ({ onPrediction }) => {
  const [symbol, setSymbol] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", {
        symbol: symbol.toUpperCase(),
      });
      onPrediction(response.data);  // Pass data to parent component
    } catch (error) {
      console.error("Error fetching prediction:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter Stock Symbol (AAPL, TSLA, etc.)"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
      />
      <button type="submit">Predict</button>
    </form>
  );
};

export default SearchBar;
