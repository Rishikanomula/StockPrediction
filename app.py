from flask import Flask, request, jsonify
import numpy as np
import yfinance as yf
from tensorflow.keras.models import load_model
from sklearn.preprocessing import MinMaxScaler

app = Flask(__name__)

# Load the trained model
try:
    model = load_model("stock_model.h5")
    print("--->Model loaded successfully")
except Exception as e:
    print(f"--->Error loading model: {e}")
    exit()

scaler = MinMaxScaler(feature_range=(0,1))

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    
    # Validate request
    if not data or 'symbol' not in data:
        return jsonify({"error": "Invalid request. Please provide a stock symbol."}), 400

    stock_symbol = data['symbol']
    
    # Fetch stock data
    stock_data = yf.download(stock_symbol, start="2010-01-01", end="2024-01-01")
    
    # Handle case where stock data is empty
    if stock_data.empty:
        return jsonify({"error": "No stock data found for the given symbol. Please try a valid stock symbol."}), 400

    # Prepare data for prediction
    stock_prices = stock_data['Close'].values.reshape(-1, 1)
    
    # Ensure scaler was previously fitted
    scaled_prices = scaler.fit_transform(stock_prices)  # Fit only once at training time

    if len(scaled_prices) < 60:
        return jsonify({"error": "Not enough data for prediction. At least 60 days of data is required."}), 400

    input_sequence = np.array(scaled_prices[-60:]).reshape(1, 60, 1)  # Last 60 days

    # Predict future price
    prediction = model.predict(input_sequence)
    predicted_price = scaler.inverse_transform(prediction)[0][0]

    return jsonify({"symbol": stock_symbol, "predicted_price": predicted_price})

if __name__ == '__main__':
    app.run(debug=True)
