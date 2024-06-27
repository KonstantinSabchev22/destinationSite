var express = require('express');
const passport = require('../configuration/passport');
var router = express.Router();
const User = require('../models/User');
const middleware = require('../middleware/auth');


// GET register form
router.get('/register', (req, res) => {
  res.render('users/register', { title: 'Register' });
});

// POST register user
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    await User.create({ firstName, lastName, email, password });
    res.redirect('/users/login');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// GET login form
router.get('/login', (req, res) => {
  const message = req.flash('error');
  res.render('users/login', { title: 'Login', message: message });
});

// POST login form
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login',
  failureFlash: true
}));

router.get('/logout', middleware.ensureAuthenticated, function(req, res, next) {
  req.logout(function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});
module.exports = router;
