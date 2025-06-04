const express = require('express')
const router = express.Router()

//importing the apis function from contoller
const apis = require('../controllers/location')
const { isPermitted } = require('../middlewares/isPermitted')

// Retrieve a list of all labs

router.get('/test', (req, res) => {
    res.send('location')
})


router.get('/get-wilayas', apis.autocompleteWilayas)
router.get('/get-communes', apis.autocompleteCommunes)
router.get('/get-communes-of-wilaya', apis.getCommunesOfWilaya)

module.exports = router
