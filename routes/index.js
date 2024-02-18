let express = require('express');
let router = express.Router();

/* Redirect to contacts as in the book Hypermedia Systems. */
router.get('/', function (req, res, next) {
  res.redirect('/contacts');
});

module.exports = router;
