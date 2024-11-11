import nodemailer from 'nodemailer';

const sendEmail = (to, subject, text) => {
  const transport = nodemailer.createTransport({
    host: 'live.smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: 'api',
      pass: 'c437195edd118e2323a35dde249cad0a',
    }
  });

  const toAddress = process.env.NODE_ENV === 'development' ? process.env.ADMIN_EMAIL : to;

  const mailOptions = {
    from: `"DivLog" <noreply@${process.env.DEV_EMAIL_DOMAIN}>`,
    to: toAddress,
    subject,
    text
  }

  transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error: ', error);
      return {
        success: false,
        message: 'Failed to send email'
      }
    }

    console.log('Email sent: ', info.response);
    return {
      success: true,
      message: 'Email has been sent. Please check your mailbox'
    }
  });
}

export default sendEmail;