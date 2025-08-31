// src/utils/email.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const sendEmail = async (to, subject, text) => {
  console.log('Attempting to send email to:', to);
  console.log('GMAIL_USERNAME:', process.env.GMAIL_USERNAME);
  console.log('GMAIL_PASSWORD:', process.env.GMAIL_PASSWORD ? '****' : 'undefined');

  if (!to) {
    throw new Error('Recipient email address is undefined or empty');
  }
  if (!process.env.GMAIL_USERNAME || !process.env.GMAIL_PASSWORD) {
    throw new Error('Missing GMAIL_USERNAME or GMAIL_PASSWORD in .env');
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USERNAME,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"E-Learning Platform" <${process.env.GMAIL_USERNAME}>`,
    to, // ✅ use recipient
    subject,
    text, // plain text fallback
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>${subject}</h2>
        <p>${text}</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to:', to, 'Message ID:', info.messageId);
    return info;
  } catch (err) {
    console.error('Gmail error:', err.message);
    throw new Error('Failed to send email: ' + err.message);
  }
};

export default sendEmail;
