import yfinance as yf
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, LSTM, Dropout

# Fetching past stock data
def fetch_stock_data(symbol):
    return yf.download(symbol, start='2010-01-01', end='2024-01-01')

stock_symbol = input("Enter stock symbol (e.g., AAPL, TSLA, MSFT): ")
stock_data = fetch_stock_data(stock_symbol)

# Check if data is empty
if stock_data.empty:
    print("Error: No data found for the given stock symbol. Please check the symbol and try again.")
    exit()

print(stock_data.head())

# Normalizing the data
scaler = MinMaxScaler(feature_range=(0,1))
scaled_data = scaler.fit_transform(stock_data['Close'].values.reshape(-1,1))

# Creating sequences for training
def create_sequences(data, seq_length):
    sequences, labels = [], []
    for i in range(len(data) - seq_length):
        sequences.append(data[i:i + seq_length])
        labels.append(data[i + seq_length])
    return np.array(sequences), np.array(labels)

seq_length = 60
X, y = create_sequences(scaled_data, seq_length)
train_size = int(len(X) * 0.8)

# Separating training and testing data (80% training, 20% testing)
X_train, y_train = X[:train_size], y[:train_size]
X_test, y_test = X[train_size:], y[train_size:]

# Defining the LSTM model
model = Sequential([
    LSTM(50, return_sequences=True, input_shape=(seq_length, 1)),
    Dropout(0.2),
    LSTM(50, return_sequences=False),
    Dropout(0.2),
    Dense(25),
    Dense(1)
])

model.compile(optimizer='adam', loss='mean_squared_error')
model.summary()

# Training the model
model.fit(X_train, y_train, epochs=50, batch_size=32, validation_data=(X_test, y_test))

# Predicting prices
predictions = model.predict(X_test)
predictions = scaler.inverse_transform(predictions)  # Convert back to original scale
actual_prices = scaler.inverse_transform(y_test.reshape(-1,1))

# Visualizing predicted vs actual prices
plt.figure(figsize=(12, 6))
plt.plot(actual_prices, label="Actual Price")
plt.plot(predictions, label="Predicted Price", linestyle='dashed')
plt.xlabel("Time")
plt.ylabel("Stock Price (USD)")
plt.title("Stock Price Prediction vs Actual")
plt.legend()
plt.show()

# Saving the trained model
try:
    model.save("stock_model.h5")
    print("Model saved successfully as 'stock_model.h5'")
except Exception as e:
    print(f"Error saving model: {e}")
