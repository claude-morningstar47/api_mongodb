const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");

// MIDDLEWARES
dotenv.config({ path: "./src/config/config.env" });
require("./src/config/Db");
app.use(cors());
app.use(express.json());
app.use(morgan("dev")); // for logging

// ROUTES
app.use("/api/v1", require("./src/routes/posts"));
app.use("/api/v1", require("./src/routes/auth"));
app.use("/api/v1", require("./src/routes/features"));

// ERROR HANDLING MIDDLEWARE
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ msg: "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`SERVER RUNNING ON PORT: ${PORT}`));
