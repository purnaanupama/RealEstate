// auth.middleware.js

const uppercaseUsername = (req, res, next) => {
    if (req.body.username) {
      req.body.username = req.body.username.toUpperCase();
    }
    next();
  };
  
  module.exports = uppercaseUsername;