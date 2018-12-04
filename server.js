"use strict";
const log = console.log;

const express = require("express");
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const session = require("express-session");
const { ObjectID } = require("mongodb");

// Import mongoose connection
const { mongoose } = require("./db/mongoose");

// Import models
const { Student } = require("./models/student");
const { User } = require("./models/user");
const { Course } = require("./models/course");
const { Assignment } = require("./models/assignment");

// express
const app = express();
// body-parser middleware setup.  Will parse the JSON and convert to object
app.use(bodyParser.json());
// parse incoming parameters to req.body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
// session
app.use(
  session({
    secret: "somesecretstring",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 120000,
      httpOnly: true
    }
  })
);

// route for root; redirect to login
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Users Endpoints
app.post("/users", (req, res) => {
  // Create a new user
  const user = new User({
    email: req.body.email,
    password: req.body.password,
    isAdmin: req.body.isAdmin
  });

  // save user to database
  user.save().then(
    result => {
      res.send(user);
    },
    error => {
      res.status(400).send(error); // 400 for bad request
    }
  );
});

app.post("/users/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // find the user with this email and password
  User.findByEmailPassword(email, password)
    .then(user => {
      if (!user) {
        res.redirect("/");
      } else {
        // Add to the session cookie
        req.session.user = user._id;
        req.session.email = user.email;
        res.send({
          _id: user._id
        });
      }
    })
    .catch(error => {
      res.status(400).redirect("/");
    });
});

app.get("/users/logout", (req, res) => {
  req.session.destroy(error => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.redirect("/");
    }
  });
});

// Students
// Authentication for resource routes
const authenticate = (req, res, next) => {
  if (req.session.user) {
    User.findById(req.session.user)
      .then(user => {
        if (!user) {
          return Promise.reject();
        } else {
          req.user = user;
          next();
        }
      })
      .catch(error => {
        res.redirect("/");
      });
  } else {
    res.redirect("/");
  }
};
// Set up a POST route to create a student
app.post("/students", (req, res) => {
  log(req.body);

  // Create a new student
  const student = new Student({
    name: req.body.name,
    program: req.body.program,
    year: req.body.year,
    account: req.body.account,
    courses: []
  });

  // save student to database
  student.save().then(
    result => {
      // Save and send object that was saved
      res.send(result);
    },
    error => {
      res.status(400).send(error); // 400 for bad request
    }
  );
});

// GET all students
app.get("/students", authenticate, (req, res) => {
  Student.find().then(
    students => {
      res.send({ students });
    },
    error => {
      res.status(400).send(error);
    }
  );
});

// GET student by user log in id
app.get("/students/:id", authenticate, (req, res) => {
  Student.find({
    account: req.user._id // from authenticated user
  }).then(
    student => {
      res.send(student);
    },
    error => {
      res.status(400).send(error);
    }
  );
});

app.listen(port, () => {
  log(`Listening on port ${port}...`);
});
