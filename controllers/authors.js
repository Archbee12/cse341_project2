const mongodb = require('../database/connect');
const ObjectId = require('mongodb').ObjectId;

// Get all Authors
const getAll = async (req, res) => {
  try {
    const authors = await mongodb.getDatabase().collection('authors').find().toArray();
    res.status(200).json(authors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single Author
const getSingle = async (req, res) => {
  try {
    const authorId = new ObjectId(req.params.id);
    const author = await mongodb.getDatabase().collection('authors').findOne({ _id: authorId });

    if (!author) return res.status(404).json({ message: 'Author not found' });
    res.status(200).json(author);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create Author
const createAuthor = async (req, res) => {
  try {
    const { name, birthYear, nationality } = req.body;
    const author = { name, birthYear, nationality, createdAt: new Date() };
    const response = await mongodb.getDatabase().collection('authors').insertOne(author);
    res.status(201).json({ message: 'Author created', id: response.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Author
const updateAuthor = async (req, res) => {
  try {
    const authorId = new ObjectId(req.params.id);
    const { name, birthYear, nationality } = req.body;
    const updatedAuthor = { name, birthYear, nationality };
    const response = await mongodb.getDatabase().collection('authors').updateOne({ _id: authorId }, { $set: updatedAuthor });

    if (response.modifiedCount > 0) return res.status(200).json({ message: 'Author updated' });
    res.status(404).json({ error: 'Author not found or no changes made' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Author
const deleteAuthor = async (req, res) => {
  try {
    const authorId = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().collection('authors').deleteOne({ _id: authorId });

    if (response.deletedCount > 0) return res.status(200).json({ message: 'Author deleted' });
    res.status(404).json({ error: 'Author not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAll, getSingle, createAuthor, updateAuthor, deleteAuthor };
