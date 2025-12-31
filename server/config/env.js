require('dotenv').config();

module.exports = {
  mongoDbUrl: process.env.MONGO_DB_URL,
  postgresDb: process.env.POSTGRES_DB,
  postgresUser: process.env.POSTGRES_USER,
  postgresPassword: process.env.POSTGRES_PASSWORD,
  postgresHost: process.env.POSTGRES_HOST,
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  geminiApiKey: process.env.GEMINI_API_KEY,
};
