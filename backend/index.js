const express = require('express');

//create express app
const app = express();


//creating and starting server
app.listen(3000,()=>{
    console.log('Server running on port 3000');
})