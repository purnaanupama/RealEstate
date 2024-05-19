const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv')

//config dotenv
dotenv.config();

//create express app
const app = express();


mongoose.connect(process.env.MONGO)
        .then(()=>{
            console.log('Connected to MongoDB');
        })
        .catch((err)=>{
            console.log(err);
        })

//creating and starting server
app.listen(3000,()=>{
    console.log('Server running on port 3000');
})

//mongodb+srv://root:pass@mern-estate.7vjcm6l.mongodb.net/?retryWrites=true&w=majority&appName=Mern-Estate