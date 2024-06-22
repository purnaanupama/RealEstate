const bcryptjs = require('bcryptjs');
const User = require('../models/user.model');
const errorHandler = require('../utils/error');
const nodemailer = require('nodemailer');
const speakeasy = require('speakeasy');


//verify otp code
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

//generate otp code
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

exports.resendOTP = async(req,res,next)=>{
    const { username, email, password, newEmail } = req.body;
    //generate temp secret
    const otp = generateOtp();
    //find current user data from database
    const user = await User.findOne({email});
     // Create a transporter using SMTP
     if(user){
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
            to: newEmail, // recipient email address
            subject: 'HERE IS YOUR OTP CODE TO SUCCESSFULLY REGISTER TO ESTATE-EASE', // subject line
            text: `Your OTP code is: ${otp}`, // plain text body
            html: `<b>Your OTP code is: ${otp}</b>` // html body
        });
      
        if(info.messageId){
          console.log('Message sent: %s', info.messageId);
        } else {
          console.log("Failed");
        }
         // Mark the user as verified
         user.otp_code = otp;
         await   user.save();
      
        // Send success response after email sending is completed
        res.status(201).json({
            status: 'success',
            otp:otp
        }); 
     }else{
        console.log("user not found !");
     }
    
}

exports.updateUser = async(req,res,next)=>{
  if(req.user.id !== req.params.id) return next(errorHandler(401,"you can only update your own account !"))
    const currentUser = await User.findOne({_id:req.user.id});
    const user = await User.findOne({email:req.body.email});

    if(!user){
      //generate and send otp
    const otp = generateOtp();
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
        to: req.body.email, // recipient email address
        subject: 'HERE IS YOUR OTP CODE TO SUCCESSFULLY REGISTER TO ESTATE-EASE', // subject line
        text: `Your OTP code is: ${otp}`, // plain text body
        html: `<b>Your OTP code is: ${otp}</b>` // html body
    });
  
    if(info.messageId){
      console.log('Message sent: %s', info.messageId);
    } else {
      console.log("Failed");
    }
        // Update OTP
        currentUser.otp_code = otp;
        await currentUser.save();

    //update details except email
    try{
        if(req.body.password){
            req.body.password = bcryptjs.hashSync(req.body.password, 10)
           } 
           const updatedUser = await User.findByIdAndUpdate(req.params.id,{
            $set:{
                username:req.body.username,
                password: req.body.password,
                avatar:req.body.avatar,
            }
           },{new:true});
           const {password,...rest} = updatedUser._doc
           res.status(200).json({
            ...rest,
            status: 'email-change'
        });
    }catch(error){
        next(error)  
    }
    
    return; 
    }

    //if user is not trying to update the email
    
    try {
       if(req.body.password){
        req.body.password = bcryptjs.hashSync(req.body.password, 10)
       } 
       const updatedUser = await User.findByIdAndUpdate(req.params.id,{
        $set:{
            username:req.body.username,
            password: req.body.password,
            avatar:req.body.avatar,
        }
       },{new:true});
       const {password,...rest} = updatedUser._doc
       res.status(200).json(rest);
    } catch (error) {
       next(error) 
    }
}

exports.updateEmail = async(req,res,next)=>{
   const {otp,email} = req.body;
   const isValid = verifyOtp(otp.otp);
   if(isValid){
    try{
        const user = await User.findOne({otp_code:otp.otp})
        if (user){
            //update email and remove otp
            user.otp_code = null;
            await user.save();

            const {password,...rest} =user._doc
            res.status(200).json({ 
                ...rest,
                status: 'success', 
            });
        }else{
            res.status(400).json({ 
                status: 'fail', 
                message: 'Invalid OTP' 
            });
        }
    }
    catch(error){
      next(error)
    }
   }else{
    res.status(400).json({ 
        status: 'fail', 
        message: 'Invalid OTP' 
    });
   }

   }
  


   exports.deleteUser = async (req, res, next) => {
    const { email, pass } = req.body; // Use 'confirmPass' to match the request body
    if (req.user.id !== req.params.id) {
        return next(errorHandler(401, 'Cannot Delete Account'));
    }
  console.log(pass.confirmPass);
    try {
        const currentUser = await User.findOne({ email });

        if (!currentUser) {
            return res.status(404).json({
                status: 'fail',
                message: 'User not found!'
            });
        }
        if(currentUser.type === "google"){
            await User.findByIdAndDelete(req.params.id);
            res.clearCookie('access_token');
            return res.status(200).json({
                status: 'success',
                message: 'User deleted successfully !!'
            })
        }
        const confirmPassString = String(pass.confirmPass);
        // Ensure 'confirmPass' is a string
        if (typeof confirmPassString !== 'string') {
            return res.status(400).json({
                status: 'fail',
                message: 'Password must be a string!'
            });
        }
      
        const validPassword = bcryptjs.compareSync(confirmPassString, currentUser.password);

        if (!validPassword) {
            return res.status(400).json({
                status: 'fail',
                message: 'Password Incorrect cannot delete account. If forgotten update the password and try again !'
            });
        }

        await User.findByIdAndDelete(req.params.id);
        res.clearCookie('access_token');
        return res.status(200).json({
            status: 'success',
            message: 'User deleted successfully !!'
        })
    } catch (error) {
        next(error);
    }
};
