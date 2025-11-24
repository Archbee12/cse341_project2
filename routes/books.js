const express = require('express');
const router = express.Router();

const bookController = require('../controllers/books');
const { validateBook } = require('../middleware/validateBook');
const { isAuthenticated } = require('../middleware/auth');

router.get('/', bookController.getAll);

router.get('/:id', bookController.getSingle);

router.post('/', isAuthenticated, validateBook, bookController.createBook);

router.put('/:id', isAuthenticated, validateBook, bookController.updateBook);

router.delete('/:id', isAuthenticated, bookController.deleteBook);

module.exports = router;
