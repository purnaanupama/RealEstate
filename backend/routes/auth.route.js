const express = require('express');
const authController = require('../controllers/auth.controller')
//const uppercaseUsername = require('../middlewares/auth.middleware');

const router = express.Router();

router.post("/signup",authController.register);
router.post("/signin",authController.signin);
router.get('/signout',authController.signout);
router.post('/give-password',authController.givePassword);
router.post('/google',authController.google);
router.patch('/account-verify',authController.accountVerify);
router.post('/reset-password',authController.handleReset);
//router.post("/signup",uppercaseUsername,authController.register);

module.exports =  router;