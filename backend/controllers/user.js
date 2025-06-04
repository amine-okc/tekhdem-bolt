const User = require('../models/User'); // Assuming your User model path
const Candidate = require('../models/Candidate'); // Assuming your CandidateProfile model path
const jwt =require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const axios = require('axios'); // For making HTTP requests to Google

// Standard Email/Password Login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: 'Email ou mot de passe incorrect' });
    }

    // If user signed up with Google, they might not have a password
    if (!user.password && user.googleId) {
        return res.status(400).json({ error: 'Ce compte utilise la connexion Google. Veuillez vous connecter avec Google.' });
    }
    if (!user.password) { // Should not happen if not a Google user, but good check
        return res.status(400).json({ error: 'Configuration de compte invalide. Pas de mot de passe défini.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Email ou mot de passe incorrect' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role }, // Added role to token payload
      process.env.TOKEN_SECRET_KEY,
      { expiresIn: '7d' }
    );

    // Fetch profile details to include in the response if needed, or keep it minimal
    // For consistency with Google login, you might want to fetch and include profile details here too.
    // For now, keeping it as per your original structure.
    const userResponse = {
      id: user._id,
      email: user.email,
      role: user.role,
      // You might want to add firstName, lastName here by fetching the associated CandidateProfile
      // e.g., const profile = await CandidateProfile.findOne({ userId: user._id });
      // firstName: profile ? profile.firstName : '',
      // lastName: profile ? profile.lastName : '',
    };

    res.status(200).json({
      token,
      user: userResponse
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Token Verification
const verifyToken = async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Token non fourni', valid: false });
    }

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: 'Utilisateur non trouvé pour ce token', valid: false });
    }
    
    // Optionally, you can send back some user info if the token is valid
    // For now, just confirming validity.
    res.json({ 
        valid: true, 
        user: { 
            id: user._id, 
            email: user.email, 
            role: user.role 
        } 
    });
  } catch (error) {
    console.error("Token verification error:", error.message);
    res.status(401).json({ error: 'Token invalide ou expiré', valid: false });
  }
};


// --- Google Sign-In/Registration ---

// // Helper function to create/update candidate profile from Google data
// const createOrUpdateCandidateProfileFromGoogle = async (userId, firstName, lastName, googleEmail) => {
//   try {
//     let profile = await Candidate.findOne({ userId });

//     if (profile) {
//       // Optionally update if Google provides newer info, though for login this might not be necessary
//       // For example, if a user changes their name on Google.
//       // profile.firstName = firstName || profile.firstName;
//       // profile.lastName = lastName || profile.lastName;
//       // await profile.save();
//     } else {
//       // Create new profile if it doesn't exist
//       profile = new Candidate({
//         userId,
//         firstName: firstName || '', 
//         lastName: lastName || '',  
//         email: googleEmail, // Store email in profile as well if your schema has it
//         // birthDate: null, // Birthdate is not provided by Google token info by default
//         // Other fields can be set to default or prompted later
//       });
//       await profile.save();
//     }
//     return profile;
//   } catch (error) {
//     console.error("Error creating/updating candidate profile from Google data:", error);
//     throw error; 
//   }
// };

// Main Google Sign-In/Registration handler
const signInWithGoogle = async (req, res) => {
  const { googleAccessToken } = req.body;

  if (!googleAccessToken) {
    res.status(400).json({ error: "Google access token is required." });
  }

  try {
    // 1. Verify the Google Access Token and get user info
    //    The tokeninfo endpoint is simple but consider using Google API client libraries for more robust verification.
    const googleResponse = await axios.get(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${googleAccessToken}`);
    
    const { email, sub: googleId, given_name: firstName, family_name: lastName, email_verified, picture } = googleResponse.data;

    if (!email_verified) { // Ensure the email from Google is verified
        return res.status(400).json({ error: "Google email not verified." });
    }
    if (!process.env.GOOGLE_CLIENT_ID || googleResponse.data.aud !== process.env.GOOGLE_CLIENT_ID) {
        // Critical check: Ensure the token was intended for your application
        console.error("Token audience mismatch or GOOGLE_CLIENT_ID not set.");
        // console.error(`Token AUD: ${googleResponse.data.aud}, Expected AUD: ${process.env.GOOGLE_CLIENT_ID}`);
        res.status(401).json({ error: "Invalid Google token audience." });
    }


    // 2. Check if user exists in your database by email
    let user = await User.findOne({ email });
    let isNewUser = false;

    if (user) {

      if (!user.googleId) {
        user.googleId = googleId;

        await user.save();
      } else if (user.googleId !== googleId) {

        return res.status(400).json({ error: "This email is associated with a different Google account."});
      }
    } else {
      // User does not exist, create a new user
      return res.status(400).json({ error: "No user found with this email. Please sign up first." });
    }

    // 3. Create or update candidate profile
  //  const profile = await createOrUpdateCandidateProfileFromGoogle(user._id, firstName, lastName, email);
    const profile = await Candidate.findOne(
        {user_id : user._id, }
    );
    // 4. Generate JWT token
    const token = jwt.sign(
        { userId: user._id, role: user.role }, // Consistent payload
        process.env.TOKEN_SECRET_KEY, 
        { expiresIn: "7d" } // Consistent expiration
    );

    // 5. Return token and user info
    //    Structure the user response consistently with email/password login
    const userResponse = {
      id: user._id,
      email: user.email,
      role: user.role,
      firstName: profile.firstName,
      lastName: profile.lastName,
      birthDate: profile.birthDate, // Will be null/undefined if new from Google & not in profile schema
      // profilePictureUrl: user.profilePictureUrl || profile.profilePictureUrl, // Send profile picture if available
    };
    
    const message = isNewUser ? "User registered and signed in with Google successfully." : "User signed in with Google successfully.";

    res.status(isNewUser ? 201 : 200).json({
      message,
      token,
      user: userResponse
    });

  } catch (err) {
    console.error("Google Sign-In Server Error : ", err.response ? err.response.data : err.message);
    if (err.isAxiosError && err.response && err.response.data) {
        const googleError = err.response.data.error;
        if (googleError === "invalid_token" || googleError === "invalid_grant") {
            return res.status(401).json({ error: "Invalid or expired Google access token." });
        }
    }
    res.status(500).json({ error: "Server error during Google sign-in." });
  }
};


module.exports = {
  loginUser,
  verifyToken,
  signInWithGoogle // Added Google Sign-In to exports
};

/*
Reminder for User model (e.g., Mongoose schema):
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: function() { return !this.googleId; } }, // Required only if not a Google sign-in
  role: { type: String, enum: ['candidate', 'recruiter', 'admin'], default: 'candidate' },
  googleId: { type: String, unique: true, sparse: true }, // sparse allows multiple nulls (for non-Google users)
  // profilePictureUrl: { type: String }, // Optional: if you want to store Google's profile picture
  // ... other fields like firstName, lastName if you don't use a separate Profile model for these
}, { timestamps: true });

Reminder for CandidateProfile model (example):
const candidateProfileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    email: { type: String, trim: true }, // Can be redundant if User model has it, but sometimes useful
    birthDate: { type: Date },
    // ... other profile fields
}, { timestamps: true });

Ensure your .env file has:
TOKEN_SECRET_KEY=your_very_strong_secret_key
GOOGLE_CLIENT_ID=your_google_cloud_project_oauth_client_id 
  (This is the Web Client ID from Google Cloud Console, needed for token audience validation)
*/
