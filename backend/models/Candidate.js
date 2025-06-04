const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  birth_date: { type: Date },
  steps: {
    type: Map,
    of: {
      type: Boolean,
      default: false,
    },
    default: {
      personal_info: false,
      experiences: false,
      education: false,
      languages: false,
      skills: false,
      cv_upload: false,
    },
  },
  is_profile_complete: { type: Boolean, default: false },
  profile_picture: String,
  phone_number: String,
  address: {
    line1: String,
    line2: String,
    zip_code: String,
    city: String,
    country: String,
  },
  cv_url: { type: String },
  experiences: [
    {
      title: String,
      company: String,
      start_date: Date,
      end_date: Date, // peut être null
      is_current: { type: Boolean, default: false },
      description: String,
    },
  ],
  education: [
    {
      institution: String,
      degree: String,
      field: String,
      start_date: Date,
      end_date: Date, // peut être null
      is_current: { type: Boolean, default: false },
    },
  ],
  languages: [
    {
      language: String,
      level: String,
    },
  ],
  skills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Candidate", candidateSchema);
