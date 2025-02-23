require('dotenv').config(); // 載入 .env 的設定

// src/app.js
const express = require('express');
const config = require('../config/config');
const app = express();

// 設定中間件、路由等
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// 啟動伺服器
app.listen(config.server.port, () => {
    console.log(`Server is running on port ${config.server.port}`);
});

module.exports = app;
