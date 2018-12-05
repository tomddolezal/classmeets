// App javascript
let signedInUser;
let allStudents;
let courseView;
let profileView;
let discussionForumView;

const views = [];
class Cleaner {
  constructor(views) {
    this.views = views;
  }
  addView(view) {
    this.views.push(view);
  }

  clean() {
    this.views.forEach(view => view.hide());
  }
}

const cleaner = new Cleaner(views);

const signup = new SignupView(
  document.querySelector('[data-hook="signupButton"]'),
  cleaner
);

const login = new LoginView(
  document.querySelector('[data-hook="loginButton"]'),
  cleaner
);

cleaner.addView(login);
cleaner.addView(signup);

// Register new user.
document.querySelector('[data-hook="registerNewUser"]').onclick = event => {
  event.preventDefault();

  const name = document.querySelector("#registerName").value;
  const program = document.querySelector("#registerProgram").value;
  const year = Number(document.querySelector("#sel1").value);
  const pWord = document.querySelector("#registerPwd").value;
  if (pWord.length < 6) {
    alert("Password must be atleast 6 characters!");
    return;
  }
  const data = {
    email: document.querySelector("#registerEmail").value,
    password: pWord,
    isAdmin: false
  };
  //
  const request = new Request("/users", {
    method: "post",
    body: JSON.stringify(data),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json"
    }
  });

  fetch(request)
    .then(function(response) {
      if (response.status === 200) {
        return response.json();
      }
    })
    .then(function(data) {
      const studentdata = {
        name: name,
        program: program,
        year: year,
        account: data._id
      };
      const createStudent = new Request("/students", {
        method: "post",
        body: JSON.stringify(studentdata),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
        }
      });
      fetch(createStudent)
        .then(res => {
          if (res.status === 200) {
            alert("Welcome " + name + ", you make now log in");
            cleaner.clean();
            document.querySelector("#loginPage").classList.remove("hidden");
          } else {
            alert("Could not create student");
          }
        })
        .catch(error => {
          console.log(error);
        });
    })
    .catch(error => {
      console.log(error);
    });
};

// Logout
document.querySelector('[data-hook="logoutButton"]').onclick = e => {
  e.preventDefault();
  const url = "/users/logout";
  fetch(url)
    .then(res => {
      if (res.status === 200) {
        signedInUser = undefined;
        document
          .querySelectorAll(".notSignedIn")
          .forEach(el => el.classList.remove("hidden"));
        document
          .querySelectorAll(".signedIn")
          .forEach(el => el.classList.add("hidden"));
        cleaner.clean();
        document
          .querySelector('[data-hook="user_content"]')
          .classList.add("hidden");
        setTimeout(() => {
          alert("Successfully Signed Out");
        }, 50);
      } else {
        alert("Could not sign out");
      }
    })
    .catch(error => {
      console.log(error);
    });
};
//Log in User code
document.querySelector('[data-hook="loginUser"]').onclick = e => {
  e.preventDefault();
  let data = {
    email: document.querySelector("#loginemail").value,
    password: document.querySelector("#logInpwd").value
  };

  const request = new Request("/users/login", {
    method: "post",
    body: JSON.stringify(data),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json"
    }
  });
  fetch(request)
    .then(function(res) {
      if (res.status === 200) {
        return res.json();
      } else {
        alert("Invalid Login");
      }
    })
    .then(json => {
      signup.hide();
      login.hide();
      document
        .querySelectorAll(".notSignedIn")
        .forEach(el => el.classList.add("hidden"));
      document
        .querySelectorAll(".signedIn")
        .forEach(el => el.classList.remove("hidden"));
      signIn();
    })
    .catch(error => {
      alert("Invalid Login");
    });
};

function signIn() {
  allStudents = getAllStudents();
  const url = "/student/";
  fetch(url)
    .then(res => {
      if (res.status === 200) {
        return res.json();
      } else {
        alert("Could not find student");
      }
    })
    .then(json => {
      signedInUser = json[0];
      profileView = new ProfileView(
        document.querySelector('[data-hook="myProfile"]'),
        cleaner
      );
      courseView = new CoursesView(
        document.querySelector('[data-hook="courses"]'),
        cleaner
      );
      discussionForumView = new DiscussionForumView(
        document.querySelector('[data-hook="discussionForum"]'),
        cleaner
      );

      cleaner.addView(discussionForumView);
      cleaner.addView(courseView);
      cleaner.addView(profileView);

      console.log("SIGN IN FROM " + signedInUser.name);
      window.onbeforeunload = function() {
        return "You work will be lost.";
      };
    })
    .catch(error => {
      console.log(error);
    });
}

function getAllStudents() {
  let students = [];
  //
  fetch("/students/")
    .then(function(res) {
      if (res.status === 200) {
        return res.json();
      } else {
        alert("Invalid Login");
      }
    })
    .then(json => {
      students = json.students;
    })
    .catch(error => {
      alert("Invalid Login");
    });
  return students;
}
