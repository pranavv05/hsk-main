// backend/routes/vendor.routes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../config/cloudinary');
const { vendorDocStorage } = require('../config/cloudinary');
const Vendor = require('../models/vendor.model');
const auth = require('../middleware/auth.middleware');

const upload = multer({ storage: storage }).fields([
    { name: 'idProof', maxCount: 1 },
    { name: 'addressProof', maxCount: 1 },
    { name: 'photo', maxCount: 1 }
]);

// GET /api/vendors/profile - Get the logged-in vendor's profile
router.get('/profile', auth, async (req, res) => {
  try {
    const vendorProfile = await Vendor.findOne({ user: req.user.id }).populate('user', 'email');
    if (!vendorProfile) { return res.status(404).json({ message: 'Vendor profile not found for this user.' }); }
    
    const profileWithEmail = { ...vendorProfile.toObject(), email: vendorProfile.user ? vendorProfile.user.email : 'N/A' };
    res.json(profileWithEmail);
  } catch (err) {
    console.error("Error in GET /api/vendors/profile:", err.message);
    res.status(500).send('Server Error');
  }
});

// PUT /api/vendors/profile - Update the logged-in vendor's profile
router.put('/profile', auth, upload, async (req, res) => {
    try {
        const { fullName, phone, serviceType, experience, description } = req.body;
        const updateData = { fullName, phone, serviceType, experience, description };

        if (req.files) {
            if (req.files.idProof) updateData.idProofUrl = req.files.idProof[0].path;
            if (req.files.addressProof) updateData.addressProofUrl = req.files.addressProof[0].path;
            if (req.files.photo) updateData.photoUrl = req.files.photo[0].path;
        }

        const updatedVendorProfile = await Vendor.findOneAndUpdate(
            { user: req.user.id },
            { $set: updateData },
            { new: true, runValidators: true } // Return the updated document and run schema validation
        ).populate('user', 'email');

        if (!updatedVendorProfile) {
            return res.status(404).json({ message: 'Vendor profile not found.' });
        }
        
        const profileWithEmail = { ...updatedVendorProfile.toObject(), email: updatedVendorProfile.user ? updatedVendorProfile.user.email : 'N/A' };
        res.json(profileWithEmail);
    } catch(err) {
        console.error("Error in PUT /api/vendors/profile:", err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;