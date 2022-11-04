const express = require("express");

const { longPosition, shortPosition, orderPosition } = require("./order.perp");
const { sportOrderPosition } = require("./order.spot");

const bybitRouter = express.Router();

bybitRouter.post("/long", longPosition);
bybitRouter.post("/short", shortPosition);
bybitRouter.post("/order", orderPosition);
bybitRouter.post('/spot-order', sportOrderPosition);

module.exports = bybitRouter;
