class CoursesView {
  constructor(element, cleaner) {
    this.element = element;
    this.cleaner = cleaner;
    this._attachEventHandler();
  }

  _attachEventHandler() {
    const self = this;
    this.element.onclick = event => {
      event.preventDefault();
      self.cleaner.clean();
      document
        .querySelector('[data-hook="courses_page"]')
        .classList.remove("hidden");
      document.querySelector('[data-hook="courses_page"]').innerHTML = `<div>
      <h2>Add a Course:</h2>
      <form class="form-inline">
      <div class="form-group">
        <label for="course">Course Code:</label>
        <input type="text" class="form-control" id="course">
      </div>
      <div class="form-group">
      <label for="cName">Course Name:</label>
      <input type="text" class="form-control" id="cName">
      </div>
      <div class="form-group">
      <label for="instructor">Instructor:</label>
      <input type="text" class="form-control" id="instructor">
      </div>
      <button type="submit" class="btn btn-default" id="add_course" >Add Course</button>
    </form>
    <h2>Add an Assignment:</h2>
<form class="form-inline">
<div class="form-group">
  <label for="course">Course:</label>
  <input type="text" class="form-control" id="assCourse">
</div>
<div class="form-group">
<label for="assName">Name:</label>
<input type="text" class="form-control" id="assName">
</div>
<div class="form-group">
<label for="assDue">Due:</label>
<input type="text" class="form-control" id="assDue">
</div>
<button type="submit" class="btn btn-default" id="add_ass" >Add Assignment</button>
</form>
<h2>Current U of T Courses</h2>
<table class="table table-striped table-condensed">
  <thead>
    <tr>
      <th>Course Code</th>
      <th>Course Name</th>
      <th>Instructor</th>
      <th>Assignments</th>
    </tr>
  </thead>
  <tbody data-hook="courseList">
  </tbody>
</table>
`;
      addAllCourses();
      document.querySelector("#add_course").onclick = addCourse;
      document.querySelector("#add_ass").onclick = addAssignment;
      document
        .querySelectorAll("course_assignment")
        .forEach(assignment => new AssignmentView(assignment, cleaner));
    };
  }

  hide() {
    document
      .querySelector('[data-hook="courses_page"]')
      .classList.add("hidden");
  }
}
function addAssignment(e) {
  e.preventDefault();
  const code = document.querySelector("#assCourse").value;
  const name = document.querySelector("#assName").value;
  const due = document.querySelector("#assDue").value;

  const request = new Request("/assignments", {
    method: "post",
    body: JSON.stringify({
      code: code,
      name: name,
      due: due
    }),
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
        console.log("Error adding assignment");
      }
    })
    .then(json => {
      const newAss = document.createElement("button");
      newAss.innerHTML =
        `<button type="button" class="btn-link course_assignment">
        ` +
        json.name +
        `
      </button>`;
      document.querySelector("#ass" + json.code).appendChild(newAss);
      new AssignmentView(newAss, cleaner);
    })
    .catch(error => {
      alert("Invalid Assignment");
    });
}
function addCourse(e) {
  e.preventDefault();
  const code = document.querySelector("#course").value;
  const instructorName = document.querySelector("#instructor").value;
  const courseName = document.querySelector("#cName").value;

  console.log(code);
  const request = new Request("/courses", {
    method: "post",
    body: JSON.stringify({
      code: code,
      name: courseName,
      instructor: instructorName
    }),
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
        console.log("Error adding course");
      }
    })
    .then(json => {
      const newCourse = document.createElement("tr");
      newCourse.innerHTML =
        `<td>` +
        json.code +
        `</td>
        <td>` +
        json.name +
        `</td>
      <td>` +
        json.instructor +
        `</td>
      <td class="info" id="` +
        "ass" +
        json.code +
        `">
      </td>`;
      document.querySelector('[data-hook="courseList"]').appendChild(newCourse);
    })
    .catch(error => {
      console.log(error);
      alert("Invalid Course");
    });
}

function addAllCourses() {
  courses = [];
  fetch("/courses")
    .then(function(res) {
      if (res.status === 200) {
        return res.json();
      } else {
        console.log("Error adding course");
      }
    })
    .then(json => {
      json.courses.forEach(course => {
        fetch("/assignments/" + course.code)
          .then(res => {
            if (res.status === 200) {
              return res.json();
            } else {
              console.log("Error loading course");
            }
          })
          .then(json => {
            const code = "ass" + course.code;
            const newCourse = document.createElement("tr");
            newCourse.innerHTML =
              `<td>` +
              course.code +
              `<td>` +
              course.name +
              `</td><td>` +
              course.instructor +
              `</td><td class="info" id="` +
              code +
              `">` +
              ` </td>`;
            document
              .querySelector('[data-hook="courseList"]')
              .appendChild(newCourse);

            json.forEach(a => {
              const newAss = document.createElement("button");
              newAss.innerHTML =
                '<button type="button" class="btn-link course_assignment">' +
                a.name +
                "</button>";
              document.querySelector("#" + code).appendChild(newAss);
              new AssignmentView(newAss, cleaner);
            });
          });
      });
    })
    .catch(error => {
      console.log(error);
      alert("Invalid Course");
    });
}
