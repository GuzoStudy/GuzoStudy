const bcrypt = require('bcrypt');
const sendEmail = require('./email');

const SALT_ROUNDS = 10;

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
}

/**
 * Prepares OTP and updates the user object (doesn't save).
 * @param {Object} user - Mongoose user document
 * @param {string} type - 'verification' or 'reset'
 * @param {string} subject - Email subject
 * @param {string} message - Additional email message
 * @param {number} minutesValid - OTP expiry time in minutes
 * @returns {string} The raw OTP (so caller can log or test)
 */
async function sendOtpToUser(user, type, subject, message, minutesValid = 5) {
  const otp = generateOTP();
  const otpHash = await bcrypt.hash(otp, SALT_ROUNDS);

  if (type === 'verification') {
    user.verificationToken = otpHash;
    user.verificationExpires = Date.now() + minutesValid * 60 * 1000;
  } else if (type === 'reset') {
    user.resetToken = otpHash;
    user.resetExpires = Date.now() + minutesValid * 60 * 1000;
  } else {
    throw new Error('Invalid OTP type');
  }

  // ✉️ Send email
  await sendEmail({
    to: user.email,
    subject,
    html: `
      <p>${message}</p>
      <h2>${otp}</h2>
      <p>This code will expire in ${minutesValid} minutes.</p>
    `
  });

  return otp; // helpful for debugging/testing in dev
}

module.exports = { sendOtpToUser };
