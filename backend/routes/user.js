const express = require('express');
const router = express.Router();
const { loginUser, verifyToken, signInWithGoogle } = require('../controllers/user');
const auth = require('../middlewares/auth');

router.post('/login', loginUser);
router.post('/auth/google-signin', signInWithGoogle);
router.get('/verify-token', auth, verifyToken);

module.exports = router;