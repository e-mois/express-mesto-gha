const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
  .then((cards) => {
    res.status(200).send(cards);
  })
  .catch((error) => {
    if (error.name === 'ValidationError') {
      res.status(400).send({
        "message": "Данные некорректны"
      } )
    } else {
      res.status(500).send({ message: "Произошла ошибка. Повторите запрос" })
    }
  })
}

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
  .then(card => res.send(card))
  .catch(error => res.status(500).send({ message: error }));
}

const createCard = (req, res) => {
  const { name, link, owner=req.user._id } = req.body;
  Card.create({ name, link, owner })
  .then((card) => {
    res.status(201).send(card);
  })
  .catch((error) => {
    if (error.name === 'ValidationError') {
      res.status(400).send({
        "message": "Данные некорректны"
      } )
    } else {
      res.status(500).send({ message: "Произошла ошибка. Повторите запрос" })
    }
  })
}

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
  .then((card) => {
    res.status(200).send(card);
  })
  .catch((error) => {
    if (error.name === 'ValidationError') {
      res.status(400).send({
        "message": "Данные некорректны"
      } )
    } else {
      res.status(500).send({ message: "Произошла ошибка. Повторите запрос" })
    }
  })
}

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
  .then((card) => {
    res.status(200).send(card);
  })
  .catch((error) => {
    if (error.name === 'ValidationError') {
      res.status(400).send({
        "message": "Данные некорректны"
      } )
    } else {
      res.status(500).send({ message: "Произошла ошибка. Повторите запрос" })
    }
  })
}

module.exports = { getCards, createCard, deleteCard, likeCard, dislikeCard }