const nodemailer = require("nodemailer");

module.exports = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST, // Ensure HOST is set or use service only
      service: process.env.SERVICE, // Use service if host is not provided
      port: Number(process.env.EMAIL_PORT), // Corrected 'post' to 'port'
      secure: process.env.SECURE === "true", // Convert 'secure' to boolean
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: subject,
      text: text,
    });
    console.log("Email sent successfully");
  } catch (error) {
    console.log("Email not sent", error);
  }
};
