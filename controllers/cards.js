const Card = require('../models/card');
const NotFound = require('../errors/NotFound');
const STATUS_CODE = require('../errors/errorCode');
const CastomizeError = require('../errors/CastomizeError');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.status(STATUS_CODE.success).send(cards);
    })
    .catch(next);
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new NotFound('Карточка не найдена');
    })
    .then((currentCard) => {
      if (currentCard.owner === req.user._id) {
        Card.findByIdAndRemove(req.params.cardId)
          .then(() => res.send({ message: 'Карточка удалена успешно' }))
          .catch(next);
      } else {
        next(new CastomizeError('Удалить данную карточку невозможно. Вы не являетесь ее создателем'));
      }
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link, owner = req.user._id } = req.body;
  Card.create({ name, link, owner })
    .then((card) => {
      res.status(STATUS_CODE.successCreate).send(card);
    })
    .catch((error) => {
      console.log(error);
      if (error.name === 'ValidationError') {
        next(new CastomizeError('Данные некорректны'));
      } else {
        next(error);
      }
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFound('Карточка не найдена');
    })
    .then((card) => {
      res.status(STATUS_CODE.success).send(card);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new CastomizeError('Данные некорректны'));
      } else {
        next(error);
      }
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFound('Карточка не найдена');
    })
    .then((card) => {
      res.status(STATUS_CODE.success).send(card);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new CastomizeError('Данные некорректны'));
      } else {
        next(error);
      }
    });
};

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
