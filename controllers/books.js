const mongodb = require('../database/connect');
const ObjectId = require('mongodb').ObjectId;

// Get all books
const getAll = async (req, res) => {
  try {
    const result = await mongodb.getDatabase().collection('books').find();
    const books = await result.toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single book by ID
const getSingle = async (req, res) => {
  try {
    const bookId = new ObjectId(req.params.id);
    const result = await mongodb.getDatabase().collection('books').findOne({ _id: bookId });

    if (!result) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a Book
const createBook = async (req, res) => {
  try {
    const db = mongodb.getDatabase();

    const { title, genre, isbn, publishedYear, pages, available, author } = req.body;

    if (
      !title ||
      !genre ||
      !isbn ||
      !publishedYear ||
      !pages ||
      available === undefined ||
      !author
    ) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if author exists by name
    let existingAuthor = await db.collection('authors').findOne({ name: author.name });
    if (!existingAuthor) {
      // If not, create new author
      const authorResult = await db.collection('authors').insertOne({
        name: author.name,
        birthYear: author.birthYear || null,
        nationality: author.nationality || null,
        createdAt: new Date(),
      });
      existingAuthor = { _id: authorResult.insertedId };
    }

    // Create book using existingAuthor._id
    const book = {
      title: req.body.title,
      genre: req.body.genre,
      isbn: req.body.isbn,
      publishedYear: req.body.publishedYear,
      pages: req.body.pages,
      available: req.body.available,
      createdAt: new Date(),
      authorId: existingAuthor._id,
    };

    const response = await db.collection('books').insertOne(book);

    if (response.acknowledged) {
      res
        .status(201)
        .json({
          message: 'Book created successfully',
          bookId: response.insertedId,
          authorId: existingAuthor._id,
        });
    } else {
      res.status(500).json({ error: 'Failed to create book' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a Book
// Update a Book
const updateBook = async (req, res) => {
  try {
    const bookId = new ObjectId(req.params.id);

    const { title, genre, isbn, publishedYear, pages, available, authorId } = req.body;

    if (
      !title ||
      !genre ||
      !isbn ||
      !publishedYear ||
      pages === undefined ||
      available === undefined ||
      !authorId
    ) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const updatedBook = {
      title: req.body.title,
      genre: req.body.genre,
      isbn: req.body.isbn,
      publishedYear: req.body.publishedYear,
      pages: req.body.pages,
      available: req.body.available,
      authorId: new ObjectId(authorId),
    };

    const response = await mongodb
      .getDatabase()
      .collection('books')
      .updateOne({ _id: bookId }, { $set: updatedBook });

    if (response.modifiedCount > 0) {
      res.status(200).json({ message: 'Book updated successfully' });
    } else {
      res.status(404).json({ error: 'Book not found or no changes made' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a Book
const deleteBook = async (req, res) => {
  try {
    const bookId = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().collection('books').deleteOne({ _id: bookId });

    if (response.deletedCount > 0) {
      res.status(200).json({ message: 'Book deleted successfully' });
    } else {
      res.status(404).json({ error: 'Book not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAll, getSingle, createBook, updateBook, deleteBook };
