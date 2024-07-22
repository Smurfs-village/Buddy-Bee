const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config();

const connectionConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  multipleStatements: true,
};

const connectWithRetry = () => {
  const connection = mysql.createConnection(connectionConfig);

  connection.connect(err => {
    if (err) {
      console.error("Error connecting to MySQL, retrying in 5 seconds...", err);
      setTimeout(connectWithRetry, 5000);
    } else {
      console.log("Connected to MySQL");
    }
  });

  connection.on("error", function (err) {
    console.error("MySQL error", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      connectWithRetry();
    } else {
      throw err;
    }
  });

  module.exports = connection;
};

connectWithRetry();
