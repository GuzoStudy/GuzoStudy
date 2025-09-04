import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

// ======= JWT Token =======
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// ======= Send Email =======
const sendEmail = async (to, subject, text) => {
  try {
    if (!to) throw new Error('Recipient email is undefined');
    if (!process.env.GMAIL_USERNAME || !process.env.GMAIL_PASSWORD) {
      throw new Error('Missing Gmail credentials in .env');
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: `"E-Learning Platform" <${process.env.GMAIL_USERNAME}>`,
      to,
      subject,
      text,
      html: `<div style="font-family: Arial; line-height: 1.5;">
               <h2>${subject}</h2>
               <p>${text}</p>
             </div>`,
    });

    console.log('✅ Email sent to:', to, 'Message ID:', info.messageId);
    return info;
  } catch (err) {
    console.error('❌ Email send failed:', err.message);
    throw new Error('Email could not be sent: ' + err.message);
  }
};

// ======= Register / Signup =======
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user = new User({
      name,
      email,
      password,
      role,
      otp,
      otpExpires: Date.now() + 5 * 60 * 1000, // 5 minutes
    });

    await user.save();

    // Send OTP email safely
    try {
      await sendEmail(email, 'Verify your account', `Your OTP code is: ${otp}`);
    } catch (err) {
      console.error('OTP email failed:', err.message);
    }

    res.status(201).json({ message: 'User registered. Check email for OTP.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ======= Verify OTP =======
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.otp || user.otp !== otp || !user.otpExpires || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ======= Login =======
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    if (!user.isVerified) return res.status(400).json({ message: 'Please verify your email first' });

    const token = generateToken(user._id, user.role);
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ======= Resend OTP =======
export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 mins
    await user.save();

    try {
      await sendEmail(email, 'Resend OTP', `Your new OTP is: ${otp}`);
    } catch (err) {
      console.error('Resend OTP email failed:', err.message);
    }

    res.json({ message: 'New OTP sent to email' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ======= Get User Profile =======
export const getProfile = async (req, res) => {
  try {
    console.log('Authorization header:', req.headers.authorization);

    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token found' });
    }

    const user = await User.findById(req.user.id).select(
      '-password -otp -otpExpires -resetToken -resetTokenExpiry'
    );
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ======= Update User Profile =======
export const updateProfile = async (req, res) => {
  try {
    const { name, bio, profilePicture } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name;
    if (bio) user.bio = bio;
    if (profilePicture) user.profilePicture = profilePicture;

    await user.save();
    res.json({ message: 'Profile updated', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
