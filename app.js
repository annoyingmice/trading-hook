const express = require("express");
const cors = require("cors");

const bybit = require("./handlers/bybit");

const app = express();

// app.use(cors({
//     origin: "",
//     methods: ["GET", "POST"],
// }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/bybit", bybit);

app.get("/health", (req, res) => {
    return res.sendStatus(200);
});

app.use("/*", (req, res, next) => {
    return res.status(404).json({
        timestamp: new Date().toTimeString(),
        status: 404
    });
});

module.exports = app;
