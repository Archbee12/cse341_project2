const express = require('express');
const router = express.Router();

const bookController = require('../controllers/books');
const {validateBook}  = require('../middleware/validateBook')

router.get('/', bookController.getAll);
 
router.get('/:id', bookController.getSingle)

router.post('/', validateBook, bookController.createBook);

router.put('/:id', validateBook, bookController.updateBook);

router.delete('/:id', bookController.deleteBook);

module.exports = router;