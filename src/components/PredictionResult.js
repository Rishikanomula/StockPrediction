const PredictionResult = ({ prediction }) => {
    return (
      <div>
        <h2>Predicted Price: {prediction ? `$${prediction}` : "N/A"}</h2>
      </div>
    );
  };
  
  export default PredictionResult;