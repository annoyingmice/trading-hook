require("../../untils");
const { SpotClientV3 } = require('bybit-api');

const _KEY = process.env.BYBIT_KEY;
const _SECRET = process.env.BYBIT_SECRET;
const testnet = process.env.NODE_ENV == "development";

const sportOrderPosition = async (req, res) => {
    const restClient = new SpotClientV3({
        key: _KEY,
        secret: _SECRET,
        testnet
    });
    let symbol = String(req.body.symbol.join('')).toUpperCase();
    let orderQty = 0;
    let primaryCurrency = String(req.body.symbol[0]);
    let secondaryCurrency = String(req.body.symbol[1]);
    const side = String(req.body.side).charAt(0).toUpperCase() + String(req.body.side).slice(1);
    const orderType = String(req.body.orderType).toUpperCase();
    const position = {
        symbol,
        orderQty,
        side,
        orderType
    };

    try {

        const balances = await restClient.getBalances();
        const currencyBalance = balances.result.balances.filter(item => side==="Sell"?item.coinId === primaryCurrency:item.coinId===secondaryCurrency).pop();
        const free = parseFloat(currencyBalance.free); // 7.62939022294
        if(req.body.allBalance) {
            position.orderQty = free.toFixedNoRound(7);
        }

        const response = await restClient.submitOrder(position);
        if(response.retMsg !== "OK") {
            console.log(`[${new Date().toGMTString()}]: ${req.method.toUpperCase()} ${req.url} ${400} -> ${response.retMsg}`);
            return res.status(400).json(response);
        }
        console.log(`[${new Date().toGMTString()}]: ${req.method.toUpperCase()} ${req.url} ${200} -> ${response.retMsg}`);
        return res.status(200).json(response);

    } catch(error) {

        console.log(`[${new Date().toGMTString()}]: ${req.method.toUpperCase()} ${req.url} ${400} -> Server error: ${error.message}`);
        return res.status(400).json(error);
    }
}



module.exports = {
    sportOrderPosition
};