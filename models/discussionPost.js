const mongoose = require('mongoose');

const DiscussionPostSchema = new mongoose.Schema( {

    studentName: {
        type: String,
        minlength: 1,
        trim: true,
        required: true
    },
    replyID: {
        type: mongoose.Schema.Types.ObjectId,
        required: false
    },

    studentID: {
        // ObjectId for the user login for this student
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    courseID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },

    date: {
        type: Date,
        required: true,
    },


    postText: {
        type: String,
        required: true
    }

});

const DiscussionPost = mongoose.model('DiscussionPost', DiscussionPostSchema);


module.exports = { DiscussionPost };
