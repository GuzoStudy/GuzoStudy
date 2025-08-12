const { verifyAccessToken } = require('../utils/token');
const User = require('../models/user.model');

module.exports = async function (req, res, next) {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'No token provided' });
    const token = auth.split(' ')[1];
    const payload = verifyAccessToken(token);
    // Optional: refresh user data from DB for sensitive actions
    const user = await User.findById(payload.id).select('-password -refreshTokens');
    if (!user) return res.status(401).json({ message: 'User not found' });
    req.user = { id: user._id.toString(), role: user.role };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token', error: err.message });
  }
};
