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

      document
        .querySelectorAll(".csc309")
        .forEach(assignment => new AssignmentView(assignment, cleaner));
    };
  }

  hide() {
    document
      .querySelector('[data-hook="courses_page"]')
      .classList.add("hidden");
  }
}
