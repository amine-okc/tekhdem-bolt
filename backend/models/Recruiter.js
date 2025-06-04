const mongoose = require('mongoose');

const recruiterSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  company_name: { type: String, required: true },
  profile_picture: String,
  description: String,
  address: {
    line1: String,
    line2: String,
    zip_code: String,
    city: String,
    country: String,
    coordinates: [Number] // [lat, lng]
  },
  sector: { type: mongoose.Schema.Types.ObjectId, ref: 'Sector', required: true },
  website: String,
  phone_number: String,
  social_links: {
    linkedin: String,
    facebook: String,
    twitter: String
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Recruiter', recruiterSchema);
