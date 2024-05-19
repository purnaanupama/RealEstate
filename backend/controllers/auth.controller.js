const User = require('../models/user.model');
const bcryptjs= require('bcryptjs');
const errorHandler = require('../utils/error')

exports.register = async(req,res,next)=>{
  const {username,email,password,role} = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({username, email, password : hashedPassword})
  try{
    await newUser.save();
    res.status(201)
    .json({
      status : 'success',
      data : req.body
    })
  }catch(error){
     next(error)
  }
};