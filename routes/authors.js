const express = require('express');
const router = express.Router();
const authorsController = require('../controllers/authors');
const {validateAuthor}  = require('../middleware/validateAuthor')

router.get('/', authorsController.getAll);

router.get('/:id', authorsController.getSingle)

router.post('/', validateAuthor, authorsController.createAuthor);

router.put('/:id', validateAuthor, authorsController.updateAuthor);

router.delete('/:id', authorsController.deleteAuthor);

module.exports = router;
