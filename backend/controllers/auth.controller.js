const User = require('../models/user.model');
const bcryptjs= require('bcryptjs');
const errorHandler = require('../utils/error');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');

//config dotenv
dotenv.config();
exports.accountVerify = async(req,res,next)=>{
   const {otp} = req.body;
   const user = await User.findOne({otp_code:otp});
   if(user){
    user.verified_user = true;
    user.otp_code = null; 
    await user.save();
    res.status(200).json({ 
      status: 'success', 
      message: 'User verified successfully' });
   }else{
    return res.status(400).json({ status: 'fail', 
                                  message: 'Invalid OTP' });
   }
}

exports.register = async (req, res, next) => {
  const { username, email, password, role } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const otp = Math.floor(1000 + Math.random() * 9000);
  const newUser = new User({ username, email, password: hashedPassword, otp_code: otp });
  try {
      await newUser.save();

      // Create a transporter using SMTP
      let transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 587,
          secure: false, // use TLS
          auth: {
              user: 'anupamahera2022@gmail.com',
              pass: 'ksfbiqywsbxnjwhm'
          },
          tls: {
              // do not fail on invalid certs
              rejectUnauthorized: false
          }
      });

      // Send mail with defined transport object
      let info = await transporter.sendMail({
          from: 'anupamahera2022@gmail.com', // sender address
          to: email, // recipient email address
          subject: 'HERE IS YOUR OTP CODE TO SUCCESSFULLY REGISTER TO ESTATE-EASE', // subject line
          text: `Your OTP code is: ${otp}`, // plain text body
          html: `<b>Your OTP code is: ${otp}</b>` // html body
      });

      if(info.messageId){
        console.log('Message sent: %s', info.messageId);
      } else {
        console.log("Failed");
      }

      // Send success response after email sending is completed
      res.status(201).json({
          status: 'success',
          data: req.body
      });
  } catch (error) {
      next(error);
  }
};

exports.signin = async(req,res,next)=>{
   const {email,password}=req.body
   try{
   //check if email exist
   const validUser = await User.findOne({email}) //go to database and find if user exist with email we got from req.body
   if(!validUser || !validUser.verified_user) return next(errorHandler(404,'User not found !'));
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

exports.google = async(req,res,next)=>{
  try {
    const user = await User.findOne({email:req.body.email})
    if(user){
    //if the user exist then sign in the user
    const token = jwt.sign({id:user._id},process.env.JWT_SECRET);
    const {__v,password:pass,...restOfData} = user._doc;
    res.cookie('access_token',token,{httpOnly:true})
    .status(200)
    .json(restOfData);
    }else{
    //if user does not exist then create the user
    //1.generate a password for user as google auth dont give passwords
    const generatedPassword = Math.random().toString(36).slice(-8);
    //2.Hash the password
    const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
    //3.save new user to database
    const newUser = new User({username:req.body.name.split(" ").join("").toLowerCase()+Math.random().toString(36).slice(-4), email:req.body.email, password : hashedPassword, avatar: req.body.photo})
    await newUser.save();
    const token = jwt.sign({id:newUser._id},process.env.JWT_SECRET);
    const {__v,password:pass,...restOfData} = newUser._doc;
    res.cookie('access_token',token,{httpOnly:true})
    .status(200)
    .json(restOfData);


    }
  } catch (error) {
    next(error)
  }
}