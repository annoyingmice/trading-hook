const { LinearClient } = require('bybit-api');

const _KEY = process.env.BYBIT_KEY;
const _SECRET = process.env.BYBIT_SECRET;
const testnet = process.env.NODE_ENV == "development";

const longPosition = async (req, res) => {
    const restClient = new LinearClient({
        key: _KEY,
        secret: _SECRET,
        testnet
    });
    const tpTicks = (req.body.price*(req.body.tl_p/100));
    const slTicks = (req.body.price*(req.body.sl_p/100));
    const take_profit = parseFloat((req.body.price+tpTicks).toFixed(2));
    const stop_loss = parseFloat((req.body.price-slTicks).toFixed(2));

    // await restClient.setUserLeverage({ symbol: "ETHUSDT", buy_leverage: req.body.leverage, sell_leverage: req.body.leverage });

    const position = {
        side: 'Buy',
        symbol: req.body.symbol,
        qty: req.body.qty,
        // price: req.body.price,
        order_type: 'Market',
        take_profit,
        stop_loss,
        time_in_force: 'ImmediateOrCancel',
        reduce_only: false,
        close_on_trigger: false,
    };

    restClient.placeActiveOrder(position)
    .then((response) => {
        if(response.ret_msg !== "OK") {
            console.log(`[${new Date().toGMTString()}]: ${req.method.toUpperCase()} ${req.url} ${400} -> ${response.ret_msg}`);
            return res.status(400).json(response);
        }
        console.log(`[${new Date().toGMTString()}]: ${req.method.toUpperCase()} ${req.url} ${200} -> ${response.ret_msg}`);
        return res.status(200).json(response);
    })
    .catch((error) => {
        console.log(`[${new Date().toGMTString()}]: ${req.method.toUpperCase()} ${req.url} ${400} -> Server error: ${error.message}`);
        return res.status(400).json(error);
    });
}

const shortPosition = async (req, res) => {
    const restClient = new LinearClient({
        key: _KEY,
        secret: _SECRET,
        testnet
    });
    const tpTicks = (req.body.price*(req.body.tl_p/100));
    const slTicks = (req.body.price*(req.body.sl_p/100));
    const take_profit = parseFloat((req.body.price-tpTicks).toFixed(2));
    const stop_loss = parseFloat((req.body.price+slTicks).toFixed(2));

    // await restClient.setUserLeverage({ symbol: "ETHUSDT", buy_leverage: req.body.leverage, sell_leverage: req.body.leverage });

    const position = {
        side: 'Sell',
        symbol: req.body.symbol,
        qty: req.body.qty,
        // price: req.body.price,
        order_type: 'Market',
        take_profit,
        stop_loss,
        time_in_force: 'ImmediateOrCancel',
        reduce_only: false,
        close_on_trigger: false,
    };

    restClient.placeActiveOrder(position)
    .then((response) => {
        if(response.ret_msg !== "OK") {
            console.log(`[${new Date().toGMTString()}]: ${req.method.toUpperCase()} ${req.url} ${400} -> ${response.ret_msg}`);
            return res.status(400).json(response);
        }
        console.log(`[${new Date().toGMTString()}]: ${req.method.toUpperCase()} ${req.url} ${200} -> ${response.ret_msg}`);
        return res.status(200).json(response)
    })
    .catch((error) => {
        console.log(`[${new Date().toGMTString()}]: ${req.method.toUpperCase()} ${req.url} ${400} -> Server error: ${error.message}`);
        return res.status(400).json(error);
    });
}

const orderPosition = async (req, res) => {
    const restClient = new LinearClient({
        key: _KEY,
        secret: _SECRET,
        testnet
    });
    const side = String(req.body.action).charAt(0).toUpperCase() + String(req.body.action).slice(1);
    const tpTicks = (req.body.price*(req.body.tl_p/100));
    const slTicks = (req.body.price*(req.body.sl_p/100));
    const take_profit = side === "Buy" ? parseFloat((req.body.price+tpTicks).toFixed(2)) : parseFloat((req.body.price-tpTicks).toFixed(2));
    const stop_loss = side === "Buy" ? parseFloat((req.body.price-slTicks).toFixed(2)) : parseFloat((req.body.price+slTicks).toFixed(2));
    const time_in_force = req.body.order_type === "Market" ? "ImmediateOrCancel" : "GoodTillCancel";

    // await restClient.setUserLeverage({ symbol: "ETHUSDT", buy_leverage: req.body.leverage, sell_leverage: req.body.leverage });

    const position = {
        side,
        symbol: req.body.symbol,
        qty: req.body.qty,
        price: req.body.price,
        order_type: req.body.order_type,
        take_profit,
        stop_loss,
        time_in_force,
        reduce_only: false,
        close_on_trigger: false,
    };

    restClient.placeActiveOrder(position)
    .then((response) => {
        if(response.ret_msg !== "OK") {
            console.log(`[${new Date().toGMTString()}]: ${req.method.toUpperCase()} ${req.url} ${400} -> ${response.ret_msg}`);
            return res.status(400).json(response);
        }
        console.log(`[${new Date().toGMTString()}]: ${req.method.toUpperCase()} ${req.url} ${200} -> ${response.ret_msg}`);
        return res.status(200).json(response)
    })
    .catch((error) => {
        console.log(`[${new Date().toGMTString()}]: ${req.method.toUpperCase()} ${req.url} ${400} -> Server error: ${error.message}`);
        return res.status(400).json(error);
    });
}

module.exports = {
    longPosition,
    shortPosition,
    orderPosition
};