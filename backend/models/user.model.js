
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
      },
    email:{
        type:String,
        required:true,
        unique:true,
      },
    password:{
        type:String,
        required:true,
      },
    role:{
        type:String,
        enum:['user','admin'],
        default: 'user'
    },
    avatar:{
      type:String,
      default:"https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1114445501.jpg"
    },
},
{ timestamps:true })

const User = mongoose.model('User',userSchema);

module.exports = User;