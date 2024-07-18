const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const path = require('path');

// Config dotenv
dotenv.config();

const __dirname = path.resolve();
// Create express app
const app = express();

// Body parser
app.use(express.json());

// URL parser
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Connect to MongoDB
mongoose.connect(process.env.MONGO)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    // Handle MongoDB connection error as per your application's requirements
    // You may choose to log it, notify admins, or take other actions
  });


// Mount routers
app.use('/api/user', require('./routes/user.route'));
app.use('/api/auth', require('./routes/auth.route'));
app.use('/api/listing', require('./routes/listing.route'));

app.use(express.static(path.join(__dirname,'/client/dist')))

app.get('*',(req,res)=>{
  res.sendFile(path.join(__dirname,'client','disc','index.html'))
})

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    status: 'fail',
    statusCode,
    message
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});