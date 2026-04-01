const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  let transporter;

  // If no SMTP configured, automatically create ethereal test account
  if (!process.env.SMTP_HOST) {
    let testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });
    console.log(`[Email System] No SMTP variables found. Using Ethereal Email test account: ${testAccount.user}`);
  } else {
    // Normal provider configuration
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT, // e.g. 587
      auth: {
        user: process.env.SMTP_EMAIL, // e.g. your-email@gmail.com
        pass: process.env.SMTP_PASSWORD // e.g. App Password
      }
    });
  }

  // Build the mail details
  const message = {
    from: `${process.env.FROM_NAME || 'Circle Support'} <${process.env.FROM_EMAIL || 'noreply@circle.io'}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html
  };

  // Perform the send
  const info = await transporter.sendMail(message);

  console.log(`[Email System] Message sent: %s`, info.messageId);

  // If we used the Ethereal testing account, automatically log the preview link!
  if (!process.env.SMTP_HOST) {
    console.log(`\n======================================================`);
    console.log(`[Email System] Test Email Sent! View it in your browser:`);
    console.log(`👉 ${nodemailer.getTestMessageUrl(info)}`);
    console.log(`======================================================\n`);
  }
};

module.exports = sendEmail;
