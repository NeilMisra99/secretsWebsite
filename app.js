//jshint esversion:6
// Require for dotenv package i.e. for env variables:
require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-findorcreate");

// bCrypt usage
// const bcrypt = require("bcrypt");
// const saltRounds = 10;

// Require mongoose-encryption:
// const encrypt = require("mongoose-encryption");

// Require md5
// const md5 = require("md5");

app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

// Express session stuff:
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Passport initialization:
app.use(passport.initialize());
app.use(passport.session());

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb+srv://"+process.env.MONGO+"@todolist.nnosv2i.mongodb.net/secretsDB");
}

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  secret: [String],
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

// Line of code for using mongoose-encryption with env variables in the .env file:
// userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

// Google OAuth2.0
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://good-ruby-vest.cyclic.app/auth/google/secrets",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    function (accessToken, refreshToken, profile, cb) {
      User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return cb(err, user);
      });
    }
  )
);

// Register user using passport
app.post("/register", (req, res) => {
  User.register(
    { username: req.body.username },
    req.body.password,
    (err, user) => {
      if (err) {
        console.log(err);
        res.redirect("/register");
      } else {
        passport.authenticate("local")(req, res, () => {
          res.redirect("/secrets");
        });
      }
    }
  );

  // bCrypt usage for hashing and salting

  // bcrypt.hash(req.body.registerPass, saltRounds, function(err, hash) {
  //     const newUser = new User({
  //         email: req.body.registerEmail,
  //         password: hash
  //                             // Standard call: req.body.registerPass
  //                             // MD5 conversion: password: md5(req.body.registerPass)
  //     });
  //     newUser.save();
  //     res.render("secrets");
  // });
});

// Authenticate user during login (using passport). If error, redirect to login
app.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/home");

    // bCrypt usage for hashing and salting

    // User.findOne({email: req.body.loginEmail})
    // .then((results)=>{
    //     bcrypt.compare(req.body.loginPass, results.password, function(err, result) {
    //         if(result === true)                             //MD5 conversion: md5(req.body.loginPass))
    //         {
    //             res.render("secrets");
    //         }
    //         else
    //         {
    //             console.log(err);
    //         }
    //     });
    // })
    // .catch((err) =>{
    //     console.log("No user found \n"+err);
    // })
  }
);

// Submit's a post under the current logged in user after finding them
app.post("/submit", (req, res) => {
  const submittedSecret = req.body.secret;

  User.findById({ _id: req.user._id }).then((foundUser) => {
    foundUser.secret.push(submittedSecret);
    foundUser.save().then(() => {
      res.redirect("/secrets");
    });
  });
});

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
  res.render("login");
});

// If user is authenticated, they can view other users' secrets, if not, redirected to login
app.get("/secrets", (req, res) => {
  // If you want to login to even see the secrets:
  if (req.isAuthenticated()) {
    User.find({ secret: { $ne: null } }).then((foundUsers) => {
      if (foundUsers) {
        res.render("secrets", { usersWithSecrets: foundUsers });
      }
    });
  } else {
    res.redirect("/login");
  }
  // If you don't want to login to see secrets:
  // User.find({secret: {$ne: null}}).then((foundUsers) =>{
  //     if(foundUsers)
  //     {
  //         res.render("secrets", {usersWithSecrets: foundUsers});
  //     }
  // });
});

// Logging user out
app.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      console.log(err);
    }
    res.redirect("/");
  });
});

// Granting authentication to allow access to certain parts of Google profile
app.get('/auth/google',
  passport.authenticate('google', { scope:
      [ 'email', 'profile' ] }
));

//Redirecting site to secrets page after being authenticated
app.get(
  "/auth/google/secrets",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect("/secrets");
  }
);

// Submitting a secret given that the user is logged in
app.get("/submit", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("submit");
  } else {
    res.redirect("/login");
  }
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
