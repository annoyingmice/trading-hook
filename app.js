const express = require("express");
const cors = require("cors");

const bybit = require("./handlers/bybit");

const app = express();
const corsOptions = {
  origin: function (origin, callback) {
    if (
      [
        "http://52.89.214.238",
        "http://34.212.75.30",
        "http://54.218.53.128",
        "http://52.32.178.7",
      ].indexOf(origin) !== -1
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const timestart = Date.now();

  next();

  const timeend = Date.now();
  console.log(
    `[${new Date().toGMTString()}]: ${req.method.toUpperCase()} ${req.url} ${
      res.statusCode
    } ${timeend - timestart}s`,
  );
});

app.use("/bybit", cors(corsOptions), bybit);

app.get("/health", (req, res) => {
  return res.sendStatus(200);
});

app.use("/*", (req, res, next) => {
  return res.status(404).json({
    timestamp: new Date().toTimeString(),
    status: 404,
  });
});

module.exports = app;
