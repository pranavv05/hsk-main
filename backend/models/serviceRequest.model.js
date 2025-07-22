// backend/models/serviceRequest.model.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const serviceRequestSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  serviceType: { type: String, required: true },
  status: {
    type: String,
    enum: ['PENDING', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
    default: 'PENDING',
  },
  // Link to the user who created the request
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  // Optional: Link to the vendor assigned to the request
  vendor: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const ServiceRequest = mongoose.model('ServiceRequest', serviceRequestSchema);

module.exports = ServiceRequest;