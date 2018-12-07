const mongoose = require("mongoose");

const AssignmentStudent = mongoose.model("AssignmentStudent", {
  code: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  due: {
    type: String,
    required: true,
    trim: true,
  },
  student: {
    type: String,
    required: true,
  },
  percent: {
    type: String,
    required: false
  }
});

module.exports = { AssignmentStudent };