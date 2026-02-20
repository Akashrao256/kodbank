require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const balanceRoutes = require("./routes/balanceRoutes");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));

app.use("/api/auth", authRoutes);
app.use("/api/balance", balanceRoutes);

app.listen(process.env.PORT || 5000, () => {
  console.log("Server running on port 5000");
});
