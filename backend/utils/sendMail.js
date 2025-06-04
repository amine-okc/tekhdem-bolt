
const nodemailer = require('nodemailer');
require('dotenv').config({ path: '../.env.development' });

async function sendEmail() {
  try {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,       // Replace with your Gmail
        pass: process.env.SMTP_PASSWORD,     // Paste the 16-character App Password
      },
    });

    console.log(process.env.SMTP_USER, process.env.SMTP_PASSWORD);

    let info = await transporter.sendMail({
      from: `"Tekhdem" <${process.env.EMAIL}>`,
      to: 'amine.ms2002@gmail.com', // You can use your own email for testing
      subject: 'Test Email from Node.js',
      text: 'Hello! This is a test email sent from Node.js using Gmail.',
      html: '<b>Hello!</b><br>This is a test email sent from <i>Node.js</i> using Gmail.',
    });

    console.log('✅ Email sent: %s', info.messageId);
  } catch (error) {
    console.error('❌ Error sending email:', error);
  }
}

sendEmail();