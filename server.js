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
const { Event } = require("./models/event");
const { Course } = require("./models/course");
const { Assignment } = require("./models/assignment");
const { DiscussionPost } = require('./models/discussionPost');
const { AssignmentStudent } = require('./models/assignementStudent');


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
      expires: 1000000,
      httpOnly: true
    }
  })
);

// route for root; redirect to login
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/admin", (req, res) => {
  res.sendFile(__dirname + "/public/admin.html");
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
          _id: user._id,
          isAdmin: user.isAdmin
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
  Student.find()
    .then(
      students => {
        res.send(students);
      },
      error => {
        res.status(400).send(error);
      }
    )
    .catch(error => {
      console.log(error);
      res.status(400).send(error);
    });
});

// GET student by user log in id
app.get("/student/:_id", authenticate, (req, res) => {
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

// DELETE student by student id
app.delete("/student/:_id", authenticate, (req, res) => {
  const id = req.params._id;
  Student.findById(id).then(
    student => {
      const accountId = student.account;
      student.delete();
      User.findByIdAndRemove(accountId).then(user => {
        res.send(user);
      });
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
          course[0].save().then(newCourse =>  res.send(result));
        })
        .catch(error => {
          res.status(400).send(error);
        });
    })
    .catch(error => {
      res.status(400).send(error);
    });
});
  
// get a particular assignment information for a course
app.get("/assignments/:course_id/:assignment_id", authenticate, (req, res) => {
  const assname = req.params.assignment_id;
  const id = req.params.course_id;
  Assignment.find({code:id,name:assname}).then(assignment =>{
    res.send({assignment});
  }).catch(error => {
      res.status(400).send(error);
  });
});


// add student (already in db) to studentlist of an assignment
app.post("/assignments/:course_id/:assignment_id", (req, res) => {
  const stuname = req.body
  const assname = req.params.assignment_id;
  const id = req.params.course_id;
  Student.find({name:stuname}).then(student =>{
    Assignment.find({code:id,name:assname}).then(assignment =>{
     assignment.students.push(student);
     assignment.save().then((studentlist) => {
      res.send({studentlist});
     }), (error) => {
      res.status(400).send(error);
     }
    }).catch((error) => {
     res.status(400).send()
    })
  }).catch((error) => {
    res.status(400).send()
  })
});

app.get("/discussion", (req, res) => {

    DiscussionPost.find().then(discussionPosts => {
        res.send({ discussionPosts });

    }).catch(error => {
        res.status(400).send(error);
    });
});

//Gets discussion post for that course id
app.get('/discussion/:courseID', authenticate, (req, res) => {

  DiscussionPost.find({
      courseID : req.params.courseID

  }).then(posts => {
      res.send(posts);

  }).catch(error => {
      res.status(400).send(error);
  });

});

app.post('/discussion/', (req, res) => {
    const post = DiscussionPost({
        studentName: req.body.studentName,
        replyID : req.body.replyID,
        studentID : req.body.studentID,
        courseID : req.body.courseID,
        date : req.body.date,
        postText : req.body.postText
    });

    post.save().then(result => {
        res.send(result);

    }).catch(error => {
        log(error);
        res.status(400).send(error); // 400 for bad request
    });

});


//Gets course object with matching ID
app.get('/courses/:id', authenticate, (req, res) => {

  Course.findOne({
      _id : req.params.id

  }).then(course => {
    res.send(course);

  }).catch(error => {
    res.status(400).send(error);
  });

});

//get student by is
app.get('/students/:id', authenticate, (req, res) => {
    Student.findOne({
        _id : req.params.id

    }).then(student => {
        res.send(student);

    }).catch(error => {
        res.status(400).send(error);
    });
});


//PROFILE
//Get event info to load into timetable
app.get("/profile/getEvent/:id", (req, res) => {
  const id = req.params.id;

  Event.find({ _id: id })
    .then(
      event => {
          res.send(event);
        
      })
    .catch(error => {
      res.status(400).send(error);
    });
});

//Get assignment for specific student for assignment list
app.get("/profile/getAssign/:id", (req, res) => {
  const id = req.params.id;

  AssignmentStudent.find({ _id: id })
    .then(
      assign => {
        console.log("GET Assignement:" + assign);
          res.send(assign);
        
      })
    .catch(error => {
      res.status(400).send(error);
    });
});

//delete a course from the student's timetable
app.delete("/profile/deleteCourse", (req,res) => {
  const id = req.body.student;
  const day = req.body.day;
  const code = req.body.code;
  const start = req.body.start;
  const end = req.body.end;

  //find ids matching given event
  Event.find({
    student: id,
    day: day,
    code: req.body.code,
    start: req.body.start,
    end: req.body.end
  })
  .remove()
  .then((event) => {
    res.send(event);
  })
    .catch((error) => {
      console.log(error);
    res.status(400).send(error)
  });
  
});

//deletes an assignment from student's list on their profile
app.delete("/profile/deleteAssign", (req,res) => {
  const id = req.body.student;
  const due = req.body.due;
  const code = req.body.code;
  const name = req.body.name;

  //find ids matching given assignement
  AssignmentStudent.find({
    student: id,
    due: due,
    code: code,
    name: name,
  })
  .remove()
  .then((assign) => {
    res.send(assign);
  })
    .catch((error) => {
      console.log(error);
    res.status(400).send(error)
  });
    
  
});


//UPDATE Percent for assignement
app.put("/profile/updatePercent", (req,res) => {
  console.log("PAthc");
  const studentID = req.body.student;
  const code = req.body.code;
  const due = req.body.due;
  const name = req.body.name;
  
  //find assignement matching criteria and get it's id
    
  AssignmentStudent.findOneAndUpdate(
      {"student": studentID,
      "code": code,
      "name": name
    },
      {$set: {
        "percent": req.body.percent
      }}, 
      {new:true}
      ).then((assign) => {
        console.log("A");
        console.log("Bla "+assign);
        res.send(assign);
      })
      .catch((error) => {
        console.log(error);
      res.status(400).send(error)
    });
    
    
  });

//add course to timetable on profile
app.post("/profile/addCourse", (req, res) => {
  const id = req.body.student;
  const event = new Event({
    code: req.body.code,
    day: req.body.day,
    start: req.body.start,
    end: req.body.end,
    color: req.body.color,
    student: req.body.student
  });
  //event.isNew = false;
  event
    .save()
    .then( result => {
      Student.findById(
        id
      ).
      then((student) => {
        //console.log(student);
        student.events.push(event);
        student.save()
        .then(result => {
          res.send(result);
        })
        .catch(error => {
          console.log(error);
          res.status(400).send(error);
        });
      })
      .catch(error => {
        console.log(error);
        res.status(400).send(error);
      });
    })
  .catch(error => {
    console.log(error);
    res.status(400).send(error);
  });
  });

  //add assignement to list on profile
  app.post("/profile/addAssign", (req, res) => {
    const id = req.body.student;
    const assign = new AssignmentStudent({
      code: req.body.code,
      due: req.body.due,
      name: req.body.name,
      student: req.body.student,
      percent: req.body.percent,
    });

    //assign.isNew = false;
    //console.log(assign);
    assign
      .save()
      .then( result => {
        Student.findById(
          id
        ).
        then((student) => {
          student.assignments.push(assign);
          student.save()
          .then(result => {
            res.send(result);
          })
          .catch(error => {
            res.status(400).send(error);
          });
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



