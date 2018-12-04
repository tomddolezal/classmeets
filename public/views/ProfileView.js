class ProfileView {
  constructor(element, cleaner) {
    this.cleaner = cleaner;
    this.element = element;
    this._attachEventHandler();
  }
  _attachEventHandler() {
    const self = this;
    this.element.onclick = event => {
      self.cleaner.clean();
      document.querySelector("#ProfileViewEl").classList.remove("hidden");
      event.preventDefault();
    };
  }
  hide() {
    document.querySelector("#ProfileViewEl").classList.add("hidden");
  }
}

//GET FROM SERVER
const events = [];
const assignements = [];

class Assignement {
  constructor(name, date, course, percent) {
    this.name = name;
    this.date = date;
    this.course = course;
    this.percent = percent;
  }
}

class EventTimetable {
  constructor(name, startTime, endTime, day) {
    this.name = name;
    this.startTime = startTime;
    this.endTime = endTime;
    this.day = day;
  }
}

class Profile {
  constructor(name, picture, major, year) {
    this.name = name;
    this.picture = picture;
    this.major = major;
    this.year = year;
  }
}

assignements.push(new Assignement("A1", "Oct 20 2018", "CSC309", "80"));
events.push(new EventTimetable("CSC309", "13", "15", "monday"));
//GET FROM SERVER
const profileInfo = new Profile(
  "Marina Konstantin",
  "./resources/kendall.jpg",
  "Computer Science",
  "3rd year"
);

const aForm = document.querySelector("#addAForm");
const courseForm = document.querySelector("#courseForm");
const aTable = document.querySelector("#assTable");

courseForm.addEventListener("submit", addCourseToTimetable);

const studentForm = document.querySelector("#addForm");
studentForm.addEventListener("submit", addAssignmentToList);

//initialise profile info
const name = document.querySelector("#profileName");
name.childNodes[0].nodeValue = profileInfo.name;
const major = document.querySelector("#profileMajor");
major.childNodes[0].nodeValue = profileInfo.major;
const year = document.querySelector("#profileYear");
year.childNodes[0].nodeValue = profileInfo.year;
const picture = document.querySelector("#profilePhoto");
picture.setAttribute("src", profileInfo.picture);

function addAssignmentToList(e) {
  e.preventDefault();
  const aName = document.querySelector("#aName").value;
  const aDate = document.querySelector("#aDate").value;
  const aCourse = document.querySelector("#aCourse").value;
  const aPercent = document.querySelector("#aPercent").value;

  const assignement = new Assignement(aName, aDate, aCourse, aPercent);
  assignements.push(assignement);

  addAssignementToList(assignement);
}

function addCourseToTimetable(e) {
  e.preventDefault();
  const courseName = document.querySelector("#courseFullName").value;
  const courseDay = document.querySelector("#courseDay").value;
  const start = document.querySelector("#start").value;
  const end = document.querySelector("#end").value;

  const event = new EventTimetable(courseName, start, end, courseDay);
  events.push(event);

  addCourseToTimeTable(event);
}

function addAssignementToList(Assignement) {
  const rowElement = document.createElement("tr");

  const nameElement = document.createElement("th");
  const dateElement = document.createElement("th");
  const percentElement = document.createElement("th");
  const courseElement = document.createElement("th");

  const aLink = document.createElement("a");
  const courseLink = document.createElement("a");

  aLink.setAttribute("href", "#");
  courseLink.setAttribute("href", "#");

  aLink.appendChild(document.createTextNode(Assignement.name));
  courseLink.appendChild(document.createTextNode(Assignement.course));

  nameElement.className = "tableText";
  nameElement.id = "assName";
  dateElement.className = "tableText";
  dateElement.id = "dueDate";
  courseElement.className = "tableText";
  courseElement.id = "courseName";
  percentElement.className = "tableText";
  percentElement.id = "progress";

  nameElement.appendChild(aLink);
  dateElement.appendChild(document.createTextNode(Assignement.date));
  courseElement.appendChild(courseLink);
  new AssignmentView(courseLink, cleaner);
  percentElement.appendChild(
    document.createTextNode(Assignement.percent + "%")
  );

  rowElement.appendChild(dateElement);
  rowElement.appendChild(nameElement);
  rowElement.appendChild(courseElement);
  rowElement.appendChild(percentElement);

  aTable.appendChild(rowElement);
}

function addCourseToTimeTable(event) {
  //find cell times
  const start = parseInt(event.startTime);
  const end = parseInt(event.endTime);
  //document.body.innerHTML = start;
  const days = document.getElementsByClassName(event.day);
  [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
  const times = [];
  for (i = start; i <= end; i++) {
    times.push(days[i - 9]);
  }
  for (i = 0; i < times.length; i++) {
    const name = document.createTextNode(event.name);
    times[i].appendChild(name);
    times[i].className = "used";
  }
}
for (let i = 0; i < assignements.length; i++) {
  addAssignementToList(assignements[0]);
}
for (let i = 0; i < events.length; i++) {
  addCourseToTimeTable(events[0]);
}
