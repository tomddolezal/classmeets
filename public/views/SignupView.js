class SignupView {
  constructor(element, cleaner) {
    this.element = element;
    this.cleaner = cleaner;
    this._attachEventHandler();
  }
  _attachEventHandler() {
    const self = this;
    this.element.onclick = event => {
      self.cleaner.clean();
      document.querySelector("#signUpForm").classList.remove("hidden");
      event.preventDefault();
    };
  }
  hide() {
    document.querySelector("#signUpForm").classList.add("hidden");
  }
}

class User {
  constructor(name, email, password, program, year) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.program = program;
    this.year = year;
    this.assignments = [];
  }
  addAssignment(assignment) {
    this.assignments.push(assignment);
  }
}
