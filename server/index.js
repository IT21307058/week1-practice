const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { sequelize, connectDB } = require("./db/db");
const errorHandler = require("./middlewares/errorhandler");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

//routes
app.use("/api/users", userRoutes);
app.use('/posts', postRoutes);

app.use("/api/products", (req, res) => {
  return res.status(200).json({
    message: "This is new feature change, a new route for products samin",
  });
});

//error handler
app.use(errorHandler);

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