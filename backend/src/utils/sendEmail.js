const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create transporter using traditional environment variables
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Setting default to gmail for easier setup
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_EMAIL, 
      pass: process.env.SMTP_PASSWORD 
    }
  });

  // Build the mail details
  const message = {
    from: `${process.env.FROM_NAME || 'Circle Support'} <${process.env.FROM_EMAIL || process.env.SMTP_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html
  };

  // Perform the physical send
  const info = await transporter.sendMail(message);

  console.log(`[Email System] Mail delivered successfully to ${options.email} (Message ID: ${info.messageId})`);
};

module.exports = sendEmail;
