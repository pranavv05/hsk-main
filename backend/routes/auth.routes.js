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

    // Check if email already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Check if phone number already exists
    const existingPhoneUser = await User.findOne({ phone });
    if (existingPhoneUser) {
      return res.status(400).json({ message: 'Phone number already registered' });
    }

    // Create new user with phone number
    user = new User({ name, email, phone, password, role, address });
    await user.save();
    console.log(`✅ User saved successfully: ${user.email}`);

   // If the role is 'vendor', create the corresponding vendor profile
    if (role === 'vendor') {
      const newVendor = new Vendor({
        user: user._id,
        fullName: user.name,
      });
      await newVendor.save();
      console.log(`✅ Vendor profile created for: ${user.email}`);
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
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
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
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // For security, don't reveal that the email doesn't exist
      return res.json({ message: 'If an account with that email exists, a password reset link has been sent' });
    }

    // Generate reset token (using JWT for simplicity)
    const resetToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET + user.password, // Add user's current password to the secret to invalidate when password changes
      { expiresIn: '1h' }
    );

    // Get the frontend URL from environment variables (required in production)
    const frontendUrl = process.env.FRONTEND_URL;
    if (!frontendUrl) {
      console.error('FRONTEND_URL environment variable is not set');
      return res.status(500).json({ message: 'Server configuration error' });
    }
    
    // Ensure the URL doesn't have a trailing slash
    const baseUrl = frontendUrl.endsWith('/') ? frontendUrl.slice(0, -1) : frontendUrl;
    const resetUrl = `${baseUrl}/reset-password?token=${resetToken}&userId=${user._id}`;
    
    try {
      // Send the password reset email
      await sendPasswordResetEmail(user.email, resetUrl);
      
      // In development, still log the reset URL to the console for testing
      if (process.env.NODE_ENV !== 'production') {
        console.log('Development - Password reset URL:', resetUrl);
      }
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError);
      // In production, don't reveal the error details to the client
      const errorMessage = process.env.NODE_ENV === 'production'
        ? 'Error sending password reset email. Please try again later.'
        : `Error sending email: ${emailError.message}`;
        
      return res.status(500).json({ 
        message: errorMessage
      });
    }

    // Always return the same message whether the email exists or not
    // to avoid revealing whether an email exists in the system
    res.json({ 
      message: 'If an account with that email exists, a password reset link has been sent',
      // Only include resetToken in development for testing
      ...(process.env.NODE_ENV !== 'production' && { resetToken })
    });
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

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    try {
      // Verify the token using the user's current password in the secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET + user.password);
      
      // Update the password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      
      // Invalidate the token by changing the password (implicitly invalidates the JWT)
      await user.save();
      
      res.json({ message: 'Password has been reset successfully' });
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error during password reset' });
  }
});

module.exports = router;