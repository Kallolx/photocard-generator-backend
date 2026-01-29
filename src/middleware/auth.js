const jwt = require("jsonwebtoken");
const { query } = require("../config/database");

/**
 * Authentication Middleware
 * Verifies JWT token and attaches user to request
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided. Authorization header required.",
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database
    const users = await query(
      "SELECT id, name, email, plan, role, plan_status, status FROM users WHERE id = ? AND status = ?",
      [decoded.userId, "active"],
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "User not found or account inactive",
      });
    }

    // Attach user to request
    req.user = users[0];
    req.userId = users[0].id;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired. Please login again.",
        code: "TOKEN_EXPIRED",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    console.error("Auth middleware error:", error);
    res.status(500).json({
      success: false,
      message: "Authentication error",
    });
  }
};

/**
 * Optional Authentication
 * Attaches user if token is valid, but doesn't fail if missing
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next();
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const users = await query(
      "SELECT id, name, email, plan, role, plan_status, status FROM users WHERE id = ? AND status = ?",
      [decoded.userId, "active"],
    );

    if (users.length > 0) {
      req.user = users[0];
      req.userId = users[0].id;
    }

    next();
  } catch (error) {
    // Silently continue without user
    next();
  }
};

/**
 * Check if user has required plan
 */
const requirePlan = (minPlan) => {
  const planHierarchy = { Free: 0, Basic: 1, Premium: 2 };

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const userPlanLevel = planHierarchy[req.user.plan] || 0;
    const requiredPlanLevel = planHierarchy[minPlan] || 0;

    if (userPlanLevel < requiredPlanLevel) {
      return res.status(403).json({
        success: false,
        message: `This feature requires ${minPlan} plan or higher`,
        currentPlan: req.user.plan,
        requiredPlan: minPlan,
        upgradeRequired: true,
      });
    }

    next();
  };
};

/**
 * Admin only middleware
 */
const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Check if user has admin role (we'll add role field later)
    // For now, check if email contains 'admin' as a simple check
    const isAdmin = req.user.email.toLowerCase().includes("admin");

    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    next();
  } catch (error) {
    console.error("Admin check error:", error);
    res.status(500).json({
      success: false,
      message: "Authorization error",
    });
  }
};

module.exports = {
  authenticate,
  optionalAuth,
  requirePlan,
  requireAdmin,
};
