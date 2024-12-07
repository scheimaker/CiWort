const { admin } = require('../config/firebase');

// Middleware to verify Firebase ID token
const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract Bearer token from header
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decodedToken = await admin.auth().verifyIdToken(token); // Verify Firebase token
    req.userId = decodedToken.uid; // Attach user ID to the request
    next(); // Proceed to next middleware/route
  } catch (error) {
    res.status(403).json({ message: 'Invalid token' });
  }
};

module.exports = authenticate;
