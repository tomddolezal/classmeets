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

  if (!user) {
    res.status(400).send(error);
    return;
  }
  // save user to database
  user
    .save()
    .then(
      result => {
        res.send(user);
      },
      error => {
        res.status(400).send(error); // 400 for bad request
      }
    )
    .catch(error => console.log(error));
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
  const student = new Student({
    name: req.body.name,
    program: req.body.program,
    year: req.body.year,
    account: req.body.account,
    courses: [],
    assignments: []
  });
  if (!student) {
    res.status(400).send(error); // 400 for bad request
    return;
  }
  student
    .save()
    .then(result => {
      // Save and send object that was saved
      res.send(result);
    })
    .catch(error => {
      res.status(400).send(error); // 400 for bad request
    });
});

// GET all students
app.get("/students/", authenticate, (req, res) => {
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
app.get("/student/:_id", (req, res) => {
  const id = req.params._id;
  Student.find({
    account: id
  }).then(
    student => {
      res.send(student);
    },
    error => {
      res.status(400).send(error);
    }
  );
});
app.post("/courses", (req, res) => {
  const course = new Course({
    code: req.body.code,
    instructor: req.body.instructor,
    name: req.body.name,
    assignments: [],
    students: []
  });

  course.save().then(
    result => {
      res.send(result);
    },
    error => {
      res.status(400).send(error); // 400 for bad request
    }
  );
});

app.get("/courses/", authenticate, (req, res) => {
  Course.find().then(
    courses => {
      res.send({ courses });
    },
    error => {
      res.status(400).send(error);
    }
  );
});

//Assignments
app.get("/assignments/:course_id", authenticate, (req, res) => {
  const id = req.params.course_id;

  Course.find({ code: id })
    .then(
      course => {
        Assignment.find({ code: id }).then(assignments => {
          res.send(assignments);
        });
      },
      error => {
        res.status(400).send(error);
      }
    )
    .catch(error => {
      res.status(400).send(error);
    });
});
app.post("/assignments", (req, res) => {
  const assignment = new Assignment({
    code: req.body.code,
    due: req.body.due,
    name: req.body.name,
    students: []
  });

  assignment
    .save()
    .then(result => {
      Course.find({
        code: result.code
      })
        .then(course => {
          course[0].assignments.push(result._id);
          course[0].save().then(newCourse => res.send(result));
        })
        .catch(error => {
          res.status(400).send(error);
        });
    })
    .catch(error => {
      res.status(400).send(error);
    });
});

app.listen(port, () => {
  log(`Listening on port ${port}...`);
});
