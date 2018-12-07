const log = console.log;

//IDs
const discussionForumID = 'discussionForum';
const discussionForumHeaderID = 'discussionForumHeader';
const discussionForumHeaderCourseNameID = 'discussionForumHeader-CourseName';
const discussionForumHeaderCourseInstructorID = 'discussionForumHeader-CourseInstructor';
const discussionPostSectionID = 'discussionPostSection';
const submitNewDiscussionPostSectionID = 'submitNewDiscussionPostSection';
const discussionPostNewPostTextAreaID = 'discussionPostNewPostTextArea';
const discussionPostNewPostSubmitID = 'discussionPostNewPostSubmit';
const discussionForumCourseSelectionID = 'DF-course-selection';

//Classes
const discussionPostClass = 'discussionPost';
const discussionPostContentClass = 'discussionPostContent';
const discussionPostContentPictureClass = 'discussionPostContentPicture';
const discussionPostContentTextClass = 'discussionPostContentText';
const discussionPostContentDetailsClass = 'discussionPostContentDetails';
const discussionPostWriteReplyClass = 'discussionPostWriteReply';
const discussionPostReplyClass = 'discussionPostReply';
const discussionPostContentFullNameClass = 'discussionPostContentFullName';
const discussionPostContentHeader = 'discussionPostContentHeader';
const discussionForumCourseButtonClass = 'discussionForumCourseButton';

//Dynamic IDs
function generateDiscussionPostID(postID) { return 'discussionPost-' + postID;}
function generateDiscussionPostReplyID(postID) {return 'discussionPostReply-' + postID;}
function generateDiscussionPostContentID(postID) {return 'discussionPostContent-' + postID;}
function generateDiscussionPostFormDivID(postID) {return 'form-' + postID;}
function generateDiscussionPostTextAreaID(postID) {return 'textArea-' + postID;}
function generateDiscussionPostSubmitID(postID) {return 'submit-' + postID;}
function generateDiscussionPostUserID(postID, userID) {return 'user-' + postID + '-' + userID;}


//Data Hooks
const discussionForumMainPage = '[data-hook="discussionForumPage"]';
const discussionForumCourseSelectionPage = '[data-hook="discussionForumCourseSelection"]';
const discussionForumCoursePage = '[data-hook="discussionForumCoursePage"]';

//GET USER, POSTS, COURSES FROM SERVER

class DiscussionForumView {
    constructor(element, cleaner) {
        this.element = element;
        this.cleaner = cleaner;
        this._attachEventHandler();

        loadCourseForumSelectionPage();

        //This is to fix a bug that wouldn't allow addReply to be fired off when the input button was clicked
        //Even though it was assigned an event listener in 'createDiscussionPost(post)'
        const discussionPostSectionDiv = document.querySelector('#' + discussionPostSectionID);
        const submitButtons = discussionForumPostSectionDiv.querySelectorAll('input');
        for (let i = 1; i < submitButtons.length; i++)
            submitButtons[i].addEventListener('click', addReply);
    }

    _attachEventHandler() {
        const self = this;

        this.element.onclick = event => {
            event.preventDefault();
            self.cleaner.clean();
            document.querySelector(discussionForumMainPage).classList.remove('hidden');
            document.querySelector(discussionForumCourseSelectionPage).classList.remove('hidden');
            document.querySelector(discussionForumCoursePage).classList.add('hidden')
        };
    }

    hide() {
        document.querySelector(discussionForumMainPage).classList.add('hidden');
    }
}

