const mongoose = require('mongoose');
const { Schema } = mongoose;

const testimonialSchema = new Schema({
    name: { type: String, required: true },
    role: { type: String },
    content: { type: String, required: true },
    image: { type: String },
    rating: { type: Number, required: true },
});

const Testimonial = mongoose.model('Testimonial', testimonialSchema);
module.exports = Testimonial;