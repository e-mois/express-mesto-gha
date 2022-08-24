const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFound = require('../errors/NotFound');
const STATUS_CODE = require('../errors/errorCode');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(STATUS_CODE.success).send(users);
    })
    .catch(() => {
      res.status(STATUS_CODE.serverError).send({ message: 'Произошла ошибка на сервере. Повторите запрос' });
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
      if (error.name === 'CastError') {
        res.status(STATUS_CODE.dataError).send({
          message: 'Данные некорректные',
        });
      } else if (error.name === 'NotFound') {
        res.status(error.status).send({ message: error.message });
      } else {
        res.status(STATUS_CODE.serverError).send({ message: 'Произошла ошибка на сервере. Повторите запрос' });
      }
    });
};

const createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    })
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
      }));
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

// controllers/users.js

const login = (req, res) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign({ _id: user._id }, 'secret-code', { expiresIn: '7d' });

      // запишем токен в куки
      res
        .cookie('access_token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
        })
        .status(STATUS_CODE.success)
        .send({ message: 'Аутентификация прошла успешно' });
    })
    .catch((err) => {
      res
        .status(STATUS_CODE.noAuth)
        .send({ message: err.message });
    });
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        next(new NotFound());
      }
      return res.status(STATUS_CODE.success).send(user);
    })
    .catch(next);
};

module.exports = {
  getUsers, getUserById, createUser, updateUser, updateAvatar, login, getCurrentUser,
};
