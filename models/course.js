const mongoose = require("mongoose");

const Course = mongoose.model("Course", {
  code: {
    type: String,
    required: true,
    minlength: 1,
    trim: true, // trim whitespace
    unique: true
  },
  year: {
    type: Number,
    required: true
  },
  students: {
    // ObjectId for the user who created this course
    type: [mongoose.Schema.Types.ObjectId],
    required: true
  },
  assignments: {
    // ObjectId for the user who created this course
    type: [mongoose.Schema.Types.ObjectId],
    required: true
  }
});

module.exports = { Course };
