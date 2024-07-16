const mysql = require("mysql2");
const cron = require("node-cron");
const dotenv = require("dotenv");

dotenv.config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  multipleStatements: true,
});

connection.connect(err => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL");
});

// 프로젝트 상태 업데이트 함수
const updateProjectStatus = () => {
  const currentDate = new Date().toISOString().split("T")[0]; // 현재 날짜를 'YYYY-MM-DD' 형식으로 가져오기

  // 프로젝트 상태 업데이트 쿼리
  const updateStatusQuery = `
    UPDATE project
    SET status = CASE
      WHEN start_date > ? THEN 'pending'
      WHEN start_date <= ? AND end_date >= ? THEN 'active'
      WHEN end_date < ? THEN 'completed'
    END
  `;

  connection.query(
    updateStatusQuery,
    [currentDate, currentDate, currentDate, currentDate],
    (error, results) => {
      if (error) {
        console.error("Error updating project statuses:", error);
      } else {
        console.log("Project statuses updated:", results.affectedRows);
      }
    }
  );
};

// 매일 자정에 상태 업데이트 실행
cron.schedule("0 0 * * *", () => {
  console.log("Running project status update...");
  updateProjectStatus();
});

// 수동으로 스크립트 실행
if (require.main === module) {
  updateProjectStatus();
}

module.exports = updateProjectStatus; // 함수 내보내기
