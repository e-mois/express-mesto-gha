const User = require('../models/user');
const NotFound = require('../errors/NotFound');
const STATUS_CODE = require('../errors/errorCode');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(STATUS_CODE.success).send(users);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(STATUS_CODE.dataError).send({
          message: 'Данные некорректны',
        });
      } else {
        res.status(STATUS_CODE.serverError).send({ message: 'Произошла ошибка на сервере. Повторите запрос' });
      }
    });
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new NotFound();
    })
    .then((user) => {
      res.status(STATUS_CODE.success).send(user);
    })
    .catch((error) => {
      console.log(error.name);
      if (error.name === 'CastError') {
        res.status(STATUS_CODE.dataError).send({
          message: 'Данные некорректны',
        });
      } else if (error.name === 'NotFound') {
        res.status(error.status).send({ message: error.message });
      } else {
        res.status(STATUS_CODE.serverError).send({ message: 'Произошла ошибка на сервере. Повторите запрос' });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.status(STATUS_CODE.successCreate).send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(STATUS_CODE.dataError).send({
          message: 'Данные некорректны',
        });
      } else {
        res.status(STATUS_CODE.serverError).send({ message: 'Произошла ошибка на сервере. Повторите запрос' });
      }
    });
};

const updateUser = (req, res) => {
  const { name, about, _id = req.user._id } = req.body;
  User.findByIdAndUpdate(
    _id,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .orFail(() => {
      throw new NotFound();
    })
    .then((user) => {
      res.status(STATUS_CODE.success).send(user);
    })
    .catch((error) => {
      console.log(error.name);
      if (error.name === 'ValidationError' || error.name === 'CastError') {
        res.status(STATUS_CODE.dataError).send({
          message: 'Данные некорректны',
        });
      } else if (error.name === 'NotFound') {
        res.status(error.status).send({ message: error.message });
      } else {
        res.status(STATUS_CODE.serverError).send({ message: 'Произошла ошибка на сервере. Повторите запрос' });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar, _id = req.user._id } = req.body;
  User.findByIdAndUpdate(
    _id,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .orFail(() => {
      throw new NotFound();
    })
    .then((user) => {
      res.status(STATUS_CODE.success).send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError' || error.name === 'CastError') {
        res.status(STATUS_CODE.dataError).send({
          message: 'Данные некорректны',
        });
      } else if (error.name === 'NotFound') {
        res.status(error.status).send({ message: error.message });
      } else {
        res.status(STATUS_CODE.serverError).send({ message: 'Произошла ошибка на сервере. Повторите запрос' });
      }
    });
};

module.exports = {
  getUsers, getUserById, createUser, updateUser, updateAvatar,
};
