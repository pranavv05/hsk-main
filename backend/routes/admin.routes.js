// backend/routes/admin.routes.js
const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const Vendor = require('../models/vendor.model');
const ServiceRequest = require('../models/serviceRequest.model');
const auth = require('../middleware/auth.middleware');

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    return res.status(403).json({ message: 'Forbidden: Access is restricted to administrators.' });
};

router.get('/stats', auth, isAdmin, async (req, res) => {
    console.log('--- ENTERED /api/admin/stats ---');
    try {
        const totalUsers = await User.countDocuments({ role: 'user' });
        console.log(`Found ${totalUsers} users.`);
        const totalVendors = await Vendor.countDocuments();
        console.log(`Found ${totalVendors} vendors.`);
        const totalRequests = await ServiceRequest.countDocuments();
        const pendingRequests = await ServiceRequest.countDocuments({ status: 'PENDING' });
        const completedRequests = await ServiceRequest.countDocuments({ status: 'COMPLETED' });
        
        const stats = { totalUsers, totalVendors, totalRequests, pendingRequests, completedRequests };
        console.log('--- SUCCESS /api/admin/stats ---');
        return res.json(stats);
    } catch (err) {
        console.error('--- ERROR in /api/admin/stats ---:', err.message);
        return res.status(500).send('Server Error');
    }
});

router.get('/vendors', auth, isAdmin, async (req, res) => {
    console.log('--- ENTERED /api/admin/vendors ---');
    try {
        const vendors = await Vendor.find().populate('user', 'email').lean();
        console.log(`Found ${vendors.length} vendors.`);
        console.log('--- SUCCESS /api/admin/vendors ---');
        return res.json(vendors);
    } catch (err) {
        console.error('--- ERROR in /api/admin/vendors ---:', err.message);
        return res.status(500).send('Server Error');
    }
});

router.patch('/vendors/:id/verify', auth, isAdmin, async (req, res) => {
    console.log(`--- ENTERED /api/admin/vendors/${req.params.id}/verify ---`);
    try {
        const { isVerified } = req.body;
        const updatedVendor = await Vendor.findByIdAndUpdate(req.params.id, { isVerified }, { new: true });
        if (!updatedVendor) { return res.status(404).json({ message: 'Vendor not found.' }); }
        console.log('--- SUCCESS /api/admin/vendors/verify ---');
        return res.json(updatedVendor);
    } catch (err) {
        console.error('--- ERROR in /api/admin/vendors/verify ---:', err.message);
        return res.status(500).send('Server Error');
    }
});

router.patch('/requests/:id/assign', auth, isAdmin, async (req, res) => {
    console.log(`--- ENTERED /api/admin/requests/${req.params.id}/assign ---`);
    try {
        const { vendorId } = req.body;
        const vendorProfile = await Vendor.findById(vendorId);
        if (!vendorProfile) { return res.status(404).json({ message: 'Vendor profile not found.' }); }
        
        const userIdForVendor = vendorProfile.user;
        const updatedRequest = await ServiceRequest.findByIdAndUpdate(
            req.params.id,
            { vendor: userIdForVendor, status: 'ASSIGNED' },
            { new: true }
        );
        if (!updatedRequest) { return res.status(404).json({ message: 'Service request not found.' }); }
        console.log('--- SUCCESS /api/admin/requests/assign ---');
        return res.json(updatedRequest);
    } catch (err) {
        console.error('--- ERROR in /api/admin/requests/assign ---:', err.message);
        return res.status(500).send('Server Error');
    }
});

module.exports = router;