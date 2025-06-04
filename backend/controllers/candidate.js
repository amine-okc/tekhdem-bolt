const Candidate = require("../models/Candidate");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");

// Étape 1 : Inscription du candidat
const registerCandidateStep1 = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (existingUser.googleId) {
        return res.status(400).json({
          error: "Cet email est déjà utilisé via un compte Google. Veuillez vous connecter avec Google.",
        });
      } else {
        return res.status(400).json({
          error: "Email déjà utilisé",
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      password: hashedPassword,
      role: "candidate",
    });
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET_KEY, {
      expiresIn: "1h",
    });
    console.log(token);
    const profile = await registerCandidateStep2(
      user._id,
      req.body.firstName,
      req.body.lastName
    );
    return res.status(201).json({
      message: "Step 1 completed, proceed to step 2",
      token,
      user: { ...profile._doc, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

// Étape 2 : Ajouter des informations spécifiques pour le candidat
const registerCandidateStep2 = async (
  user_id,
  first_name,
  last_name,
  birth_date
) => {
  try {
    const user = await User.findById(user_id);
    if (!user || user.role !== "candidate")
      return res.status(404).json({ error: "User not found" });

    const profile = new Candidate({
      user_id,
      first_name,
      last_name,
      birth_date,
    });

    await profile.save();
    return profile;
  } catch (err) {
    console.error(err);
  }
};

const createOrUpdateCandidateProfileFromGoogle = async (userId, firstName, lastName, googleEmail) => {
  try {
    let profile = await Candidate.findOne({ userId });

    if (profile) {
      // Optionally update if needed, though for login this might not be necessary
      // profile.firstName = firstName || profile.firstName;
      // profile.lastName = lastName || profile.lastName;
      // await profile.save();
    } else {
      // Create new profile
      profile = new Candidate({
        user_id: userId,
        first_name: firstName || '', // Use Google's first name, or empty if not provided
        last_name: lastName || '',  // Use Google's last name, or empty if not provided
        // Other fields can be set to default or prompted later
      });
      await profile.save();
    }
    return profile;
  } catch (error) {
    console.error("Error creating/updating candidate profile from Google data",);
    throw error; // Re-throw to be caught by the main handler
  }
};

const signInWithGoogle = async (req, res) => {
  const { googleAccessToken } = req.body;

  if (!googleAccessToken) {
    return res.status(400).json({ error: "Google access token is required." });
  }

  try {
    // 1. Verify the Google Access Token and get user info
    const googleResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${googleAccessToken}`
      }
    });

    console.log("Google Response:", googleResponse.data);
    
    const { email, sub: googleId, given_name: firstName, family_name: lastName, email_verified } = googleResponse.data;

    if (!email_verified) {
        return res.status(400).json({ error: "Google email not verified." });
    }

    // 2. Check if user exists in your database
    let user = await User.findOne({ email });

    if (user) {

      return res.status(400).json({ error: "User already exists with this email." });
      
    } else {

      user = new User({
        email,
        googleId, // Store Google's unique ID for this user
        role: "candidate", // Default role

      });
      await user.save();
    }

    // 3. Create or update candidate profile (similar to your step 2)
    //    We use firstName and lastName from Google.
    const profile = await createOrUpdateCandidateProfileFromGoogle(user._id, firstName, lastName, email);

    // 4. Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.TOKEN_SECRET_KEY, {
      expiresIn: "1h", // Or your preferred expiration
    });

    // 5. Return token and user info
    return res.status(200).json({
      message: user.googleId && !user.password ? "User signed in/registered with Google successfully." : "User signed in successfully.",
      token,
      user: {
        id: user._id, // Send user ID
        email: user.email,
        role: user.role,
        firstName: profile.firstName,
        lastName: profile.lastName,
        // Include other relevant profile fields from profile._doc if needed
      }
    });

  } catch (err) {
    console.error("Google Sign-In Error:", err.response ? err.response.data : err.message);
    if (err.response && err.response.data && err.response.data.error === "invalid_token") {
        return res.status(401).json({ error: "Invalid Google access token." });
    }
    return res.status(500).json({ error: "Server error during Google sign-in." });
  }
};

module.exports = {
  registerCandidateStep1,
  registerCandidateStep2,
  signInWithGoogle
};
