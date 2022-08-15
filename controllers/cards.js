const Card = require('../models/card');
const NotFound = require('../errors/NotFound');
const STATUS_CODE = require('../errors/errorCode');

const getCards = (req, res) => {
  Card.find({})
  .then((cards) => {
    res.status(STATUS_CODE.success).send(cards);
  })
  .catch((error) => {
    if (error.name === 'ValidationError') {
      res.status(STATUS_CODE.dataError).send({
        "message": "Данные некорректны"
      } )
    } else {
      res.status(STATUS_CODE.serverError).send({ message: "Произошла ошибка. Повторите запрос" })
    }
  })
}

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
  .orFail(() => {
    throw new NotFound();
  })
  .then(card => res.send(card))
  .catch(error => {
    if (error.name === 'CastError') {
      res.status(STATUS_CODE.dataError).send({
        "message": "Данные некорректны"
      } )
    } else if (error.name === "NotFound") {
      res.status(error.status).send({ message: error.message })
    } else {
      res.status(STATUS_CODE.serverError).send({ message: "Произошла ошибка. Повторите запрос" })
    };
  })
}

const createCard = (req, res) => {
  const { name, link, owner=req.user._id } = req.body;
  Card.create({ name, link, owner })
  .then((card) => {
    res.status(STATUS_CODE.successCreate).send(card);
  })
  .catch((error) => {
    if (error.name === 'ValidationError') {
      res.status(STATUS_CODE.dataError).send({
        "message": "Данные некорректны"
      } )
    } else {
      res.status(STATUS_CODE.serverError).send({ message: "Произошла ошибка. Повторите запрос" })
    }
  })
}

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
  .orFail(() => {
    throw new NotFound();
  })
  .then((card) => {
    res.status(STATUS_CODE.success).send(card);
  })
  .catch((error) => {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      res.status(STATUS_CODE.dataError).send({
        "message": "Данные некорректны"
      } )
    } else if (error.name === "NotFound") {
      res.status(error.status).send({ message: error.message })
    } else {
      res.status(STATUS_CODE.serverError).send({ message: "Произошла ошибка. Повторите запрос" })
    }
  })
}

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
  .orFail(() => {
    throw new NotFound();
  })
  .then((card) => {
    res.status(STATUS_CODE.success).send(card);
  })
  .catch((error) => {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      res.status(STATUS_CODE.dataError).send({
        "message": "Данные некорректны"
      } )
    } else if (error.name === "NotFound") {
      res.status(error.status).send({ message: error.message })
    } else {
      res.status(STATUS_CODE.serverError).send({ message: "Произошла ошибка. Повторите запрос" })
    }
  })
}

module.exports = { getCards, createCard, deleteCard, likeCard, dislikeCard }