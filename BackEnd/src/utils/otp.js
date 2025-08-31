// src/utils/otp.js
// Generate a 6-digit OTP
export const generateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit number
  console.log('Generated OTP:', otp); // For debugging
  return otp;
};

// Validate OTP (for future use, e.g., manual OTP entry)
export const validateOTP = (inputOTP, storedOTP) => {
  return inputOTP === storedOTP;
};