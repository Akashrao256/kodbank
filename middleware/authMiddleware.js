const jwt = require("jsonwebtoken");
const db = require("../config/db");

module.exports = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const [rows] = await db.query("SELECT * FROM UserToken WHERE token = ?", [
      token,
    ]);

    if (rows.length === 0)
      return res.status(401).json({ message: "Invalid session" });

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalid or expired" });
  }
};
