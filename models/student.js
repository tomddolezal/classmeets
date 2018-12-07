const mongoose = require("mongoose");

const Student = mongoose.model("Student", {
  name: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true
  },
  program: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
  },
  year: {
    type: Number,
    required: true
  },
  account: {
    // ObjectId for the user login for this student
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  courses: {
    // ObjectId for the user login for this student
    type: [mongoose.Schema.Types.ObjectId],
    required: false
  },
  assignments: {
    // ObjectId for the user login for this student
    type: [mongoose.Schema.Types.ObjectId],
    required: false
  },
  events: {
    // ObjectId for the user login for this student
    type: [mongoose.Schema.Types.ObjectId],
    required: false
  },
});

module.exports = { Student };
