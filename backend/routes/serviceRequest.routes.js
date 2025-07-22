// backend/routes/serviceRequest.routes.js
const express = require('express');
const router = express.Router();
const ServiceRequest = require('../models/serviceRequest.model');
const User = require('../models/user.model');
const Vendor = require('../models/vendor.model');
const auth = require('../middleware/auth.middleware');

// --- POST /api/requests - USER creates a new service request ---
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, serviceType } = req.body;
    const user = await User.findById(req.user.id);
    const newRequest = new ServiceRequest({ title, description, serviceType, user: req.user.id });
    const savedRequest = await newRequest.save();
    const responseRequest = savedRequest.toObject();
    responseRequest.userName = user.name;
    res.status(201).json(responseRequest);
  } catch (err) {
    console.error("Error in POST /api/requests:", err.message);
    res.status(500).send('Server Error');
  }
});

// --- GET /api/requests - USER gets their own service requests ---
router.get('/', auth, async (req, res) => {
  try {
    const requests = await ServiceRequest.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    console.error("Error in GET /api/requests:", err.message);
    res.status(500).send('Server Error');
  }
});

// --- PATCH /api/requests/:id/cancel - USER cancels their service request ---
router.patch('/:id/cancel', auth, async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id);
    if (!request) { return res.status(404).json({ message: 'Service request not found' }); }
    if (request.user.toString() !== req.user.id) { return res.status(403).json({ message: 'User not authorized' }); }
    if (request.status === 'COMPLETED') { return res.status(400).json({ message: 'Cannot cancel a completed request' }); }
    request.status = 'CANCELLED';
    await request.save();
    res.json(request);
  } catch (err) {
    console.error("Error in PATCH /:id/cancel:", err.message);
    res.status(500).send('Server Error');
  }
});

// --- GET /api/requests/vendor - VENDOR gets requests relevant to them ---
router.get('/vendor', auth, async (req, res) => {
    try {
        const vendorProfile = await Vendor.findOne({ user: req.user.id });
        if (!vendorProfile) { return res.status(404).json({ message: 'Vendor profile not found.' }); }

        const requests = await ServiceRequest.find({
            $or: [
                { status: 'PENDING', serviceType: vendorProfile.serviceType },
                { vendor: req.user.id }
            ]
        }).populate('user', 'name email').sort({ createdAt: -1 });

        const formattedRequests = requests.map(req => ({
            ...req.toObject(),
            userName: req.user ? req.user.name : 'N/A',
            userContact: req.user ? req.user.email : 'N/A',
        }));
        res.json(formattedRequests);
    } catch (err) {
        console.error("Error in GET /api/requests/vendor:", err.message);
        res.status(500).send('Server Error');
    }
});

// --- PATCH /api/requests/:id/accept - VENDOR accepts a service request ---
router.patch('/:id/accept', auth, async (req, res) => {
    try {
        const request = await ServiceRequest.findById(req.params.id);
        if (!request) { return res.status(404).json({ message: 'Request not found.' }); }
        request.vendor = req.user.id;
        request.status = 'IN_PROGRESS';
        await request.save();
        res.json(request);
    } catch (err) {
        console.error("Error in PATCH /:id/accept:", err.message);
        res.status(500).send('Server Error');
    }
});

// --- PATCH /api/requests/:id/complete - VENDOR completes a service request ---
router.patch('/:id/complete', auth, async (req, res) => {
    try {
        const request = await ServiceRequest.findByIdAndUpdate(req.params.id, { status: 'COMPLETED' }, { new: true });
        if (!request) { return res.status(404).json({ message: 'Request not found.' }); }
        await Vendor.findOneAndUpdate({ user: req.user.id }, { $inc: { servicesCompleted: 1 } });
        res.json(request);
    } catch (err) {
        console.error("Error in PATCH /:id/complete:", err.message);
        res.status(500).send('Server Error');
    }
});

// --- GET /api/requests/all - ADMIN gets all service requests ---
router.get('/all', auth, (req, res, next) => {
    if (req.user.role !== 'admin') { return res.status(403).json({ message: 'Forbidden: Admin access required.' }); }
    next();
}, async (req, res) => {
    try {
        const allRequests = await ServiceRequest.find()
            .populate('user', 'name')
            .populate('vendor', 'name')
            .sort({ createdAt: -1 })
            .lean(); // Use .lean() for faster, plain JavaScript objects
        return res.json(allRequests);
    } catch (err) {
        console.error("Error in GET /api/requests/all:", err.message);
        return res.status(500).send('Server Error');
    }
});

module.exports = router;