function loadDiscussionPageForCourse(e) {

    let courseID = null;

    if (e instanceof Event) {
        e.preventDefault();

        const button = e.target;
        courseID = button.value;

    } else { //e is a courseID String
        courseID = e;
    }

    const discussionForumCourseSelectionPageDiv = document.querySelector(discussionForumCourseSelectionPage);
    const discussionForumCoursePageDiv = document.querySelector(discussionForumCoursePage);

    let discussionForumHeader = null;
    const discussionForumNewPostSection = createDiscussionForumNewPostSection();
    let discussionForumPostSection = null;


    const coursePromise = fetch(`/courses/${courseID}`).then(res => {
        if (res.status === 200)
            return res.json();
        else
            console.log("Error getting course with courseID");

    }).catch(error => {
        log(error);
    });


    const postsForCoursePromise = fetch(`/discussion/${courseID}`).then(res => {
        if (res.status === 200)
            return res.json();
        else
            console.log("Error getting discussion posts");

    }).then(posts => {

        posts = posts.map(post => {
            post.date = new Date(post.date);
            return post;
        });
        return posts;
    }).catch(error => {
        log(error);
    });


    Promise.all([coursePromise, postsForCoursePromise]).then(data => {
        const course = data[0];
        const posts = data[1];

        // log('data');
        // log(data);
        //
        // log('data-course');
        // log(data[0]);

        discussionForumHeader = createDiscussionForumHeader(course);
        discussionForumPostSection = createDiscussionPostSection(posts);

        discussionForumCoursePageDiv.innerHTML = ''; //Reset previous course page
        discussionForumCoursePageDiv.appendChild(discussionForumHeader);
        discussionForumCoursePageDiv.appendChild(discussionForumNewPostSection);
        discussionForumCoursePageDiv.appendChild(discussionForumPostSection);

        const submitButtons  = discussionForumPostSection.querySelectorAll('input');
        for (let i = 0; i < submitButtons.length; i++)
            submitButtons[i].addEventListener('click', addReply);

        discussionForumCourseSelectionPageDiv.classList.add('hidden');
        discussionForumCoursePageDiv.classList.remove('hidden');
    });


}


function loadCourseForumSelectionPage() {
    //helper
    function makeCourseButton(course) {
        const elementString =
            `<button class="${discussionForumCourseButtonClass}" type="button" 
             value="${course._id}">${course.code.toUpperCase()}</button>`;

        const button = convertElementStringToElement(elementString);
        button.addEventListener('click', loadDiscussionPageForCourse);

        return button;
    }

    const discussionForumCourseSelectionPageDiv = document.querySelector(discussionForumCourseSelectionPage);
    const discussionForumCoursePageDiv = document.querySelector(discussionForumCoursePage);

    discussionForumCoursePageDiv.classList.add('hidden');

    discussionForumCourseSelectionPageDiv.innerHTML = '';     //Clear previous buttons


    if (signedInUser) {
        // let courseIDs = null;

        fetch('/courses/').then(res => {

            if (res.status === 200)
                return res.json();
            else
                console.log("Error getting courses");

        }).then(json => {
            json.courses
                // .filter(course => course.students.includes(signedInUser._id))
                .forEach(course => {
                    discussionForumCourseSelectionPageDiv.appendChild(makeCourseButton(course))
                });

            // const coursesUserIsIn = courses.filter(course => course.students.includes(signedInUser._id));

            // coursesUserIsIn.forEach(course => {log('course');log(course); discussionForumCourseSelectionPageDiv.appendChild(makeCourseButton(course))});
            discussionForumCourseSelectionPageDiv.classList.remove('hidden');

        }).then(courseIDs => {
            // const courses = [];
            //
            // courseIDs.forEach(courseID => {
            //
            //     fetch(`/courses/${courseID}`).then(res => {
            //         return res.json();
            //
            //     }).then(course => {
            //         courses.push(course);
            //
            //     }).catch(error => {
            //         log(error);
            //     })
            // });
            //
            // courses.forEach(course => {log(course); discussionForumCourseSelectionPageDiv.appendChild(makeCourseButton(course))});
            //
            // discussionForumCourseSelectionPageDiv.classList.remove('hidden');
        }).catch(error => {
            console.log(error);
        });



        // const promiseArray = courseIDs.map(async courseID => {
        //     return fetch(`/courses/${courseID}`).then( res => {
        //         return res.json();
        //     }).catch(error => {
        //         log(error);
        //     })
        // });
        //
        // log('pArray');
        // log(promiseArray);
        //Populate courseButtons array with fetchedButtons
        //     courses.forEach(course => discussionForumCourseSelectionPageDiv.appendChild(makeCourseButton(course)));
        // Promise.all(promiseArray).then(courses => {
        // });

    }
}


