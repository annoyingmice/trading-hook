require("dotenv").config();
const http = require("http");
const app = require("./app");

const _PORT = process.env.PORT;
const _HOST = process.env.HOST;

const server = http.createServer(app);

server.listen(_PORT, _HOST, () => {
  console.log(`Server running on http://${_HOST}:${_PORT}`);
});
