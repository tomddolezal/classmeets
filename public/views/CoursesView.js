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
      const courses = document
        .querySelector('[data-hook="courses_page"]')
        .classList.remove("hidden");
      courses.innerHTML = `<div>
<h2>Current U of T Courses</h2>
<table class="table table-striped table-condensed">
  <thead>
    <tr>
      <th>Course Code</th>
      <th>Instructor</th>
      <th>Assignments</th>
    </tr>
  </thead>
  <tbody data-hook="courseList">
    <tr>
      <td>CSC309</td>
      <td>Mark K</td>
      <td class="info">
        <button type="button" class="btn-link csc309">
          Assignment1
        </button>
      </td>
    </tr>
    <tr>
      <td>CSC148</td>
      <td>Mark K2</td>
      <td class="info">
        <button type="button" class="btn-link csc309">E1</button
        ><button type="button" class="btn-link">A2</button>
      </td>
    </tr>
    <tr>
      <td>CSC168</td>
      <td>Mark K3</td>
      <td class="info">
        <button type="button" class="btn-link csc309">A3</button>
      </td>
    </tr>
  </tbody>
</table>`;
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
