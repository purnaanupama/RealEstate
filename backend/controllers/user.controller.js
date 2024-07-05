const bcryptjs = require('bcryptjs');
const User = require('../models/user.model');
const Listing = require('../models/listing.model');
const errorHandler = require('../utils/error');
const sendEmail = require('../utils/sendEmail')
const otp_functions = require('../utils/otpSystem')

exports.resendOTP = async(req,res,next)=>{
    const { username, email, password, newEmail } = req.body;
    //generate temp secret
    const otp = otp_functions.generateOtp();
    //find current user data from database
    const user = await User.findOne({email});
     // Create a transporter using SMTP
     if(user){
        const result = await sendEmail.sendEmail(email,otp)
        if(result==='success'){
        console.log("email sent to " + email);
        // Mark the user as verified
        user.otp_code = otp;
        await  user.save();
       // Send success response after email sending is completed
       res.status(201).json({
        status: 'success',
        otp:otp
    }); 
    return;  
  }else{
    return console.log("email not sent !");
  }    
}    }

exports.updateUser = async(req,res,next)=>{
  if(req.user.id !== req.params.id) return next(errorHandler(401,"you can only update your own account !"))
    const currentUser = await User.findOne({_id:req.user.id});
    const user = await User.findOne({email:req.body.email});
    const email = req.body.email;
    if(!user){
    //generate and send otp
    const otp = otp_functions.generateOtp();
    const result = await sendEmail.sendEmail(email,otp)
    // Update OTP
    if(result==='success'){
        currentUser.otp_code = otp;
        await currentUser.save();
    }else{
        return console.log("Email not sent !");
    }
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
   const isValid = otp_functions.verifyOtp(otp.otp);
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
exports.getUserListings = async(req,res,next)=>{
  if(req.user.id === req.params.id){
    try {
     const listings = await Listing.find({userRef:req.params.id})
     res.status(200).json(listings);
    } catch (error) {
     next(error)
    }
  }
  else{
    return next(errorHandler(401,'You can only view your own listings'))
  }
}
