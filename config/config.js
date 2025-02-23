require('dotenv').config(); // 載入 .env 的設定

const config = {
  database: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    name: process.env.DB_NAME || 'CRM'
  },
  server: {
    port: process.env.PORT || 3000
  }
};

module.exports = config;