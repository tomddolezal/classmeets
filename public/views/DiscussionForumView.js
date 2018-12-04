
//IDs
const discussionForumID = 'discussionForum';
const discussionForumHeaderID = 'discussionForumHeader';
const discussionForumHeaderCourseNameID = 'discussionForumHeader-CourseName';
const discussionForumHeaderCourseInstructorID = 'discussionForumHeader-CourseInstructor';
const discussionPostSectionID = 'discussionPostSection';
const submitNewDiscussionPostSectionID = 'submitNewDiscussionPostSection';
const discussionPostNewPostTextAreaID = 'discussionPostNewPostTextArea';
const discussionPostNewPostSubmitID = 'discussionPostNewPostSubmit';

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

//Dynamic IDs
function generateDiscussionPostID(postID) { return 'discussionPost-' + postID;}
function generateDiscussionPostReplyID(postID) {return 'discussionPostReply-' + postID;}
function generateDiscussionPostContentID(postID) {return 'discussionPostContent-' + postID;}
function generateDiscussionPostFormDivID(postID) {return 'form-' + postID;}
function generateDiscussionPostTextAreaID(postID) {return 'textArea-' + postID;}
function generateDiscussionPostSubmitID(postID) {return 'submit-' + postID;}
function generateDiscussionPostUserID(postID, userID) {return 'user-' + postID + '-' + userID;}

//GET USER, POSTS, COURSES FROM SERVER

class DiscussionForumView {
    constructor(element, cleaner) {
        this.element = element;
        this.cleaner = cleaner;
        this._attachEventHandler();

        const discussionForumDiv = document.querySelector('[data-hook="discussionForumPage');
        const discussionForumHeader = createDiscussionForumHeader(csc309);
        const discussionForumNewPostSection = createDiscussionForumNewPostSection();
        const discussionForumPostSection = createDiscussionPostSection(DiscussionPost.allPosts);


        discussionForumDiv.appendChild(discussionForumHeader);
        discussionForumDiv.appendChild(discussionForumNewPostSection);
        discussionForumDiv.appendChild(discussionForumPostSection);

        //This is to fix a bug that wouldn't allow addReply to be fired off when the input button was clicked
        //Even though it was assigned an even listener in 'createDiscussionPost(post)'
        const submitButtons = discussionForumDiv.querySelectorAll('input');
        for (let i = 1; i < submitButtons.length; i++)
            submitButtons[i].addEventListener('click', addReply);
    }

    _attachEventHandler() {
        const self = this;
        this.element.onclick = event => {
            event.preventDefault();
            self.cleaner.clean();
            document
                .querySelector('[data-hook="discussionForumPage"]')
                .classList.remove("hidden");
        };
    }

    hide() {
        document
            .querySelector('[data-hook="discussionForumPage"]')
            .classList.add("hidden");
    }
}


//Main Function
function generateDiscussionForumHTML(course, posts) {
    const discussionForumPage = document.createElement('div');
    discussionForumPage.setAttribute('data-hook', 'discussionForumPage');
    discussionForumPage.className = 'hidden center';

    const discussionForumHeader = createDiscussionForumHeader(course);
    const discussionForumNewPostSection = createDiscussionForumNewPostSection();
    const discussionForumPostSection = createDiscussionPostSection(posts);

    discussionForumPage.appendChild(discussionForumHeader);
    discussionForumPage.appendChild(discussionForumNewPostSection);
    discussionForumPage.appendChild(discussionForumPostSection);


    //This is to fix a bug that wouldn't allow addReply to be fired off when the input button was clicked
    //Even though it was assigned an even listener in 'createDiscussionPost(post)'
    for (let i = 1; i < document.querySelectorAll('input').length; i++)
        document.querySelectorAll('input')[i].addEventListener('click', addReply);

    return discussionForumPage;
}



//Element Creating Functions
function createDiscussionForumHeader(course) {
    const discussionForumHeaderDiv = document.createElement('section');
    discussionForumHeaderDiv.id = discussionForumHeaderID;
    discussionForumHeaderDiv.innerHTML =
        '<img src=\'resources/ClassMeetsLogo.png\' width="600px"/>' +

        '<div id="discussionForumHeaderTitle">' +
        '<div id=\''+ discussionForumHeaderCourseNameID +'\'>' +
        '<h2>' + course.courseCode + ' - ' + course.courseName + '</h2>' +
        '</div>' +

        '<div id=\'' + discussionForumHeaderCourseInstructorID + '\'>' +
        '<h4>' + course.instructor.fullName + '</h4>' +
        '</div>' +
        '</div>';

    return discussionForumHeaderDiv;
}


function createDiscussionPost(post) {

    if (post === null)
        return null;

    const postID = post.postID;
    const postDate = post.date.toDateString() + " " + post.date.toLocaleTimeString();
    const user = DFUser.getUserByID(post.userID);
    const children = DiscussionPost.getSortedChildrenForPost(postID);
    const childrenPost = (children|| []).map(childPost => createDiscussionPost(childPost))
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
    postContainerDiv.innerHTML =
        '<div class=\'' + discussionPostContentClass + '\' id=\'' + generateDiscussionPostContentID(postID) + '\'>' +
        '<div class=\'' + discussionPostContentHeader + '\'>' +
        '<div class=\'' + discussionPostContentPictureClass + '\'>' +
        '<img src=\'' + user.profilePicturePath + '\' width="50" height="50">' +
        '</div>' +

        '<div class=\'' + discussionPostContentFullNameClass + '\'\'>' +
        '<b>' +
        user.fullName +
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



function createDiscussionPostSection(posts) {
    const originalPosts = posts.sort((post1, post2) => post1.date - post2.date)
        .filter(post => post.replyID === null);

    const originalPostTags = originalPosts.map(post => createDiscussionPost(post));
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
    const user = discussionForumCurrentUser;
    const replyID = parseInt(submitButton.id.split('-')[1]);
    const textArea = document.querySelector('#' + generateDiscussionPostTextAreaID(replyID));
    const postText = textArea.value;
    const date = new Date();
    const postBeingRepliedTo = document.querySelector('#' + generateDiscussionPostReplyID(replyID));
    const post = DiscussionPost.createPost(replyID, date, user.id, postText);
    const postTag = createDiscussionPost(post);
    textArea.value = '';
    postBeingRepliedTo.appendChild(postTag);
}

function addNewPost(e) {
    e.preventDefault();
    const user = discussionForumCurrentUser;
    const textArea = document.querySelector('#' + discussionPostNewPostTextAreaID);
    const postText = textArea.value;
    const date = new Date();
    const post = DiscussionPost.createPost(null, date, user.id, postText);
    const postSection = document.querySelector('#' + discussionPostSectionID);
    const postTag = createDiscussionPost(post);
    textArea.value = '';
    postSection.appendChild(postTag);
}