const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  // Get the authorization header
  const authHeader = req.headers.authorization;

  // Check if authorization header exists
  if (!authHeader) {
    return res.status(401).json({
      message: 'Access token is required'
    });
  }

  // Extract the token from "Bearer <token>"
  const token = authHeader.split(' ')[1];

  // Check if token exists
  if (!token) {
    return res.status(401).json({
      message: 'Access token is required'
    });
  }

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        message: 'Invalid or expired token'
      });
    }

    // Attach the decoded user information to the request
    req.user = decoded;

    // Continue to the next middleware/route
    next();
  });
};

module.exports = authenticateToken;
