class NotFound extends Error {
  constructor(message = 'Искомый объект не найден') {
    super(message);
    this.statusCode = 404;
    this.name = this.constructor.name;
  }
}

module.exports = NotFound;
