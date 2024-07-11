const connection = require("../models/db");

exports.getUserProfile = (req, res) => {
  const userId = req.user.userId;

  const query = `
    SELECT username, phone_number, account_number, intro
    FROM user
    WHERE id = ?
  `;

  console.log(`Executing query: ${query} with userId: ${userId}`);

  connection.query(query, [userId], (error, results) => {
    if (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).send("Server error");
      return;
    }

    console.log("Query results:", results);

    if (results.length === 0) {
      res.status(404).send("User not found");
      return;
    }

    res.status(200).json(results[0]);
  });
};

exports.updateUserProfile = (req, res) => {
  const userId = req.user.userId;
  const { username, phone_number, account_number, intro } = req.body;

  const query = `
    UPDATE user
    SET username = ?, phone_number = ?, account_number = ?, intro = ?
    WHERE id = ?
  `;

  connection.query(
    query,
    [username, phone_number, account_number, intro, userId],
    error => {
      if (error) {
        console.error("Error updating user profile:", error);
        res.status(500).send("Server error");
        return;
      }

      res.status(200).send("User profile updated successfully");
    }
  );
};
