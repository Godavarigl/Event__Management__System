const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // Check if user is authenticated (req.user should be set by authenticateToken)
    if (!req.user) {
      return res.status(401).json({
        message: 'Authentication required'
      });
    }

    // Check if user's role is in the allowed roles
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'Access denied: insufficient permissions'
      });
    }

    // User has the required role, continue to the next middleware/route
    next();
  };
};

module.exports = authorizeRoles;
