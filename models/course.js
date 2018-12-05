const mongoose = require("mongoose");

const Course = mongoose.model("Course", {
  code: {
    type: String,
    required: true,
    minlength: 6,
    trim: true, // trim whitespace
    unique: true
  },
  name: {
    type: String,
    required: true,
    minlength: 6,
    trim: true, // trim whitespace
    unique: true
  },
  instructor: {
    type: String,
    required: true,
    minlength: 5,
    trim: true, // trim whitespace
  },
  students: {
    // ObjectId for the user who created this course
    type: [mongoose.Schema.Types.ObjectId],
    required: false
  },
  assignments: {
    // ObjectId for the user who created this course
    type: [mongoose.Schema.Types.ObjectId],
    required: false
  }
});

module.exports = { Course };
