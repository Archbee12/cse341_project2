const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/', (req, res) => {
  //swagger.tags-['Hello World']
  res.send('Hello World');
});

router.use('/authors', require('./authors'));
router.use('/books', require('./books'));

// Auth
// Redirect to GitHub Login
router.get('/login', passport.authenticate('github'), (req, res) => {});

router.get('/github/callback',
    passport.authenticate('github', { failureRedirect: '/api-docs',
    session: false
     }),
    (req, res) => {
      req.session.user = req.user;
      res.redirect('/');
    }
);

// Logout
router.get('/logout', function (req, res, next) {
  req.logout(function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

module.exports = router;
