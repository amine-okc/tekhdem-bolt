const express = require('express');
const router = express.Router();
const { loginUser, verifyToken } = require('../controllers/user');
const auth = require('../middlewares/auth');

router.post('/login', loginUser);
router.get('/verify-token', auth, verifyToken);

module.exports = router;