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

app.use(({ res }) => {
  const msg = "route introuvable";
  res.status(404).json({ msg });
});
PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`SERVER RUNNING ON PORT: ${PORT}`));
