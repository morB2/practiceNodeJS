const express = require('express');
const path = require('path');
const http = require('http');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3002;
const { routesInit } = require('./routes/config_routes');
require('./db/mongoConnect');

app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());

routesInit(app);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "sites.html"));
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
