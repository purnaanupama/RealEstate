const express = require('express');
const userController = require('../controllers/user.controller');
const { verifyToken } = require('../utils/verifyUser');

//using express create router
const router = express.Router();

router.post('/resend-otp',userController.resendOTP)
router.post('/update/:id',verifyToken,userController.updateUser)
router.delete('/delete/:id',verifyToken,userController.deleteUser)
router.patch('/updateEmail',verifyToken,userController.updateEmail)

module.exports =  router;