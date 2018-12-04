class AssignmentView {
  constructor(element, cleaner) {
    cleaner.addView(this);
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
        .querySelector('[data-hook="assignmentPage"]')
        .classList.remove("hidden");
    };
  }

  hide() {
    document
      .querySelector('[data-hook="assignmentPage"]')
      .classList.add("hidden");
  }
}

const students = [];
const assignments = [];

class Assignment {
  constructor(course, part, date) {
    this.course = course;
    this.part = part;
    this.date = date;
    this.student = students;
  }
}

class Student {
  constructor(name, program, year, ref) {
    this.name = name;
    this.program = program;
    this.year = year;
    this.ref = ref;
    this.icon = null;
  }
}

students.push(new Student("Tom", "math", "1", ""));
students.push(new Student("Andres", "arts", "2", ""));
students.push(new Student("Marina", "cs", "3", "./ProfileView.html"));
students[2].icon = "./resources/kendall.jpg";

assignments.push(new Assignment("CSC321", "Assignment 1", "Nov 21"));

const studentAddform = document.querySelector("#studentAddForm");
studentAddform.addEventListener("submit", addStudentToStudentList);

function addStudentToStudentList(e) {
  e.preventDefault();
  const stuName = document.querySelector("#newStudentName").value;
  const stu = new Student(stuName, "N/A", 0, "");
  students.push(stu);
  addStudentToTable(stu);
}

function addStudentToTable(student) {
  const stuTable = document.querySelector("#studentList");
  const tableRow = document.createElement("tr");
  const stuName = document.createElement("td");
  var stuIcon = document.createElement("img");
  if (student.icon == null) {
    stuIcon.src = "./resources/assignment_ini.jpg";
    stuIcon.alt = "icon";
    stuIcon.style =
      "margin-top:10px;margin-left:10px;margin-right:10px;height:60px;width:60px;border-radius:50%;border:solid grey;";
  } else {
    stuIcon.src = student.icon;
    stuIcon.alt = "icon";
    stuIcon.style =
      "margin-top:10px;margin-left:10px;margin-right:10px;height:60px;width:60px;border-radius:50%;border:solid grey;";
  }
  const link = document.createElement("a");
  link.href = student.ref;
  const nameText = document.createTextNode(student.name);
  const stuProg = document.createElement("td");
  const progText = document.createTextNode(student.program);
  const stuYear = document.createElement("td");
  const yearText = document.createTextNode(student.year);
  link.appendChild(nameText);
  stuName.appendChild(stuIcon);
  stuName.appendChild(link);
  console.log(stuName);
  tableRow.appendChild(stuName);
  stuProg.appendChild(progText);
  tableRow.appendChild(stuProg);
  stuYear.appendChild(yearText);
  tableRow.appendChild(stuYear);
  stuTable.appendChild(tableRow);
}

addStudentToTable(students[0]);
addStudentToTable(students[1]);
addStudentToTable(students[2]);
