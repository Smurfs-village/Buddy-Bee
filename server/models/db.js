const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config();

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "dbzlxoddl1",
  database: "buddy_bee",
  multipleStatements: true,
});

connection.connect(err => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL");
});

module.exports = connection;