//Element Creating Functions
function createDiscussionForumHeader(course) {
    // log('course used to make header');
    // log(course);
    const discussionForumHeaderDiv = document.createElement('section');
    discussionForumHeaderDiv.id = discussionForumHeaderID;
    discussionForumHeaderDiv.setAttribute('data-hook',  course._id);
    discussionForumHeaderDiv.innerHTML =
        '<img src=\'resources/ClassMeetsLogo.png\' width="600px"/>' +

        '<div id="discussionForumHeaderTitle">' +
        '<div id=\''+ discussionForumHeaderCourseNameID +'\'>' +
        '<h2>' + course.code + ' - ' + course.name + '</h2>' +
        '</div>' +

        '<div id=\'' + discussionForumHeaderCourseInstructorID + '\'>' +
        '<h4>' + course.instructor + '</h4>' +
        '</div>' +
        '</div>';

    return discussionForumHeaderDiv;
}


function createDiscussionPost(post, allPosts) {
    log('Attempting to create post for:');
    log(post);

    if (post === null)
        return null;

    const postID = post._id;
    const postDate = post.date.toDateString() + " " + post.date.toLocaleTimeString();


    let children = allPosts.filter(post => post.replyID === postID);

    if (children.length === 0)
        children = null;
    else
        children = children.sort((child1, child2) => child1.date - child2.date);

    const childrenPost = (children|| []).map(childPost => createDiscussionPost(childPost, allPosts))
        .filter(childPostTag => childPostTag != null)
        .map(childPostTag => convertElementToString(childPostTag))
        .join('');


    const postContainerDiv = document.createElement('div');
    postContainerDiv.id = generateDiscussionPostID(postID);
    postContainerDiv.classList.add(discussionPostClass);

    const formDivElementString =
        '<div class=\'' + discussionPostWriteReplyClass + '\' id=\'' + generateDiscussionPostFormDivID(postID) + '\'>' +
        '<textarea rows="4" cols="50" name="reply" id=\'' + generateDiscussionPostTextAreaID(postID) + '\' placeholder="Enter reply here...">' +
        '</textarea>' +
        '<input type="submit" id=\'' + generateDiscussionPostSubmitID(postID) + '\'/>' +
        '</div>';

    const formDiv = convertElementStringToElement(formDivElementString);
    const submitButton = formDiv.firstChild.nextSibling;
    const profilePicturePath = './avatars/' + post.studentName.toUpperCase()[0] + '.svg';
    postContainerDiv.innerHTML =
        '<div class=\'' + discussionPostContentClass + '\' id=\'' + generateDiscussionPostContentID(postID) + '\'>' +
        '<div class=\'' + discussionPostContentHeader + '\'>' +
        '<div class=\'' + discussionPostContentPictureClass + '\'>' +
        '<img src=\'' + profilePicturePath + '\' width="50" height="50">' +
        '</div>' +

        '<div class=\'' + discussionPostContentFullNameClass + '\'\'>' +
        '<b>' +
        post.studentName +
        '</b>' +
        '</div>' +
        '</div>' +

        '<div class=\'' + discussionPostContentTextClass + '\'>' +
        '<p>' +
        post.postText +
        '<p/>' +
        '</div>' +


        '<div class=\'' + discussionPostContentDetailsClass + '\'>' +
        postDate +
        '</div>' +

        '</div>' +

        '<div class=\'' + discussionPostReplyClass + '\' id=\'' + generateDiscussionPostReplyID(postID) + '\'>' +
        childrenPost +
        '</div>';

    //Adds formDiv to the inside of discussionPostContentClassDiv
    postContainerDiv.firstChild.appendChild(formDiv);
    submitButton.addEventListener('click', addReply);

    return postContainerDiv;
}



