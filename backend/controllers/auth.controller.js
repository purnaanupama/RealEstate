const User = require('../models/user.model');
const bcryptjs= require('bcryptjs');
const errorHandler = require('../utils/error');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const speakeasy = require('speakeasy');
const sendEmail = require('../utils/sendEmail')
//config dotenv
dotenv.config();

//code to generate an OTP
const verifyOtp = function verifyOtp(token){
  let verified = speakeasy.totp.verifyDelta({
      secret: process.env.OTP_KEY,
      encoding: 'base32',
      token: token,
      step: 30,
      window: 4
  });
  return verified;
}

//code to verify an OTP sent through email
const generateOtp = function generateOtp() {
  let token = speakeasy.totp({
      secret: process.env.OTP_KEY,
      encoding: 'base32',
      digits: 6,
      step: 30,
      window: 4
  });
  return token;
}

exports.accountVerify = async (req, res, next) => {
  const { otp } = req.body;
  // Verify the OTP token
  const isValid = verifyOtp(otp);
  if (isValid) {
      // Find the user by OTP code
      const user = await User.findOne({ otp_code: otp });
      if (user) {
          // Mark the user as verified
          user.verified_user = true;
          user.otp_code = null;
          await user.save();
          res.status(200).json({ 
              status: 'success', 
              message: 'User verified successfully' 
          });
          }else {
          res.status(400).json({ 
              status: 'fail', 
              message: 'Invalid OTP' 
          });
          }
  } else {
      res.status(400).json({ 
          status: 'fail', 
          message: 'Invalid OTP' 
      });
  }
};


exports.register = async (req, res, next) => {
  //object destructuring
  const { username, email, password, role } = req.body;
  //generate temp secret
  const otp = generateOtp();
  //check if the user is existing without a verification
  const existingUser = await User.findOne({email});
  
  //sending email to reset the password
  if(existingUser && existingUser.verified_user){
    const result =  await sendEmail.sendEmail(email,otp)
    if(result==='success'){
    res.status(200).json({
      status:'success',
    });
    existingUser.otp_code = otp
    await existingUser.save();
    return;
    }else{
    return next(errorHandler(500,'Email not sent !'));
    }
  }
  
  //sending email to verify account if the user exist in the database with unverified email
  if( existingUser && !existingUser.verified_user){
  const result = await sendEmail.sendEmail(email,otp)
  if(result==='success'){
    console.log("email sent to " + email);
    // Mark the user as verified
      existingUser.otp_code = otp;
      await  existingUser.save();
    // Send success response after email sending is completed
      res.status(201).json({
        status: 'success',
        otp:otp
    }); 
    return;  
  }else{
    return console.log("email not sent !");
  }
  }

  //sending email to verify account if the user do not exist in the database and creating the new user
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword, otp_code: otp });
  try {
      await newUser.save();
      const result = await sendEmail.sendEmail(email,otp)
        if(result==='success'){
        console.log("email sent to " + email); 
        res.status(201).json({
          status: 'success',
          data: req.body,
          otp:otp
        });   
        } }
 catch(error){ 
      next(error);
  }
 };

