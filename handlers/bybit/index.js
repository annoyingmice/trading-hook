const express = require("express");

const { longPosition, shortPosition, orderPosition } = require("./order.perp");
const { sportOrderPosition } = require("./order.spot");
const { apiPerpv5 } = require("./order.perp.apiv5");

const bybitRouter = express.Router();

bybitRouter.post("/long", longPosition);
bybitRouter.post("/short", shortPosition);
bybitRouter.post("/order", orderPosition);
bybitRouter.post("/spot-order", sportOrderPosition);
bybitRouter.post("/order-perp-v5", apiPerpv5);

module.exports = bybitRouter;
