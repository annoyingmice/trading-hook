const express = require("express");

const { longPosition, shortPosition } = require("./order.perp");

const bybitRouter = express.Router();

bybitRouter.post("/long", longPosition);
bybitRouter.post("/short", shortPosition);

module.exports = bybitRouter;
