const express = require("express");

const { longPosition, shortPosition, orderPosition } = require("./order.perp");

const bybitRouter = express.Router();

bybitRouter.post("/long", longPosition);
bybitRouter.post("/short", shortPosition);
bybitRouter.post("/order", orderPosition);

module.exports = bybitRouter;
