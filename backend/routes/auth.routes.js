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
      console.log('Attempting to send password reset email to:', user.email);
      console.log('Reset URL:', resetUrl);
      
      // Send the password reset email
      const emailResult = await sendPasswordResetEmail(user.email, resetUrl);
      console.log('Email send result:', emailResult);
      
      // Always log the reset URL for debugging
      console.log('Password reset URL:', resetUrl);
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
    
    console.log('Reset password request received:', { userId, token: token ? 'token-present' : 'missing-token' });
    
    if (!token || !userId || !newPassword) {
      console.log('Missing required fields for password reset');
      return res.status(400).json({ message: 'Token, user ID, and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found with ID:', userId);
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    try {
      console.log('Verifying token for user:', user.email);
      
      // Verify the token using the same secret used to sign it
      const secret = process.env.JWT_SECRET + user.password;
      const decoded = jwt.verify(token, secret);
      
      console.log('Token verified successfully. Updating password...');
      
      // Update the password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      
      // Save the user with the new password
      await user.save();
      
      console.log('Password updated successfully for user:', user.email);
      res.json({ message: 'Password has been reset successfully' });
      
    } catch (error) {
      console.error('Token verification failed:', {
        error: error.message,
        name: error.name,
        expiredAt: error.expiredAt
      });
      
      if (error.name === 'TokenExpiredError') {
        return res.status(400).json({ message: 'Reset token has expired. Please request a new password reset.' });
      }
      
      return res.status(400).json({ 
        message: 'Invalid or expired reset token',
        // In development, include more details
        ...(process.env.NODE_ENV !== 'production' && { 
          error: error.message,
          hint: 'Make sure the token was not used already and is not expired' 
        })
      });
    }
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error during password reset' });
  }
});

module.exports = router;