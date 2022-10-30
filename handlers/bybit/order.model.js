const { LinearPositionIdx, LinearTimeInForce } = require("bybit-api");

const model = {
    side: "Sell",
    symbol: "BTCUSDT",
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

module.exports = model;
