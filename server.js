require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const balanceRoutes = require("./routes/balanceRoutes");

const app = express();

/* ================================
   CORS CONFIGURATION
================================ */

const allowedOrigins = [
  "http://localhost:5173", // local frontend
  "https://kodbank-nectar.lovable.app", // 🔴 REPLACE with your actual Vercel URL
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow non-browser tools
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

/* ================================
   MIDDLEWARE
================================ */

app.use(express.json());
app.use(cookieParser());

/* ================================
   ROUTES
================================ */

app.get("/", (req, res) => {
  res.send("KodBank Backend Running 🚀");
});

app.use("/api/auth", authRoutes);
app.use("/api/balance", balanceRoutes);

/* ================================
   START SERVER
================================ */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
