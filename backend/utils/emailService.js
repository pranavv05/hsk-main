// backend/utils/emailService.js
const nodemailer = require('nodemailer');
require('dotenv').config();

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Send a password reset email
 * @param {string} to - Recipient email address
 * @param {string} resetUrl - The password reset URL
 * @returns {Promise<Object>} - Result of the email sending operation
 */
async function sendPasswordResetEmail(to, resetUrl) {
  try {
    // Email options
    const mailOptions = {
      from: `"Hindu Seva Kendra" <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
      to,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset Request</h2>
          <p>You requested a password reset for your Hindu Seva Kendra account.</p>
          <p>Please click the button below to reset your password:</p>
          <div style="margin: 25px 0;">
            <a href="${resetUrl}" 
               style="background-color: #4CAF50; color: white; padding: 12px 25px; 
                      text-decoration: none; border-radius: 4px; font-weight: bold;">
              Reset Password
            </a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all;">${resetUrl}</p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #777; font-size: 12px;">
            This is an automated message, please do not reply directly to this email.
          </p>
        </div>
      `,
      text: `Password Reset Request\n\n` +
        `You requested a password reset for your Hindu Seva Kendra account.\n\n` +
        `Please use the following link to reset your password (expires in 1 hour):\n${resetUrl}\n\n` +
        `If you didn't request this, please ignore this email.`
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
}

module.exports = {
  sendPasswordResetEmail
};