exports.signin = async(req,res,next)=>{
   const {email,password}=req.body
   try{
   //check if email exist
   const validUser = await User.findOne({email}) //go to database and find if user exist with email we got from req.body
   //If any field is empty 
   if(!email || !password) return next(errorHandler(400,'All fields are required !'))
   //If user not verified or does not exist
   if(!validUser || !validUser.verified_user) return next(errorHandler(404,'User not found !'));
   const validPassword = bcryptjs.compareSync(password,validUser.password);
   //If user provide wrong credentials
   if(!validPassword) return next(errorHandler(401,'Wrong credentials !'))
  
  //if validations passed create web token
   const token = jwt.sign({id:validUser._id},process.env.JWT_SECRET,{
    expiresIn:'1d'
   });
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

exports.givePassword = async (req, res, next) => {
  const { data, email, currentEmail } = req.body;
  //handle reset password 
  if(currentEmail==='reset'){
    const user = await User.findOne({ email: email });
    try{
      if(!data.enter_password || !data.confirm_password){
        return res.status(400).json({
          status: 'fail',
          message: 'All fields are required',
        });
      }
      if(!user) {
        return res.status(404).json({
          status: 'fail',
          message: 'User not found',
        });
      }
      if(data.enter_password !== data.confirm_password) {
          return res.status(400).json({
            status: 'fail',
            message: 'Passwords do not match',
          });
        }
    const hashedPassword = bcryptjs.hashSync(data.confirm_password, 10); 
    user.password = hashedPassword;
    await user.save();
    // Exclude sensitive data from the response
    const { __v, password, ...restOfData } = user._doc;
    res.status(200).json({
      status:'success',
      data: restOfData,
    });
    }catch(error){
    console.error('Error updating user password:', error);
      res.status(500).json({
      status: 'error',
      message: 'An error occurred while updating the password. Please try again later.',
    });
    next(error);
    }
    return;
  }
 
  //handle email update in normal accounts
  try {
    const user = await User.findOne({ email: currentEmail });
    if(!data.enter_password || !data.confirm_password){
      return res.status(400).json({
        status: 'fail',
        message: 'All fields are required',
      });
    }
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found',
      });
    }
    if(data.enter_password !== data.confirm_password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Passwords do not match',
      });
    }
    const hashedPassword = bcryptjs.hashSync(data.confirm_password, 10);
    user.email = email;
    user.password = hashedPassword;
    user.verified_user = true;
    user.type = 'normal';
    await user.save();
    // Exclude sensitive data from the response
    const { __v, password, ...restOfData } = user._doc;
    res.status(200).json({
      status:'success',
      data: restOfData,
    });
  } catch (error) {
    console.error('Error updating user password:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while updating the password. Please try again later.',
    });
    next(error);
  }  }

exports.google = async(req,res,next)=>{
  try {
    const user = await User.findOne({email:req.body.email})
    if(user){
    //if the user exist then sign in the user
    const token = jwt.sign({id:user._id},process.env.JWT_SECRET);
    const {__v,password:pass,...restOfData} = user._doc;
    res.cookie('access_token', token, { httpOnly: true })
    .status(200)
    .json({
    ...restOfData,
    method: true
  });
    }else{
    //if user does not exist then create the user
    //1.generate a password for user as google auth dont give passwords
    const generatedPassword = Math.random().toString(36).slice(-8);
    //2.Hash the password
    const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
    //3.save new user to database
    const newUser = new User({username:req.body.name.split(" ").join("").toLowerCase()+Math.random().toString(36).slice(-4), email:req.body.email, password : hashedPassword, avatar: req.body.photo,type: 'google'})
    await newUser.save();
    const token = jwt.sign({id:newUser._id},process.env.JWT_SECRET,{
      expiresIn:'1d'
    });
    const {__v,password:pass,...restOfData} = newUser._doc;
    res.cookie('access_token',token,{httpOnly:true})
    .status(200)
    .json({
      ...restOfData,
      method: false
    });


    }
  } catch (error) {
    next(error)
    console.log(error);
  } }

exports.signout=(req,res,next)=>{
  try{
    res.clearCookie('access_token');
    res.status(200).json('User has been logged out !')
  }catch(error){
    next(error)
  }
}

exports.handleReset=async(req,res,next)=>{
  const {email,password} = req.body;
  if(!email || !password) return next(errorHandler(400,'Enter the email and password !'))
  const user = await User.findOne({email})
  try {
    if(user){
    const otp = generateOtp();
    const result = await sendEmail.sendEmail(email,otp)
      if(result==='success'){
      res.status(200).json({
        status:'success',
      });
      user.otp_code = otp
      await user.save();
      return
      }else{
      return next(errorHandler(500,'Email not sent !'))
      }
    }else{
      return next(errorHandler(400,'User with this email does not exist !'))
    }
  } catch (error) {
    
  }
}