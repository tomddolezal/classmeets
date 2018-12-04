class LoginView {
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
      document.querySelector("#loginPage").classList.remove("hidden");
    };
  }
  hide() {
    document.querySelector("#loginPage").classList.add("hidden");
  }
}
