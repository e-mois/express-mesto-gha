class NotFound extends Error {
  constructor(status = 404, message = 'Искомый объект не найден') {
    super();
    this.status = status;
    this.message = message;
    this.name = this.constructor.name;
  }
}

module.exports = NotFound;
