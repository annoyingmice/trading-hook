const crypto = require("crypto");
const { RestClientV5 } = require("bybit-api");
const { modelv5 } = require("./order.model");

const _KEY = process.env.BYBIT_KEY;
const _SECRET = process.env.BYBIT_SECRET;
const testnet = process.env.NODE_ENV == "development";

// Stop Loss Level: Stop Loss = Entry Price - (Risk Percentage * Entry Price)
// Take Profit Level: Take Profit = Entry Price + 5 * (Risk Percentage * Entry Price)
// 5:1 Risk/Reward
const takeProfit = (entryPrice, side) =>
  side === "Buy"
    ? parseFloat(
        parseFloat(entryPrice) + parseFloat(5 * (0.01 * entryPrice)),
      ).toFixed(1)
    : parseFloat(
        parseFloat(entryPrice) - parseFloat(5 * (0.01 * entryPrice)),
      ).toFixed(1);
const stopLoss = (entryPrice, side) =>
  side === "Buy"
    ? parseFloat(
        parseFloat(entryPrice) - parseFloat(0.01 * entryPrice),
      ).toFixed(1)
    : parseFloat(
        parseFloat(entryPrice) + parseFloat(0.01 * entryPrice),
      ).toFixed(1);
const uuid = () => crypto.randomBytes(16).toString("hex");

const apiPerpv5 = async (req, res) => {
  try {
    const client = new RestClientV5({
      testnet,
      key: _KEY,
      secret: _SECRET,
    });
    const payload = req.body;

    // Set leverage isolated margin
    await client.switchIsolatedMargin({
      category: "linear",
      symbol: payload.ticker,
      tradeMode: 1,
      buyLeverage: "20",
      sellLeverage: "20",
    });

    // Create order
    const response = await client.submitOrder({
      ...modelv5,
      qty: payload.qty,
      symbol: payload.ticker.split(".")[0],
      side: payload.side,
      price: payload.price,
      positionIdx: payload.side === "Buy" ? 1 : 2,
      orderLinkId: uuid(),
      takeProfit: takeProfit(payload.price, payload.side),
      stopLoss: stopLoss(payload.price, payload.side),
      tpLimitPrice: takeProfit(payload.price, payload.side),
      slLimitPrice: stopLoss(payload.price, payload.side),
    });

    console.log(
      `[${new Date().toGMTString()}]: ${req.method.toUpperCase()} ${
        req.url
      } ${200} -> ${response.retMsg}`,
    );
    return res.status(200).json(response);
  } catch (error) {
    console.log(
      `[${new Date().toGMTString()}]: ${req.method.toUpperCase()} ${
        req.url
      } ${400} -> Server error: ${error.message}`,
    );
    return res.status(400).json(error);
  }
};

module.exports = {
  apiPerpv5,
};
