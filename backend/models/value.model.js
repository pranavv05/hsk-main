const mongoose = require('mongoose');
const { Schema } = mongoose;

const valueSchema = new Schema({
    icon: { type: String },
    title: { type: String, required: true },
    description: { type: String, required: true },
});

const Value = mongoose.model('Value', valueSchema);
module.exports = Value;