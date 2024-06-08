const express = require('express');
const listingController = require('../controllers/listing.controller')
const { verifyToken } = require('../utils/verifyUser');
const router = express.Router();

router.post('/create',verifyToken,listingController.createListing);

module.exports =  router;