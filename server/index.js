const express = require("express");
const cors = require("cors");
require("dotenv").config();
const swaggerUi = require("swagger-ui-express");
const fs = require("fs");
const path = require("path");

const { sequelize, connectDB } = require("./db/db");
const errorHandler = require("./middlewares/errorhandler");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

//routess
app.use('/auth', authRoutes);
app.use('/posts', postRoutes);
app.use('/users', userRoutes);

app.use("/api/products", (req, res) => {
  return res.status(200).json({
    message: "This is new feature change, a new route for products samin",
  });
});

//error handler
app.use(errorHandler);

const swaggerPath = path.join(__dirname, "docs", "swagger.json");
const swaggerDoc = fs.existsSync(swaggerPath)
  ? JSON.parse(fs.readFileSync(swaggerPath, "utf8"))
  : { openapi: "3.0.0", info: { title: "API", version: "1.0.0" }, paths: {} };

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

(async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL connected');

    await connectDB(); 

    app.listen(port, () => console.log(`Server started on port ${port}`));
  } catch (err) {
    console.error('Database connection error:', err);
  }
})();