const { verifyToken } = require('../utils/auth');

// Middleware to verify JWT token
const authenticate = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'No token provided' 
      });
    }

    // Extract token (remove 'Bearer ' prefix)
    const token = authHeader.substring(7);

    // Verify token
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'Invalid or expired token' 
      });
    }

    // Add user info to request
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ 
      error: 'Unauthorized',
      message: 'Authentication failed' 
    });
  }
};

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({ 
      error: 'Forbidden',
      message: 'Admin access required' 
    });
  }
  next();
};

module.exports = {
  authenticate,
  requireAdmin
};
