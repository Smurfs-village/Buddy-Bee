const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    console.log("Authentication token is missing");
    return res.status(401).json({ message: "Authentication token is missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: decoded.userId };
    console.log("User information set in req:", req.user); // 추가된 로그
    next();
  } catch (error) {
    console.log("Invalid authentication token:", error.message); // 추가된 로그
    return res.status(401).json({ message: "Invalid authentication token" });
  }
};

module.exports = authMiddleware;
