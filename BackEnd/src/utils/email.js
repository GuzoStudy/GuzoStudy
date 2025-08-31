const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS // Use App Password from Google
  }
});

async function sendEmail({ to, subject, html }) {
  return transporter.sendMail({
    from: `"E-Learn" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html
  });
}

module.exports = sendEmail;
