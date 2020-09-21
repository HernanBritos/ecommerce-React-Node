const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const routes = require("./routes/index.js");
var cors = require("cors");
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const { User } = require("./models/User" );
require("./db.js");
const flash = require('flash');

const server = express();

server.name = "API";
server.use("/imagenes", express.static("imagenes"));
server.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
server.use(bodyParser.json({ limit: "50mb" }));
server.use(cookieParser());
server.use(morgan("dev"));
server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
server.use(cors());
server.use("/", routes);

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    function(email, password, done) {
      console.log('email', email, 'password', password);
      User.findOne({ where: { email: email } })
        .then(user => {
          if (!user) {
            return done(null, false, {
              message: 'El correo electrónico no existe.',
            });
          }
          if (!user.checkPassword(password)) {
            return done(null, false, {
              message: 'La contraseña es incorrecta.',
            });
          }
          return done(null, user);
        })
        .catch(err => {
          if (err) {
            return done(err);
          }
        });
    },
  ),
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id)
    .then(user => {
      done(null, user);
    })
    .catch(err => done(err));
});

server.use(session({ 
  secret: 'my secret string',
  resave: false,
  saveUninitialized: false,
 }));
server.use(passport.initialize());
server.use(passport.session());

server.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");

  res.locals.user = req.user || null;
  next();
});



// Error catching endware.
server.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars

  res.status(status).send(message);
});

module.exports = server;
