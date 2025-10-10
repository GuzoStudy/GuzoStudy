import dotenv from 'dotenv';
import formData from 'form-data';
import Mailgun from 'mailgun.js';

dotenv.config();

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY,
});

const sendEmail = async (to, subject, otp, studentName = 'Student') => {
  if (!to) throw new Error('Recipient email is missing');

  const messageData = {
    from: process.env.EMAIL_FROM,
    to,
    subject,
    text: `Hello ${studentName}, your OTP code is ${otp}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #2563eb;">GuZo Study - OTP Verification</h2>
        <p>Hello <strong>${studentName}</strong>,</p>
        <p>Thank you for registering. Your OTP code is:</p>
        <h1 style="text-align: center; background-color: #f0f4ff; padding: 10px 0; border-radius: 6px; letter-spacing: 2px; font-size: 32px;">${otp}</h1>
        <p>This code will expire in <strong>5 minutes</strong>.</p>
        <p style="color: #555; font-size: 14px; margin-top: 20px;">If you did not request this, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #999;">&copy; 2025 GuZo Study. All rights reserved.</p>
      </div>
    `,
  };

  try {
    const result = await mg.messages.create(process.env.MAILGUN_DOMAIN, messageData);
    console.log('📧 OTP Email sent to:', to, 'ID:', result.id);
    return result;
  } catch (error) {
    console.error('❌ OTP email failed:', error.message);
    throw new Error('Failed to send email: ' + error.message);
  }
};

export default sendEmail;
