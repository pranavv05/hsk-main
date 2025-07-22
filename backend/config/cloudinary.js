// backend/config/cloudinary.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'hindu_seva_kendra',
        resource_type: 'auto',
        // --- THIS IS THE CRITICAL LINE ---
        // It tells Cloudinary to use the new rules we just created.
        upload_preset: 'hsk_unsigned_uploads' 
    }
});

module.exports = {
    cloudinary,
    storage
};