const validator = require('../helpers/validate');

const validateAuthor = (req, res, next) => {
  const rules = {
    name: 'required|string',
    birthYear: 'required|integer',
    nationality: 'required|string',
  };

  validator(req.body, rules, {}, (err, status) => {
    if (!status) {
      return res.status(412).send({
        success: false,
        message: 'Author validation failed',
        data: err,
      });
    }
    next();
  });
};

module.exports = { validateAuthor };
