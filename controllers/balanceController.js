const db = require("../config/db");

exports.getBalance = async (req, res) => {
  try {
    const uid = req.user.uid;

    const [users] = await db.query(
      "SELECT balance FROM KodUser WHERE uid = ?",
      [uid],
    );

    if (users.length === 0)
      return res.status(404).json({ message: "User not found" });

    res.json({
      message: "Your balance is",
      balance: users[0].balance,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
