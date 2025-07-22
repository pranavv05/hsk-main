// backend/models/user.model.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // --- All fields go inside this one object ---
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['user', 'vendor', 'admin'], default: 'user' },
  profileImage: { type: String },
  address: {type: String},
  
  // Fields for password reset functionality
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Date },

}, { timestamps: true }); // <-- The options object is the second argument

// This function runs before a user is saved to the database
// It hashes the password if it has been modified
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;