function createDiscussionPostSection(allPosts) {
    const originalPosts = allPosts.sort((post1, post2) => post1.date - post2.date)
        .filter(post => post.replyID === null);

    const originalPostTags = originalPosts.map(post => createDiscussionPost(post, allPosts));
    const allPostTagsHTMLString = originalPostTags.map(postTag => convertElementToString(postTag)).join('');

    const postSection = document.createElement('section');
    postSection.id = discussionPostSectionID;
    postSection.innerHTML = allPostTagsHTMLString;

    return postSection;

}



function createDiscussionForumNewPostSection() {
    const submitNewDiscussionPostSection = document.createElement('section');
    submitNewDiscussionPostSection.id = submitNewDiscussionPostSectionID;
    submitNewDiscussionPostSection.innerHTML =
        '<h3> Write a new post </h3>' +
        '<textarea rows="7" cols="50" name="reply" id=\'' + discussionPostNewPostTextAreaID + '\' placeholder="Enter new post here...">' +
        '</textarea>' +
        '<input type="submit" id=\'' + discussionPostNewPostSubmitID + '\'/>';

    const submitButton = submitNewDiscussionPostSection.querySelector('#' + discussionPostNewPostSubmitID);
    submitButton.addEventListener('click', addNewPost);

    return submitNewDiscussionPostSection
}


//Helpers
function convertElementToString(element) {
    const tempContainer = document.createElement('div');
    tempContainer.appendChild(element);
    return tempContainer.innerHTML;
}

function convertElementStringToElement(elementString) {
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = elementString;
    return tempContainer.firstChild;
}


//Callback Functions
function addReply(e) {
    e.preventDefault();
    const submitButton = e.target;

    const studentID = signedInUser._id;
    const replyID = submitButton.id.split('-')[1];
    const textArea = document.querySelector('#' + generateDiscussionPostTextAreaID(replyID));

    const postText = textArea.value;
    const date = new Date();
    const forumHeader = document.querySelector('#' + discussionForumHeaderID);
    const courseID = forumHeader.getAttribute('data-hook');

    // const post = DiscussionPost.createPost(replyID, date, user.id, postText);
    const postJSON = {
        studentName: signedInUser.name,
        replyID : replyID,
        studentID : studentID,
        courseID : courseID,
        date : date,
        postText: postText
    };

    sendPostToServer(postJSON);

    loadDiscussionPageForCourse(courseID);
}

function addNewPost(e) {
    e.preventDefault();
    const forumHeader = document.querySelector('#' + discussionForumHeaderID);
    const courseID = forumHeader.getAttribute('data-hook');
    const studentID = signedInUser._id;
    const textArea = document.querySelector('#' + discussionPostNewPostTextAreaID);
    const postText = textArea.value;
    const date = new Date();


    const postJSON = {
        studentName: signedInUser.name,
        replyID : null,
        studentID : studentID,
        courseID : courseID,
        date : date,
        postText: postText
    };

    // const postSection = document.querySelector('#' + discussionPostSectionID);
    // const postTag = createDiscussionPost(post);
    // textArea.value = '';
    // postSection.appendChild(postTag);
    sendPostToServer(postJSON);

    loadDiscussionPageForCourse(courseID);


}


function sendPostToServer(postObject) {

    const request = new Request('/discussion/', {
        method: 'post',
        body: JSON.stringify(postObject),
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
    });


    fetch(request).then(res => {
        if (res.status === 200) {
            return res.json();
        } else {
            console.log("Error adding post");
        }

    }).catch(error => {
        console.log(error);
    });
}

function getSortedChildrenForPostID(postID) {

    fetch('/discussion').then(res => {

        if (res.status === 200)
            return res.json();
        else
            console.log("Error adding post");

    }).then(json => {
        const discussionPosts = [];

        json.discussionPosts.forEach(post => {
            post.date = new Date(post.date);
            discussionPosts.push(post);
        });

        const children = discussionPosts.filter(post => post.replyID === postID);

        if (children.length === 0)
            return null;
        else
            return children.sort((child1, child2) => child1.date - child2.date);

    }).catch(error => {
        console.log(error);
    });
}