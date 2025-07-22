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
    const { name, email, password, role, address } = req.body; // Added address for the new feature

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    user = new User({ name, email, password, role, address }); // Added address
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


// ... (keep your password reset routes) ...

module.exports = router;