const mongodb = require('../database/connect');
const ObjectId = require('mongodb').ObjectId;

// Get all Authors
const getAll = async (req, res) => {
  try {
    const result = await mongodb.getDatabase().collection('authors').find();
    const authors = await result.toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(authors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single author by ID
const getSingle = async (req, res) => {
  try {
    const authorId = new ObjectId(req.params.id);
    const result = await mongodb.getDatabase().collection('authors').findOne({ _id: authorId });

    if (!result) {
      return res.status(404).json({ message: "author not found" });
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create Author
const createAuthor = async (req, res) => {
  try {
    const { name, birthYear, nationality } = req.body;

    if (!name || !birthYear || !nationality) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const author = {
      name,
      birthYear,
      nationality,
      createdAt: new Date()
    };

    const response = await mongodb.getDatabase().collection('authors').insertOne(author);

    res.status(201).json({ message: "Author created", id: response.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Author
const updateAuthor = async (req, res) => {
  try {
    const authorId = new ObjectId(req.params.id);
    const { name, birthYear, nationality } = req.body;

    if (!name || !birthYear || !nationality) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const updatedAuthor = {
      name,
      birthYear,
      nationality
    };

    const response = await mongodb.getDatabase().collection('authors').updateOne(
      { _id: authorId },
      { $set: updatedAuthor }
    );

    if (response.modifiedCount > 0) {
      res.status(200).json({ message: "Author updated" });
    } else {
      res.status(404).json({ error: "Author not found or no changes made" });
    }

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Author
const deleteAuthor = async (req, res) => {
  try {
    const authorId = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().collection('authors').deleteOne({ _id: authorId });

    if (response.deletedCount > 0) {
      res.status(200).json({ message: "Author deleted" });
    } else {
      res.status(404).json({ error: "Author not found" });
    }

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAll, getSingle, createAuthor, updateAuthor, deleteAuthor };
