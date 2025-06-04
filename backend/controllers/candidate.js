const Candidate = require("../models/Candidate");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Étape 1 : Inscription du candidat
const registerCandidateStep1 = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "Email already in use" });

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
      req.body.lastName,
      req.body.birthDate
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

module.exports = {
  registerCandidateStep1,
  registerCandidateStep2,
};
