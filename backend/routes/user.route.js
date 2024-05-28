const express = require('express');
const userController = require('../controllers/user.controller');
const { verifyToken } = require('../utils/verifyUser');

//using express create router
const router = express.Router();

router.get('/test',userController.test)
router.post('/update/:id',verifyToken,userController.updateUser)

module.exports =  router;