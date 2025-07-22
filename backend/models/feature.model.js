const mongoose = require('mongoose');
const { Schema } = mongoose;

const featureSchema = new Schema({
    icon: { type: String },
    title: { type: String, required: true },
    description: { type: String, required: true },
});

const Feature = mongoose.model('Feature', featureSchema);
module.exports = Feature;