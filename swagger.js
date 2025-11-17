const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Books and Authors API',
    description: 'API documentation for authors and their book project',
  },
  host: 'https://cse341-project2-x9m0.onrender.com',
  schemes: ['https'],
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
