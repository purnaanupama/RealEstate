const express = require('express');
const listingController = require('../controllers/listing.controller')
const { verifyToken } = require('../utils/verifyUser');
const router = express.Router();

router.post('/create',verifyToken,listingController.createListing);
router.delete('/delete/:id',verifyToken,listingController.deleteListing);
router.post('/update/:id',verifyToken,listingController.updateListing);
router.get('/get/:id',listingController.getListing);

module.exports =  router;