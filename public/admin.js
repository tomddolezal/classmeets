fetch("/students/")
  .then(function(res) {
    if (res.status === 200) {
      return res.json();
    } else {
      alert("Bad request");
    }
  })
  .then(json => {
    students = json.forEach(student => {
      console.log(student);
      const studentEl = document.createElement("a");
      studentEl.className = "list-group-item student";
      studentEl.id = student._id;
      studentEl.innerHTML = student.name + " - " + student.program;
      studentEl.onclick = removeAbleStudent;
      document.querySelector("#studentList").appendChild(studentEl);
    });
  })
  .catch(error => {
    console.log(error);
  });

document.querySelector("#removeStudent").onclick = event => {
  event.preventDefault();
  document.querySelectorAll(".active").forEach(studentElement => {
    const id = studentElement.id;
    const request = new Request("/student/" + id, {
      method: "delete",
      body: JSON.stringify({}),
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json"
      }
    });
    fetch(request)
      .then(res => {
        if (res.status === 200) {
          return res.json();
        } else {
          alert("Deletion error");
        }
      })
      .then(json => {
        console.log(json);
        studentElement.parentNode.removeChild(studentElement);
      })
      .catch(error => {
        alert("Invalid Login");
      });
  });
};

removeAbleStudent = event => {
  event.preventDefault();
  document
    .querySelectorAll(".student")
    .forEach(studentElement => studentElement.classList.remove("active"));
  event.target.classList.add("active");
};

// Logout
document.querySelector('[data-hook="logoutButton"]').onclick = e => {
  e.preventDefault();
  const url = "/users/logout";
  fetch(url)
    .then(res => {
      if (res.status === 200) {
        window.location = "/";
      } else {
        alert("Could not sign out");
      }
    })
    .catch(error => {
      console.log(error);
    });
};
