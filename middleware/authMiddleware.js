const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.sendResponse(401, "Token invalid", []);
  }

  //ทำการตรวจสอบ Token เพื่อใช้งาน API
  jwt.verify(token, process.env.SECRET_KEY, async (err, user) => {
    if (err) {
      return res.sendResponse(403, 'Token invalid', []);
    }

    const dbUser = await User.findById(user.id);
    if (!dbUser || !dbUser.isApproved) {
      return res.sendResponse(403, 'User not approved', [])
    }

    req.user = dbUser;
    next();
  });
};

// const isAdmin = async (req, res, next) => {
//   try {
//     const user = await User.findById(req.user.id);
//     if (!user || !user.role !== "admin") {
//       return res.status(403).json({ message: "Access denied" });
//     }
//     next();
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

module.exports = { authenticateToken };
