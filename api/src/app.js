const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const routes = require("./routes/index.js");
// const { User } = require("./models/User");
const { User } = require("./db");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const session = require("express-session");
var cors = require("cors");

require("./db.js");

const server = express();

server.name = "API";
server.use("/imagenes", express.static("imagenes"));
server.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
server.use(bodyParser.json({ limit: "50mb" }));

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
passport.initialize();
passport.session();
server.use((req, res, next) => {
  console.log(req.user);
  res.locals.user = req.user || null;
  next();
});
server.use(cookieParser("secretcode"));

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    function (email, password, done) {
      console.log("email", email, "password", password);
      User.findOne({ where: { email: email } })
        .then((user) => {
          if (!user) {
            return done(null, false, {
              message: "El correo electrónico no existe.",
            });
          } else if (!user.checkPassword(password)) {
            return done(null, false, {
              message: "La contraseña es incorrecta.",
            });
          } else {
            return done(null, user.dataValues);
          }
        })
        .catch((err) => {
          if (err) {
            return done(err);
          }
        });
    }
  )
);

passport.serializeUser(function (user, done) {
  console.log(user.id, "Serialize");
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findByPk(id)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => done(err));
});

server.use(passport.initialize());
server.use(passport.session());

server.use(
  session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true,
  })
);

server.use("/", routes);

// Error catching endware.
server.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

module.exports = server;
