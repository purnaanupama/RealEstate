const User = require('../models/user.model');
const bcryptjs= require('bcryptjs');
const errorHandler = require('../utils/error');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

//config dotenv
dotenv.config();

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

exports.signin = async(req,res,next)=>{
   const {email,password}=req.body
   try{
   //check if email exist
   const validUser = await User.findOne({email}) //go to database and find if user exist with email we got from req.body
   if(!validUser) return next(errorHandler(404,'User not found !'));
   const validPassword = bcryptjs.compareSync(password,validUser.password);
   if(!validPassword) return next(errorHandler(401,'Wrong credentials !'))
  //if validations passed create web token
   const token = jwt.sign({id:validUser._id},process.env.JWT_SECRET);
   //store all data except password inside validUser
   const {__v,password:pass,...restOfData} = validUser._doc
  //store created token inside cookie
  res.cookie('access_token',token,{httpOnly:true})
  .status(200)
  .json(restOfData);
   }catch(error){
    next(error)
   }
}