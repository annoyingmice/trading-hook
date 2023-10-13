const crypto = require("crypto");
const { RestClientV5 } = require("bybit-api");
const { modelv5 } = require("./order.model");

const _KEY = process.env.BYBIT_KEY;
const _SECRET = process.env.BYBIT_SECRET;
const testnet = process.env.NODE_ENV == "development";

// Stop Loss Level: Stop Loss = Entry Price - (Risk Percentage * Entry Price)
// Take Profit Level: Take Profit = Entry Price + 5 * (Risk Percentage * Entry Price)
// 5:1 Risk/Reward
const takeProfit = (entryPrice, side, points = 10, decimals = 1) =>
  side === "Buy"
    ? parseFloat(parseFloat(entryPrice) + parseFloat(points)).toFixed(
        parseInt(decimals),
      )
    : parseFloat(parseFloat(entryPrice) - parseFloat(points)).toFixed(
        parseInt(decimals),
      );
const stopLoss = (entryPrice, side, points = 10, decimals = 1) =>
  side === "Buy"
    ? parseFloat(parseFloat(entryPrice) - parseFloat(points)).toFixed(
        parseInt(decimals),
      )
    : parseFloat(parseFloat(entryPrice) + parseFloat(points)).toFixed(
        parseInt(decimals),
      );
const uuid = () => crypto.randomBytes(16).toString("hex");

const apiPerpv5 = async (req, res) => {
  try {
    const client = new RestClientV5({
      testnet,
      key: _KEY,
      secret: _SECRET,
    });
    const payload = req.body;
    const takeProfitPoints = req.body.points * 5;

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
      takeProfit: takeProfit(
        payload.price,
        payload.side,
        takeProfitPoints,
        payload.decimals,
      ),
      stopLoss: stopLoss(
        payload.price,
        payload.side,
        payload.points,
        payload.decimals,
      ),
      tpLimitPrice: takeProfit(
        payload.price,
        payload.side,
        takeProfitPoints,
        payload.decimals,
      ),
      slLimitPrice: stopLoss(
        payload.price,
        payload.side,
        payload.points,
        payload.decimals,
      ),
    });

    console.log(
      `[${new Date().toGMTString()}]: ${req.method.toUpperCase()} ${
        req.url
      } ${200} -> ${payload.ticker} ${response.retMsg}`,
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
