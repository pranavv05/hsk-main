// backend/routes/auth.routes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Vendor = require('../models/vendor.model'); // <--- THIS LINE WAS MISSING

const router = express.Router();

// --- POST /api/auth/register ---
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password, role, address } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !password || !role) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Validate phone number format (10 digits)
    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({ message: 'Please enter a valid 10-digit phone number' });
    }

    // Check if user with this email already exists with the same role
    let existingUser = await User.findOne({ email, role });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: `User already registered as a ${role} with this email`
      });
    }

    // Check if user exists with the same email but different role
    let user = await User.findOne({ email });

    if (user) {
      // User exists with different role, create a new user with the new role
      user = new User({
        name,
        email,
        phone,
        password,
        role,
        address
      });

      await user.save();
      console.log(`✅ New ${role} account created for existing email: ${user.email}`);
    } else {
      // Create new user if doesn't exist at all
      user = new User({ name, email, phone, password, role, address });
      await user.save();
      console.log(`✅ New user registered successfully as ${role}: ${user.email}`);
    }

    // If the role is 'vendor', create/update the corresponding vendor profile
    if (role === 'vendor') {
      let vendor = await Vendor.findOne({ user: user._id });

      if (!vendor) {
        // Create new vendor profile if doesn't exist
        vendor = new Vendor({
          user: user._id,
          fullName: user.name,
          phone: phone, // Pass phone from registration
          serviceType: 'General', // Default, or add to registration form? User didn't specify.
          // Wait, user complaint says "details which i filled up there". 
          // Check if registration form HAS these fields.
        });
        await vendor.save();
        console.log(`✅ Vendor profile created for: ${user.email}`);
      } else {
        console.log(`ℹ️ Vendor profile already exists for: ${user.email}`);
      }
    }

    const payload = { user: { id: user.id, role: user.role } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    const { password: _, ...userWithoutPassword } = user.toObject();
    res.status(201).json({ user: userWithoutPassword, token });

  } catch (error) {
    console.error('❌ ERROR during registration:', error);
    res.status(500).send('Server Error');
  }
});

// --- POST /api/auth/login ---
// --- POST /api/auth/login ---
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Helper to find user based on available info
    let user;
    if (role) {
      // Precise match if role is provided
      user = await User.findOne({ email, role });
    } else {
      // Loose match if no role provided
      // If multiple users exist with this email, we might have an issue without role specifier.
      // For now, let's try to find ONE.
      const users = await User.find({ email });

      if (users.length > 1) {
        return res.status(400).json({
          message: 'Multiple accounts found. Please select a role (User/Vendor) to login.'
        });
      } else if (users.length === 1) {
        user = users[0];
      }
    }

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = { user: { id: user.id, role: user.role } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    const { password: _, ...userWithoutPassword } = user.toObject();
    res.json({ user: userWithoutPassword, token });

  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).send('Server Error');
  }
});


// Import the email service
const { sendPasswordResetEmail } = require('../utils/emailService');

// --- POST /api/auth/forgot-password ---
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    console.log('Password reset requested for email:', email);

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    // Always return success to prevent email enumeration
    if (!user) {
      console.log('No user found with email:', email);
      return res.json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent'
      });
    }

    // Generate a reset token that expires in 1 hour
    const resetToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET + user.password, // Include user's current password in the secret
      { expiresIn: '1h' }
    );

    // Create reset URL with token and user ID
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&userId=${user._id}`;

    console.log('Generated reset URL for user:', user.email);

    try {
      // Send email with reset link
      const emailResult = await sendPasswordResetEmail(user.email, resetUrl);
      console.log('Password reset email sent successfully to:', user.email);

      // Store the reset token and expiry in the user document
      user.passwordResetToken = resetToken;
      user.passwordResetExpires = Date.now() + 3600000; // 1 hour from now
      await user.save({ validateBeforeSave: false });

      // Always return the same message whether the email exists or not
      // to avoid revealing whether an email exists in the system
      return res.json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent',
        // Only include resetToken in development for testing
        ...(process.env.NODE_ENV !== 'production' && { resetToken })
      });

    } catch (emailError) {
      console.error('Error sending password reset email:', {
        error: emailError.message,
        email: user.email,
        stack: emailError.stack
      });

      // In production, don't reveal the error details to the client
      const errorMessage = process.env.NODE_ENV === 'production'
        ? 'Error sending password reset email. Please try again later.'
        : `Error sending email: ${emailError.message}`;

      return res.status(500).json({
        success: false,
        message: errorMessage
      });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error during password reset' });
  }
});

// --- POST /api/auth/reset-password ---
router.post('/reset-password', async (req, res) => {
  try {
    const { token, userId, newPassword } = req.body;

    if (!token || !userId || !newPassword) {
      return res.status(400).json({ message: 'Token, user ID, and new password are required' });
    }

    console.log('Reset password request received for user ID:', userId);

    try {
      // Find the user by ID
      const user = await User.findById(userId);
      if (!user) {
        console.log('User not found with ID:', userId);
        return res.status(400).json({ message: 'Invalid or expired reset token' });
      }

      console.log('Found user for password reset:', user.email);

      try {
        // Verify the token using JWT_SECRET + user's current password
        // This ensures the token is only valid for the current password
        const decoded = jwt.verify(token, process.env.JWT_SECRET + user.password);
        console.log('Token verified successfully for user:', user.email);

        if (decoded.id !== userId) {
          console.log('Token user ID does not match request user ID');
          return res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        // Update the password - this will trigger the pre-save hook to hash it
        user.password = newPassword;

        // Clear any existing reset token
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        // Save the user (this will hash the password via the pre-save hook)
        await user.save({ validateBeforeSave: false });

        console.log('Password updated successfully for user:', user.email);

        return res.json({
          success: true,
          message: 'Password has been reset successfully'
        });

      } catch (tokenError) {
        console.error('Token verification failed:', {
          error: tokenError.message,
          token: token,
          userId: userId
        });

        return res.status(400).json({
          success: false,
          message: 'Invalid or expired reset token',
          // In development, include more details
          ...(process.env.NODE_ENV !== 'production' && {
            error: tokenError.message,
            hint: 'The reset link may have expired or already been used. Please request a new password reset.'
          })
        });
      }

    } catch (error) {
      console.error('Error during password reset:', {
        error: error.message,
        stack: error.stack
      });

      return res.status(500).json({
        success: false,
        message: 'Server error during password reset',
        ...(process.env.NODE_ENV !== 'production' && { error: error.message })
      });
    }
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error during password reset' });
  }
});

module.exports = router;