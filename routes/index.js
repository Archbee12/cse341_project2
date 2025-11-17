const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  //swagger.tags-['Hello World']
  res.send('Hello World');
});

router.use('/books', require('./books'));
router.use('/authors', require('./authors'));

module.exports = router;


