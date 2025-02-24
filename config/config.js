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

export default config