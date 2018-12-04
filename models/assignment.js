const mongoose = require("mongoose");

const Assignment = mongoose.model("Assignment", {
  code: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true
  },
  date: {
    type: String,
    required: true,
    minlength: 5,
    trim: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    minlength: 5,
    trim: true,
    unique: true
  },
  students: {
    type: [mongoose.Schema.Types.ObjectId],
    required: false
  },
  percent: {
    type: String,
    required: false
  }
});

module.exports = { Assignment };
