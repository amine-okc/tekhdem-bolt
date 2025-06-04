const express = require('express')
const router = express.Router()

//importing the apis function from contoller
const apis = require('../controllers/admin')
const { isPermitted } = require('../middlewares/isPermitted')

// Retrieve a list of all labs

router.get('/test', (req, res) => {
    res.send('Admin')
})

module.exports = router
