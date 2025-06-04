const express = require('express')
const router = express.Router()

//importing the apis function from contoller
const apis = require('../controllers/job')
const { isPermitted } = require('../middlewares/isPermitted')

// Retrieve a list of all labs

router.get('/test', (req, res) => {
    res.send('job')
})

module.exports = router
