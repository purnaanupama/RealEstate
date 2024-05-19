const User = require('../models/user.model');
const bcryptjs= require('bcryptjs');

exports.register = async(req,res)=>{
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
     res.status(500).json(error);
  }
}