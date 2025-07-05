import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const { JWT_SECRET } = process.env;

export function authenticate(req, res, next) {
  const token = req.cookies?.token;
  // console.log(token);

  if (!token) {
    return res.status(401).json({ message: "Token missing in cookie" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded.id || !decoded.role) {
      return res.status(401).json({ message: "Malformed token payload" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification error:", error);

    const message =
      error.name === "TokenExpiredError" ? "Token expired" : "Invalid token";

    res.status(401).json({
      message,
      error: error.message,
    });
  }
}

export function authorize(roles = []) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Required roles: ${roles.join(", ")}`,
      });
    }
    next();
  };
}
