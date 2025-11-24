// 1 We require express and routes
const express = require('express');
const app = express();
const mongodb = require('./database/connect');
const swaggerRoute = require('./routes/swagger');
const route = require('./routes');
const bodyParser = require("body-parser");
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const GitHubStrategy = require('passport-github2').Strategy
const cors = require('cors');


// 2 We call the port to view the page
const port = process.env.PORT || 3000;

// Body Parser
app.use(bodyParser.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URL,
        ttl: 14 * 24 * 60 * 60 // 14 days
    })
}));
// Express session initialization
app.use(passport.initialize());
// Init passport on every route call
app.use(passport.session());
//Allow passport to use express-session
// Rest Api
app.use((req, res, next) => {
  res.setHeader('Access-control-Allow-Origin', '*');
  res.setHeader("Access-Control-Allow-Methods",
    "POST, GET, PUT, PATCH, OPTIONS, DELETE"
  );
  next();
})

app.use(cors({methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']}))
app.use(cors({origin: '*'}))

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL
},
function(accessToken, refreshToken, profile, done) {
  // try {
  //   let user = await User.findOne({ githubId: profile.id})
  //   if (!user) {
  //     user = await User.create({
  //       githubId: profile.id,
  //       username: profile.username
  //     })
  //   }
    return done(null, profile);
  // } catch (err) {
  //   done(err, null)
  // }
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    // const user = await User.findById(id);
    done(null, user);
});

app.get('/', (req, res) => {
  res.send(req.session.user != undefined ? `Logged in as ${req.session.user.username}`: "Logged Out")
})



// app.get('/', (req, res) => {
//   res.send(req.session.user !== undefined ? `Logged in as ${req.session.user.displayName}` : "Logged Out")
// })

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api-docs', swaggerRoute);


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
