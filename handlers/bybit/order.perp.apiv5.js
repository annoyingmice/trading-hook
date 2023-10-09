const { RestClientV5 } = require("bybit-api");
const { modelv5 } = require("./order.model");

const _KEY = process.env.BYBIT_KEY;
const _SECRET = process.env.BYBIT_SECRET;
const testnet = process.env.NODE_ENV == "development";

// Stop Loss Level: Stop Loss = Entry Price - (Risk Percentage * Entry Price)
// Take Profit Level: Take Profit = Entry Price + 5 * (Risk Percentage * Entry Price)
// 5:1 Risk/Reward
const takeProfit = (entryPrice) => entryPrice + 5 * (0.01 * entryPrice);
const stopLoss = (entryPrice) => entryPrice - 0.01 * entryPrice;

const apiPerpv5 = async (req, res) => {
  try {
    const client = new RestClientV5({
      testnet,
      key: _KEY,
      secret: _SECRET,
    });
    const payload = JSON.parse(req.body);
    const response = await client.submitOrder({
      ...modelv5,
      side: payload.side,
      orderLinkId: payload.id,
      takeProfit: takeProfit(payload.price),
      stopLoss: stopLoss(payload.price),
      tpLimitPrice: takeProfit(payload.price),
      slLimitPrice: stopLoss(payload.price),
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
