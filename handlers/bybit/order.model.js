const { LinearPositionIdx, LinearTimeInForce } = require("bybit-api");

const model = {
  side: "Sell",
  // symbol: "BTCUSDT",
  order_type: "Market",
  qty: 0.001,
  // price?: number,
  time_in_force: "GoodTillCancel",
  // take_profit?: "",
  // stop_loss?: "",
  // tp_trigger_by?: "",
  // sl_trigger_by?: "",
  reduce_only: false,
  close_on_trigger: false,
  // order_link_id?: "",
  // position_idx?: LinearPositionIdx.BuySide,
};

const modelv5 = {
  category: "linear",
  // symbol: "BTCUSDT",
  // side: "Buy",
  orderType: "Market",
  // qty: "0.001", // $6
  // price: "25000",
  // timeInForce: "IOC",
  // positionIdx: 0,
  // orderLinkId: "usdt-test-01",
  // reduceOnly: false,
  // takeProfit: "28000",
  // stopLoss: "20000",
  tpslMode: "Partial",
  tpOrderType: "Limit",
  slOrderType: "Limit",
  // tpLimitPrice: "27500",
  // slLimitPrice: "20500"
};

module.exports = { modelv5, model };
