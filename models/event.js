const mongoose = require("mongoose");

const Event = mongoose.model("Event", {
 
  code: {
    type: String,
    required: true,
    minlength: 1,
    trim: true, // trim whitespace
    
  },
  day: {
    type: String,
    required: true
  },
  start: {
      type: String,
      required: true
  },

  end:{
      type: String,
      required: true
  },
  color: {
      type: String,
      required:false
  },
  student:{
    type: String,
    required: true
  }

});

module.exports = { Event };