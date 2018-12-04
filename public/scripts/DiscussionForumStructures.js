//GET USER, POSTS, COURSES FROM SERVER
class DFUser {
    constructor(firstName, lastName, email, courses) {
        this.id = DFUser.numOfUsers++; //String
        this.firstName = firstName; //String
        this.lastName = lastName; //String
        this.fullName = firstName + ' ' + lastName; //String
        this.email = email; //String}
        this.courses = courses; //Array of Course - Courses currently being taken
    }

    static getUserByID(id) {
        for (let i = 0; i < DFUser.users.length; i++) {
            if (DFUser.users[i].id === id) {
                return DFUser.users[i];
            }
        }
        return null;
    }
}

//Static Variable
DFUser.users = [];
DFUser.numOfUsers = 0;

class DFStudent extends DFUser {
    constructor(firstName, lastName, email, yearOfStudy, courses, assignments, program) {
        super(firstName, lastName, email, courses);
        this.email = email; //String
        this.yearOfStudy = yearOfStudy; //Int
        this.assignments = assignments; //Array of Assignment
        this.program = program; //String - Possibly make a Program object? idk
        this.profilePicturePath = "resources/" + firstName + ".jpg";
        console.log(this.profilePicturePath);
        DFUser.users.push(this);
    }
}

class Instructor extends DFUser {
    constructor(id, firstName, lastName, email, courses) {
        super(id, firstName, lastName, email, courses);
        DFUser.users.push(this);
    }
}

class Course {
    constructor(courseCode, courseName, students, instructor, sectionTimes, discussion) {
        this.courseCode = courseCode; //String
        this.courseName = courseName; //String
        this.students = students; //Array of DFStudent
        this.instructor = instructor; //String
        this.sectionTimes = sectionTimes; //Array of Strings
        this.discussion = discussion; //URL to discussion form
    }
}




class DiscussionPost {

    //PRIVATE - Don't use constructor
    constructor(replyID, date, userID, postText) {
        this.postID = DiscussionPost.numOfPosts++; //Int - ID of this DiscussionPost
        this.replyID = replyID; //Int - ID of the DiscussionPost that this DiscussionPost is replying to
        this.date = date; //Date this DiscussionPost was posted
        this.userID = userID; //DFStudent/Instructor Object
        this.postText = postText; //String

        DiscussionPost.allPosts.push(this);
    }

    static getSortedChildrenForPost(postID) {

        const children = [];

        for (let i = 0; i < DiscussionPost.allPosts.length; i++) {
            if (DiscussionPost.allPosts[i].replyID === postID) {
                children.push(DiscussionPost.allPosts[i]);
            }
        }

        if (children.length === 0)
            return null;

        return children.sort((child1, child2) => child1.date - child2.date);
    }

    static createPost(replyID, date, userID, postText) {
        return new DiscussionPost(replyID, date, userID, postText);
    }
}

//Static Variable
DiscussionPost.allPosts = [];
DiscussionPost.numOfPosts = 0;

//GET USER, POSTS, COURSES FROM SERVER
//GET USER, POSTS, COURSES FROM SERVER
//GET USER, POSTS, COURSES FROM SERVER
//GET USER, POSTS, COURSES FROM SERVER
//GET USER, POSTS, COURSES FROM SERVER
//GET USER, POSTS, COURSES FROM SERVER
//LOGIN VERIFICATION FROM SERVER!

const rossGeller = new Instructor("Ross", "Geller", "Ross.Geller@gmail.com", []);
const joeyTribbiani = new DFStudent('Joey', 'Tribbiani', 'Joey.Tribiani@outlook.com', 4, [], [], "Computer Science");
const rachelGreen = new DFStudent('Rachel', 'Green', 'Rachel.Green@outlook.com', 3, [], [], "Computer Science");
const chandlerBing = new DFStudent('Chandler', 'Bing', 'Chandler.Bing@outlook.com', 3, [], [], "Computer Science");
const tom = new DFStudent('Tom', 'Dolezal', 'tom@mail.com', 1, [], [], 'math');
const marina = new DFStudent('Marina', 'Konstantin', 'marina@mail.com', 2, [], [], 'Computer Science');
const andres = new DFStudent('Andres', 'Mejia', 'andres@mail.com', 3, [], [], 'Computer Science');
const ajia = new DFStudent('Ajia', 'Tian', 'ajia@mail.com', 4, [], [], 'Computer Science');

const dfstudents = [joeyTribbiani, rachelGreen, chandlerBing, tom, marina, andres, ajia];

const csc309 = new Course('CSC309', 'Web Programming', dfstudents, rossGeller, ["Tuesday 3pm - 4pm", "Wednesday 3pm - 4pm"], "idk url test lol");
rossGeller.courses.push(csc309);
joeyTribbiani.courses.push(csc309);
rachelGreen.courses.push(csc309);
chandlerBing.courses.push(csc309);

tom.courses.push(csc309);
marina.courses.push(csc309);
andres.courses.push(csc309);
ajia.courses.push(csc309);

const discussionForumCurrentUser = chandlerBing;

DiscussionPost.createPost(null, new Date(2018, 10, 1, 0, 0, 0, ), rachelGreen.id, "Hey everyone! Hope we have a good semester together!");
DiscussionPost.createPost(null, new Date(2018, 10, 1, 1, 0, 0, 0), joeyTribbiani.id, "CSC309 Scares me... pls help");
DiscussionPost.createPost(0, new Date(2018, 10, 1, 3, 0, 0, 0), joeyTribbiani.id, "Can't wait to work with you!");
DiscussionPost.createPost(2, new Date(2018, 10, 1, 4, 0, 0, 0), rachelGreen.id, "You too! :)");
DiscussionPost.createPost(1, new Date(2018, 10, 1, 5, 0, 0, 0), rachelGreen.id, "I can tutor you in it! Message me on Class Meets!");
