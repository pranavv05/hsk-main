const mongoose = require('mongoose');
const { Schema } = mongoose;

const teamMemberSchema = new Schema({
    name: { type: String, required: true },
    role: { type: String, required: true },
    image: { type: String },
    bio: { type: String },
});

const TeamMember = mongoose.model('TeamMember', teamMemberSchema);
module.exports = TeamMember;