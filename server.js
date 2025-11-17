// 1 We require express and routes
const express = require('express');
const app = express();
const mongodb = require('./database/connect');
const route = require('./routes');
const bodyParser = require("body-parser")

// 2 We call the port to view the page
const port = process.env.PORT || 3000;

// Body Parser
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rest Api
app.use((req, res, next) => {
  res.setHeader('Access-control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Orgin, x-Requested-with, Content-Type Accept, z-key'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
})

// We make use of required routes
app.use('/', route);

// 4 Wrap mongodb database
mongodb.initDb((err) => {
  if (err) {
    console.log(err);
  }
  else {
    // 3 Then we listen to the port using
    app.listen(port, () => (
      console.log(`Running on port ${port}`)
    ))
  }
})
