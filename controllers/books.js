const mongodb = require('../database/connect');
const ObjectId = require('mongodb').ObjectId;

// Get all books
const getAll = async (req, res) => {
  try {
    const books = await mongodb.getDatabase().collection('books').find().toArray();
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single book by ID
const getSingle = async (req, res) => {
  try {
    const bookId = new ObjectId(req.params.id);
    const book = await mongodb.getDatabase().collection('books').findOne({ _id: bookId });

    if (!book) return res.status(404).json({ message: 'Book not found' });

    res.status(200).json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a Book
const createBook = async (req, res) => {
  try {
    const db = mongodb.getDatabase();
    const { title, genre, isbn, publishedYear, pages, available, authorId } = req.body;

    const book = {
      title,
      genre,
      isbn,
      publishedYear,
      pages,
      available,
      authorId: new ObjectId(authorId),
      createdAt: new Date(),
    };

    const response = await db.collection('books').insertOne(book);
    res.status(201).json({ message: 'Book created successfully', bookId: response.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Update a Book
const updateBook = async (req, res) => {
  try {
    const bookId = new ObjectId(req.params.id);
    const { title, genre, isbn, publishedYear, pages, available, authorId } = req.body;

    const updatedBook = { title, genre, isbn, publishedYear, pages, available, authorId: new ObjectId(authorId) };
    const response = await mongodb.getDatabase().collection('books').updateOne({ _id: bookId }, { $set: updatedBook });

    if (response.modifiedCount > 0) return res.status(200).json({ message: 'Book updated successfully' });
    res.status(404).json({ error: 'Book not found or no changes made' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a Book
const deleteBook = async (req, res) => {
  try {
    const bookId = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().collection('books').deleteOne({ _id: bookId });

    if (response.deletedCount > 0) return res.status(200).json({ message: 'Book deleted successfully' });
    res.status(404).json({ error: 'Book not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAll, getSingle, createBook, updateBook, deleteBook };
