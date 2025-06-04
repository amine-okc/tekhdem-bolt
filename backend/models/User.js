const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: function () {
      // password is required only if googleId is not present
      return !this.googleId;
    }
  },
  reset_token: { type: String },
  googleId: { type: String, unique: true }, // For Google sign-in
  role: { type: String, enum: ['superadmin', 'admin', 'recruiter', 'candidate'], required: true },
  is_active: { type: Boolean, default: false },
  is_email_verified: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});
module.exports = mongoose.model('User', userSchema);