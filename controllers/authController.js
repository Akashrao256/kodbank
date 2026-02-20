const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { username, password, email, phone } = req.body;

    if (!username || !password)
      return res.status(400).json({ message: "Missing fields" });

    const [existing] = await db.query(
      "SELECT * FROM KodUser WHERE username = ?",
      [username],
    );

    if (existing.length > 0)
      return res.status(400).json({ message: "Username already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO KodUser (username, email, password, phone, role, balance) VALUES (?, ?, ?, ?, ?, ?)",
      [username, email, hashedPassword, phone, "customer", 100000],
    );

    res.json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const [users] = await db.query("SELECT * FROM KodUser WHERE username = ?", [
      username,
    ]);

    if (users.length === 0)
      return res.status(400).json({ message: "Invalid credentials" });

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      {
        sub: user.username,
        uid: user.uid,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    await db.query(
      "INSERT INTO UserToken (token, uid, expiry) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 1 HOUR))",
      [token, user.uid],
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
    });

    res.json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
