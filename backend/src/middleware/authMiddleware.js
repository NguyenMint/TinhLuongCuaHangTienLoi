const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Không có token" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Token không hợp lệ:", err);
    return res.status(401).json({ message: "Token không hợp lệ hoặc hết hạn" });
  }
}
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    const user = req.user;
    if (!user || !allowedRoles.includes(user.MaVaiTro)) {
      return res.status(403).json({ message: "Không có quyền truy cập!" });
    }
    next();
  };
}

module.exports = { authorizeRoles, authMiddleware };
