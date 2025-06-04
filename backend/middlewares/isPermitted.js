const User = require('../models/User');
const Candidate = require('../models/Candidate');
const Admin = require('../models/Admin');
const Recruiter = require('../models/Recruiter');
const jwt = require('jsonwebtoken');

function isPermitted(...roles) {
  return async function (req, res, next) {
    let token = req.header('Authorization');
    if (!token) {
      return res.status(401).json({ message: 'Authorization token missing' });
    }

    token = token.split(' ')[1];

    jwt.verify(token, process.env.TOKEN_SECRET_KEY, async (err, decoded) => {
      if (err) {
        console.log(err);
        return res.status(403).json({ error: 'Token expired or invalid' });
      }

      const { userId } = decoded;
      const user = await User.findById(userId);

      if (!user || !roles.includes(user.role)) {
        return res.status(403).json({ error: 'Unauthorized or user not found' });
      }

      // Charger les infos spécifiques selon le rôle
      let profile = null;
      switch (user.role) {
        case 'admin':
          profile = await Admin.findOne({ user_id: user._id });
          break;
        case 'recruiter':
          profile = await Recruiter.findOne({ user_id: user._id });
          break;
        case 'candidate':
          profile = await Candidate.findOne({ user_id: user._id });
          break;
      }

      if (!profile) {
        return res.status(403).json({ error: 'Profile not found' });
      }

      // On ajoute l'utilisateur et son profil à req
      req.user = user;
      req.profile = profile;
      next();
    });
  };
}

module.exports = { isPermitted };
