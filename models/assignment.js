const mongoose = require("mongoose");

const Assignment = mongoose.model("Assignment", {
  code: {
    type: String,
    required: true,
    minlength: 6,
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
    minlength: 5,
    trim: true,
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
