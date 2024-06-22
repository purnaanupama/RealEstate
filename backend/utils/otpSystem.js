const speakeasy = require('speakeasy');

//verify otp code
exports.verifyOtp = function verifyOtp(token){
    let verified = speakeasy.totp.verifyDelta({
        secret: process.env.OTP_KEY,
        encoding: 'base32',
        token: token,
        step: 30,
        window: 4
    });
    return verified;
  }

exports.generateOtp = function generateOtp() {
    let token = speakeasy.totp({
        secret: process.env.OTP_KEY,
        encoding: 'base32',
        digits: 6,
        step: 30,
        window: 4
    });
    return token;
  }