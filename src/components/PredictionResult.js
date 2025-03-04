import React, { useState } from "react";
import PredictionResult from "./PredictionResult";

const StockPrediction = () => {
  const [prediction, setPrediction] = useState(null);

  const getPrediction = async () => {
    try {
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: "some_stock_data" }),
      });

      const data = await response.json();
      console.log("Prediction response:", data); // Debugging line

      if (data.prediction !== undefined && !isNaN(data.prediction)) {
        setPrediction(data.prediction);
      } else {
        console.error("Invalid prediction received:", data.prediction);
        setPrediction("N/A"); // Fallback if prediction is missing or invalid
      }
    } catch (error) {
      console.error("Error fetching prediction:", error);
      setPrediction("Error");
    }
  };

  return (
    <div>
      <button onClick={getPrediction}>Predict</button>
      <PredictionResult prediction={prediction} />
    </div>
  );
};

export default StockPrediction;
