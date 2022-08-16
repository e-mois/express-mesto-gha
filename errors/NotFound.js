class NotFound extends Error {
  constructor(status = 404, message = 'Искомый объект не найден') {
    super(message);
    this.status = status;
    this.name = this.constructor.name;
  }
}

module.exports = NotFound;
