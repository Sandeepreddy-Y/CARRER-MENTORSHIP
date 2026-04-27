const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'counsellor')) {
    next();
  } else {
    return res.status(403).json({ message: 'Access denied. Admin privileges required' });
  }
};

const counsellorMiddleware = (req, res, next) => {
  if (req.user && req.user.role === 'counsellor') {
    next();
  } else {
    return res.status(403).json({ message: 'Access denied. Counsellor privileges required' });
  }
};

module.exports = { authMiddleware, adminMiddleware, counsellorMiddleware };
