const axios = require("axios");
require("dotenv").config();

let accessToken = null;


async function getAuthToken() {
  if (accessToken) return accessToken;

  const authUrl = "http://20.244.56.144/evaluation-service/auth";
  const credentials = {
    email: process.env.EMAIL,
    name: process.env.NAME,
    rollNo: process.env.ROLL_NO,
    accessCode: process.env.ACCESS_CODE,
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  };

  try {
    const response = await axios.post(authUrl, credentials);
    accessToken = response.data.access_token;
    return accessToken;
  } catch (error) {
    console.error("Auth failed:", error.response?.data || error.message);
    throw new Error("Authorization failed");
  }
}


async function fetchStockPrices(ticker, minutes) {
  const token = await getAuthToken();

  const url = `http://20.244.56.144/evaluation-service/stocks/${ticker}?minutes=${minutes}`;

  try {
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    console.error(`Failed to fetch prices for ${ticker}:`, error.message);
    throw new Error("Error fetching stock data");
  }
}


async function getAveragePrice(req, res) {
  const { ticker } = req.params;
  const { minutes, aggregation } = req.query;

  if (aggregation !== "average") {
    return res.status(400).json({ error: "Only 'average' aggregation is supported" });
  }

  try {
    const data = await fetchStockPrices(ticker, minutes);
    const prices = data.map(p => p.price);
    const avg = prices.reduce((sum, price) => sum + price, 0) / prices.length;

    res.json({
      averageStockPrice: Number(avg.toFixed(6)),
      priceHistory: data,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


function calculateCorrelation(pricesX, pricesY) {
  const n = Math.min(pricesX.length, pricesY.length);
  if (n === 0) return 0;

  const meanX = pricesX.reduce((a, b) => a + b, 0) / n;
  const meanY = pricesY.reduce((a, b) => a + b, 0) / n;

  const covariance = pricesX
    .slice(0, n)
    .reduce((sum, x, i) => sum + (x - meanX) * (pricesY[i] - meanY), 0) / (n - 1);

  const stdX = Math.sqrt(
    pricesX.slice(0, n).reduce((sum, x) => sum + Math.pow(x - meanX, 2), 0) / (n - 1)
  );
  const stdY = Math.sqrt(
    pricesY.slice(0, n).reduce((sum, y) => sum + Math.pow(y - meanY, 2), 0) / (n - 1)
  );

  const correlation = covariance / (stdX * stdY);
  return Number(correlation.toFixed(4));
}


async function getStockCorrelation(req, res) {
  const { minutes, ticker: tickers } = req.query;

  if (!Array.isArray(tickers) || tickers.length !== 2) {
    return res.status(400).json({ error: "Provide exactly 2 tickers for correlation" });
  }

  try {
    const [dataA, dataB] = await Promise.all([
      fetchStockPrices(tickers[0], minutes),
      fetchStockPrices(tickers[1], minutes),
    ]);

    const pricesA = dataA.map(p => p.price);
    const pricesB = dataB.map(p => p.price);

    const correlation = calculateCorrelation(pricesA, pricesB);

    const averageA = pricesA.reduce((a, b) => a + b, 0) / pricesA.length;
    const averageB = pricesB.reduce((a, b) => a + b, 0) / pricesB.length;

    res.json({
      correlation,
      stocks: {
        [tickers[0]]: {
          averagePrice: Number(averageA.toFixed(6)),
          priceHistory: dataA,
        },
        [tickers[1]]: {
          averagePrice: Number(averageB.toFixed(6)),
          priceHistory: dataB,
        },
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getAveragePrice,
  getStockCorrelation,
};
