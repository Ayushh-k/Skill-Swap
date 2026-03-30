import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendOTP(email: string, otp: string) {
  const mailOptions = {
    from: `"Skill-Swap Verification" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your Skill-Swap Account",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff;">
        <h2 style="color: #0d9488; text-align: center;">Welcome to Skill-Swap!</h2>
        <p style="color: #374151; font-size: 16px; line-height: 1.5;">
          Thank you for joining our community. To complete your registration and verify your profile, please use the 6-digit verification code below:
        </p>
        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; margin: 24px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #111827;">${otp}</span>
        </div>
        <p style="color: #6b7280; font-size: 14px;">
          This code will expire in 10 minutes. If you didn't request this, you can safely ignore this email.
        </p>
        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
        <p style="color: #9ca3af; font-size: 12px; text-align: center;">
          &copy; ${new Date().getFullYear()} Skill-Swap Platform. All rights reserved.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}
