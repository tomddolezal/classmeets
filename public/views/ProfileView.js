let profileInfo;
let assignements;
let events;
class ProfileView {
  constructor(element, cleaner) {
    this.cleaner = cleaner;
    this.element = element;
    this._attachEventHandler();

    profileInfo = new Profile(signedInUser.name, null, signedInUser.program, signedInUser.year);

      //initialise profile info
      const name = document.querySelector("#profileName");
      name.childNodes[0].nodeValue = profileInfo.name;
      const major = document.querySelector("#profileMajor");
      major.childNodes[0].nodeValue = profileInfo.major;
      const year = document.querySelector("#profileYear");
      year.childNodes[0].nodeValue = "Year " + profileInfo.year ;
      const picture = document.querySelector("#profilePhoto");
      picture.setAttribute("src", "/resources/User_Avatar_2.png");

      events = signedInUser.events;
      assignements = signedInUser.assignments;
    
      //Initialise the already given assignements and events
      for (let i = 0; i < assignements.length; i++) {
        
        fetch("/profile/getAssign/" + assignements[i])
        .then(function(response) {
          return response.json();
        })
        .then( json => {
          let assignement = new Assignement(json[0].name, json[0].due, json[0].code, json[0].percent);
          addAssignementToList(assignement)
        })
        .catch(error => console.error('Error:', error));
      } 

      for (let i = 0; i < events.length; i++) {

        fetch("/profile/getEvent/" + events[i])
        .then(function(response) {
          return response.json();
        })
        .then( json => {
          
          let event = new EventTimetable(json[0].code, json[0].start, json[0].end, json[0].day, json[0].color);
          addCourseToTimeTable(event)
        })
        .catch(error => console.error('Error:', error));
        //console.log(events[i]);
      }
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


class Assignement {
  constructor(name, date, course, percent) {
    this.name = name;
    this.date = date;
    this.course = course;
    this.percent = percent;
  }
}

class EventTimetable {
  constructor(name, startTime, endTime, day, color) {
    this.name = name;
    this.start = startTime;
    this.end = endTime;
    this.day = day;
    this.color = color;
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


//Initialize event listeners
const courseForm = document.querySelector("#courseForm");
const studentForm = document.querySelector("#addForm");

const aTable = document.querySelector("#assTable");

const deleteCourse = document.querySelector("#deleteC");
const deleteA = document.querySelector("#deleteA");

courseForm.addEventListener("submit", addCourseToTimetable);
studentForm.addEventListener("submit", addAssignmentToList);
deleteCourse.addEventListener("click", deleteCourseFromList);
deleteA.addEventListener("click", deleteAssignmentFromList);


/**
 * Adds new Assignement to database for student
 * @param {*} e 
 */
function addAssignmentToList(e) {
  e.preventDefault();
  const aName = document.querySelector("#aName").value;
  const aDate = document.querySelector("#aDate").value;
  const aCourse = document.querySelector("#aCourse").value;
  const aPercent = document.querySelector("#aPercent").value;
  const assignement = new Assignement(aName, aDate, aCourse, aPercent);

  let assignObj = {
    code : aCourse,
    due: aDate,
    name: aName,
    percent: aPercent,
    student: signedInUser._id
  }

  const request = new Request("/profile/addAssign", {
    method: "post",
    body: JSON.stringify(assignObj),
    headers: {
      Accept: "application/json, text/plain, ",
      "Content-Type": "application/json"
    }
  });

  fetch(request)
  .then(addAssignementToList(assignement))
  .catch(error => alert(error.name));

}

/**
 * Deletes selected course from database of student
 * @param  e 
 */
function deleteCourseFromList(e){
  console.log("DELETEING FROM DB");
  e.preventDefault();
  const name = document.querySelector("#courseFullName").value;
  const day = document.querySelector("#courseDay").value;
  const start = document.querySelector("#start").value;
  const end = document.querySelector("#end").value;
  const color = document.querySelector('#color').value;

  //create new event with given info
  const event = new EventTimetable(name, start, end, day, color);
  console.log("HI "+ event);
  //Add new event to students event array in database
  let eventObj = {
    code: name,
    day: day,
    start:start,
    end: end,
    color: color,
    student: signedInUser._id
  };
  const request = new Request("/profile/deleteCourse", {
    method: "delete",
    body: JSON.stringify(eventObj),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json"
    }
  });

  fetch(request)
  .then(
    deleteCourseFromTimeTable(event)
  )
  .catch(error => alert(error.name));
}

function deleteAssignmentFromList(e){
  console.log("DELETEING FROM DB Assign");
  e.preventDefault();
  const aName = document.querySelector("#aName").value;
  const aDate = document.querySelector("#aDate").value;
  const aCourse = document.querySelector("#aCourse").value;
  const aPercent = document.querySelector("#aPercent").value;
  const assignement = new Assignement(aName, aDate, aCourse, aPercent);

  //Add new event to students event array in database
  let assignObj = {
    code : aCourse,
    due: aDate,
    name: aName,
    percent: aPercent,
    student: signedInUser._id
  }

  const request = new Request("/profile/deleteAssign", {
    method: "delete",
    body: JSON.stringify(assignObj),
    headers: {
      Accept: "application/json, text/plain, ",
      "Content-Type": "application/json"
    }
  });

  fetch(request)
  .then(deleteAssignementFromDOM(assignement))
  .catch(error => console.error('Error:', error));

}
/**
 * Deletes course from timetable
 * @param {*} e 
 */
function deleteCourseFromTimeTable(event){
  console.log("Delete:" + event);
  //find cell times
  const start = parseInt(event.start);
  const end = parseInt(event.end);
  //document.body.innerHTML = start;
  const days = document.getElementsByClassName(event.day);
  [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
  const times = [];
  for (i = start; i < end; i++) {
    times.push(days[i - 9]);
  }
  for (i = 0; i < times.length; i++) {
    times[i].removeAttribute("style");
    console.log(times[i].childNodes);
    times[i].childNodes[0].nodeValue = "";

  }
}

/**
 * Deletes row containing assignment from list
 * @param  assign 
 */
function deleteAssignementFromDOM(assign){
  //get all rows
  const rows = document.getElementsByClassName("assRow");
  //look for  chosen row to delete
  for(let i = 1; i < rows.length; i++){
    if((rows[i].childNodes[0].childNodes[0].nodeValue == assign.date)
        && ((rows[i].childNodes[1].childNodes[0].innerText) == assign.name)
        && (rows[i].childNodes[2].childNodes[0].innerText == assign.course)){
          //delete FROM DOM
          //first get parent node
          let parentNode = rows[i].parentNode;
          parentNode.removeChild(rows[i]);
        }
    
  }

}


/**
 * Adds new Course to database for student
 * @param {*} e 
 */
function addCourseToTimetable(e) {
  e.preventDefault();
  const name = document.querySelector("#courseFullName").value;
  const day = document.querySelector("#courseDay").value;
  const start = document.querySelector("#start").value;
  const end = document.querySelector("#end").value;
  const color = document.querySelector('#color').value;

  //create new event with given info
  const event = new EventTimetable(name, start, end, day, color);
  //Add new event to students event array in database
  let eventObj = {
    code: name,
    day: day,
    start:start,
    end: end,
    color: color,
    student: signedInUser._id
  };
  const request = new Request("/profile/addCourse", {
    method: "post",
    body: JSON.stringify(eventObj),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json"
    }
  });

  fetch(request)
  .then(addCourseToTimeTable(event))
  .catch(error => console.error('Error:', error));

  //adds student to newly added courses student list
  const addStudent = new Request("/courses/addStudent/" + event.name + "/"+ signedInUser._id, {
    method: "post",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json"
    }
  });

  fetch(addStudent)
  .then(console.log(addStudent))
  .catch(error => console.log('Error:'+ error));
    
    
}

/**
 * Adds Assignement To DOM
 * @param {*} Assignement 
 */
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
  percentElement.className = "percent";

  nameElement.appendChild(aLink);
  dateElement.appendChild(document.createTextNode(Assignement.date));
  courseElement.appendChild(courseLink);

  new AssignmentView(courseLink, cleaner);
  percentElement.appendChild(
    document.createTextNode(Assignement.percent + "%")
    
  );
  //percentElement.onclick = updatePercent(this);
  percentElement.setAttribute('onclick','updatePercent(this);')
  rowElement.className = "assRow";
  rowElement.appendChild(dateElement);
  rowElement.appendChild(nameElement);
  rowElement.appendChild(courseElement);
  rowElement.appendChild(percentElement);

  aTable.appendChild(rowElement);
}

function updatePercent(element){
  //get updated percent
  let percent = prompt("Enter a percent: ");
  let parentNode = element.parentNode;
  
  //update element
  element.childNodes[0].nodeValue = percent + "%";
  let percentObj ={
    due: parentNode.childNodes[0].childNodes[0].nodeValue,
    code: parentNode.childNodes[2].childNodes[0].innerText,
    name: parentNode.childNodes[1].childNodes[0].innerText,
    percent: percent,
    student: signedInUser._id
  }
  //update database
  const updatePercent = new Request("/profile/updatePercent",  {
    method: "put",
    body: JSON.stringify(percentObj),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json"
    }
  });

  fetch(updatePercent)
  .then(console.log(updatePercent))
  .catch(error => console.log("Update Error:", error));
  
}

/**
 * Adds event to timetable
 * @param {*} event 
 */
function addCourseToTimeTable(event) {
  //find cell times
  const start = parseInt(event.start);
  const end = parseInt(event.end);
  //document.body.innerHTML = start;
  const days = document.getElementsByClassName(event.day);
  [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
  const times = [];
  for (i = start; i < end; i++) {
    times.push(days[i - 9]);
  }
  for (i = 0; i < times.length; i++) {
    //check if already has an event in that place
    if(times[i].childNodes.length != 0){
      alert("Class already scheduled for that time. Please delete or choose another time");
      break;
    }
    const name = document.createTextNode(event.name);
    times[i].appendChild(name);
    if(event.color != ""){
      times[i].setAttribute("style", "background-color:"+event.color);
    }
    else{
      times[i].setAttribute("style", "background-color: #b3d9ff");
    }
  }
}


