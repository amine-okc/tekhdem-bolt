const Recruiter = require('../models/Recruiter');
const User = require('../models/User');

// Étape 1 : Inscription du recruteur
const registerRecruiterStep1 = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email already in use' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      password: hashedPassword,
      role: 'recruiter'
    });
    await user.save();

    return res.status(201).json({ message: 'Step 1 completed, proceed to step 2', userId: user._id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// Étape 2 : Ajouter des informations spécifiques pour le recruteur
const registerRecruiterStep2 = async (req, res) => {
  try {
    const { userId, specificData } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { companyName, sector } = specificData;
    const profile = new Recruiter({
      user_id: user._id,
      companyName,
      sector
    });

    await profile.save();
    return res.status(201).json({ message: 'Registration completed successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  registerRecruiterStep1,
  registerRecruiterStep2,
};
