const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

// Exemple d'authentification pour les administrateurs
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ error: 'Invalid email or password' });

    // Ajouter ta logique pour vérifier le mot de passe (par exemple, bcrypt)
    const token = jwt.sign(
      { adminId: admin._id },
      process.env.TOKEN_SECRET_KEY,
      { expiresIn: '7d' }
    );
    
    return res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  loginAdmin,
};
