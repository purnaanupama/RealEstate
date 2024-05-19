const express = require('express');
const userController = require('../controllers/user.controller')

//using express create router
const router = express.Router();

router.get('/test',userController.test)

module.exports =  router;