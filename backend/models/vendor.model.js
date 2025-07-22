// backend/models/vendor.model.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const vendorSchema = new Schema({
  // This creates a direct link to the User model.
  // It's the core of the relationship between a user and their vendor profile.
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  
  fullName: { type: String, required: true },
  phone: { type: String, default: '' },
  serviceType: { type: String, default: 'OTHER' },
  description: { type: String, default: '' },
  experience: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
  
  // These would be URLs to documents uploaded to a service like Cloudinary or S3
  idProofUrl: { type: String, default: '' },
  addressProofUrl: { type: String, default: '' },
  photoUrl: { type: String, default: '' },

  servicesCompleted: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
}, { timestamps: true });

const Vendor = mongoose.model('Vendor', vendorSchema);

module.exports = Vendor;