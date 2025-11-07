const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
require("dotenv").config();
async function sendWelcomeEmail(userEmail, userName) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
  from: `"ExerSync" <${process.env.EMAIL_USER}>`,
  to: userEmail,
  subject: "🎉 Welcome to ExerSync — Let’s Crush Your Fitness Goals!",
  html: `
  <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f6f8; padding: 40px 0; text-align: center;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); overflow: hidden;">
      <div style="background: linear-gradient(135deg, #3b82f6, #10b981); padding: 20px;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to ExerSync!</h1>
      </div>
      <div style="padding: 30px;">
        <h2 style="color: #111827; font-size: 22px;">Hey ${userName} 👋</h2>
        <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
          We’re <b>thrilled</b> to have you join <b>ExerSync</b> — your new partner in fitness, motivation, and progress.  
        </p>
        <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
          Start tracking your workouts, challenge yourself, and make fitness fun again! 💪
        </p>
        <a href="https://innotech-exer-sync.vercel.app/" target="_blank"
          style="display: inline-block; background-color: #3b82f6; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; margin-top: 20px;">
          Get Started
        </a>
        <p style="margin-top: 40px; color: #9ca3af; font-size: 14px;">
          Stay consistent. Stay strong. Stay synced.
        </p>
        <p style="margin-top: 10px; color: #6b7280; font-size: 14px;">
          Cheers,<br><b>The ExerSync Team</b>
        </p>
      </div>
    </div>
  </div>
  `,
};


    await transporter.sendMail(mailOptions);
    console.log("Welcome email successfully sent to:", userEmail);
  } catch (error) {
    console.error("Error sending welcome email:", error);
  }
}
console.log(process.env.EMAIL_USER)
module.exports = { sendWelcomeEmail };
