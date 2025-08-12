

const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const crypto = require('crypto');
const { sendEmail } = require('../utils/email');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/token');

const SALT_ROUNDS = 10;
const { sendOtpToUser } = require('../utils/otp');

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already in use' });

    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = new User({ name, email, password: hash, role, authProvider: 'email', verified: false });

    await sendOtpToUser(
      user,
      'verification',
      'Verify your E-Learn account',
      'Your verification code is:'
    );

    res.status(201).json({ message: 'Registered. Please check your email for OTP.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: 'Email and OTP required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.verified) return res.status(400).json({ message: 'User already verified' });
    if (!user.verificationExpires || user.verificationExpires < Date.now()) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    const isMatch = await bcrypt.compare(otp, user.verificationToken || '');
    if (!isMatch) return res.status(400).json({ message: 'Invalid OTP' });

    user.verified = true;
    user.verificationToken = undefined;
    user.verificationExpires = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    if (!user.verified) return res.status(403).json({ message: 'Email not verified' });

    const ok = await bcrypt.compare(password, user.password || '');
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const payload = { id: user._id.toString(), role: user.role };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    // store refresh token in DB (so we can revoke)
    user.refreshTokens.push(refreshToken);
    await user.save();

    // For mobile you will return tokens in JSON. For web you might also set an httpOnly cookie.
    res.json({ accessToken, refreshToken, user: { id: user._id, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: 'Refresh token required' });

    
    const payload = verifyRefreshToken(refreshToken);
    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ message: 'User not found' });
    if (!user.refreshTokens.includes(refreshToken)) return res.status(401).json({ message: 'Invalid refresh token' });

    const newAccess = signAccessToken({ id: user._id.toString(), role: user.role });
    const newRefresh = signRefreshToken({ id: user._id.toString(), role: user.role });

    
    user.refreshTokens = user.refreshTokens.filter(t => t !== refreshToken);
    user.refreshTokens.push(newRefresh);
    await user.save();

    res.json({ accessToken: newAccess, refreshToken: newRefresh });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Invalid or expired refresh token', error: err.message });
  }
};

exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: 'Refresh token required' });

    // remove from DB
    const payload = verifyRefreshToken(refreshToken);
    const user = await User.findById(payload.id);
    if (user) {
      user.refreshTokens = user.refreshTokens.filter(t => t !== refreshToken);
      await user.save();
    }

    res.json({ message: 'Logged out' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Error logging out', error: err.message });
  }
};
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    await sendOtpToUser(
      user,
      'reset',
      'Password Reset OTP',
      'Your password reset code is:'
    );

    res.json({ message: 'Password reset OTP sent to your email' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// Reset Password using OTP
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'Email, OTP, and new password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.resetExpires || user.resetExpires < Date.now()) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    const isMatch = await bcrypt.compare(otp, user.resetToken || '');
    if (!isMatch) return res.status(400).json({ message: 'Invalid OTP' });

    const hash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    user.password = hash;
    user.resetToken = undefined;
    user.resetExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
