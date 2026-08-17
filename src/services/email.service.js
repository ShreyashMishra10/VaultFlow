require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify connection configuration on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});


const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"VaultFlow" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log('Message sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error; 
  }
};


async function sendRegistrationEmail(userEmail, name) {
  const subject = "Welcome to VaultFlow";
  const text = `Hello ${name},\n\nThank you for registering at VaultFlow. We're excited to have you on board!\n\nBest regards,\nThe VaultFlow Team`;
  const html = `<p>Hello ${name},</p><p>Thank you for registering at VaultFlow. We're excited to have you on board!</p><p>Best regards,<br>The VaultFlow Team</p>`;

  return await sendEmail(userEmail, subject, text, html);
}

module.exports = sendRegistrationEmail;