const express = require('express')
const router = express.Router()

//importing the apis function from contoller
const apis = require('../controllers/candidate')
const { isPermitted } = require('../middlewares/isPermitted')

// Retrieve a list of all labs

router.get('/test', (req, res) => {
    res.send('Candidate')
})

router.post('/register', apis.registerCandidateStep1)
router.post('/register/step2', apis.registerCandidateStep2)
router.post('/auth/google-signin', apis.signInWithGoogle)

module.exports = router
