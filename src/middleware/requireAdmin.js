/**
 * Admin middleware - Require admin role
 * Checks if user has admin role
 */

const requireAdminRole = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    // Check if user has admin role
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required. This action is restricted to administrators only.'
      });
    }
    
    next();
  } catch (error) {
    console.error('Admin role check error:', error);
    res.status(500).json({
      success: false,
      message: 'Authorization error'
    });
  }
};

module.exports = requireAdminRole;
