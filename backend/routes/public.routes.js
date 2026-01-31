// backend/routes/public.routes.js
const express = require('express');
const router = express.Router();

// Load the models we need
const Service = require('../models/service.model');
const Testimonial = require('../models/testimonial.model');
const Feature = require('../models/feature.model');
const TeamMember = require('../models/teamMember.model');
const Value = require('../models/value.model');

// --- GET /api/public/services ---
router.get('/services', async (req, res) => {
    try {
        // Fetch pre-defined services from the database
        const predefinedServices = await Service.find();

        // Fetch all unique service types that registered vendors have used
        // We need to require the Vendor model here if not already loaded, but it's best to load it at top.
        // Assuming strictness, let's just use mongoose.model('Vendor') or require it.
        const Vendor = require('../models/vendor.model');
        const vendorServices = await Vendor.distinct('serviceType');

        const existingNames = new Set(predefinedServices.map(s => s.name));

        // Filter out 'OTHER' and any that already exist in the predefined list
        const customServices = vendorServices
            .filter(type => type && type !== 'OTHER' && !existingNames.has(type))
            .map((type, index) => ({
                _id: `custom-${index}`,
                name: type,
                icon: '' // No icon for custom services
            }));

        const allServices = [...predefinedServices, ...customServices];
        res.json(allServices);
    } catch (err) {
        console.error("Error fetching services:", err);
        res.status(500).send('Server Error');
    }
});

// --- GET /api/public/testimonials ---
router.get('/testimonials', async (req, res) => {
    try {
        const testimonials = await Testimonial.find().limit(5); // Get up to 5 testimonials
        res.json(testimonials);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// --- GET /api/public/features ---
router.get('/features', async (req, res) => {
    try {
        const features = await Feature.find().limit(3); // Get up to 3 features
        res.json(features);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// --- GET /api/public/about --- (For the About Us page)
router.get('/about', async (req, res) => {
    try {
        const [teamMembers, values] = await Promise.all([
            TeamMember.find(),
            Value.find()
        ]);
        res.json({ teamMembers, values });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});
router.post('/contact', async (req, res) => {
    try {
        const { fullName, email, message } = req.body;
        console.log('--- New Contact Form Submission ---');
        console.log(`From: ${fullName} <${email}>`);
        console.log(`Message: ${message}`);
        // In a real app, you would add logic here to send an email.
        res.status(200).json({ success: true, message: 'Message sent successfully!' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});
module.exports = router;