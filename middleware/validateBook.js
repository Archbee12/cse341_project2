const validator = require('../helpers/validate');

const validateBook = (req, res, next) => {
  const rules = {
    title: 'required|string',
    genre: 'required|string',
    isbn: 'required|string',
    publishedYear: 'required|integer',
    pages: 'required|integer',
    available: 'required|boolean',
    authorId: 'required|string',
  };

  validator(req.body, rules, {}, (err, status) => {
    if (!status) {
      return res.status(412).send({
        success: false,
        message: 'Book validation failed',
        data: err,
      });
    }
    next();
  });
};

module.exports = { validateBook };
