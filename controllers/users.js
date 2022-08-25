const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFound = require('../errors/NotFound');
const STATUS_CODE = require('../errors/errorCode');
const CastomizeError = require('../errors/CastomizeError');
const ConflictError = require('../errors/ConflictError');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.status(STATUS_CODE.success).send(users);
    })
    .catch(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new NotFound('Пользователь не найден');
    })
    .then((user) => {
      res.status(STATUS_CODE.success).send(user);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new CastomizeError('Данные некорректны'));
      } else {
        next(error);
      }
    });
};

const createUser = (req, res, next) => {
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
          next(new CastomizeError('Данные некорректны'));
        } else if (error.code === 11000) {
          next(new ConflictError(`Пользователь с email ${email} уже существует!`));
        } else {
          next(error);
        }
      }));
};

const updateUser = (req, res, next) => {
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
      throw new NotFound('Пользователь не найден');
    })
    .then((user) => {
      res.status(STATUS_CODE.success).send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError' || error.name === 'CastError') {
        next(new CastomizeError('Данные некорректны'));
      } else {
        next(error);
      }
    });
};

const updateAvatar = (req, res, next) => {
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
      throw new NotFound('Пользователь не найден');
    })
    .then((user) => {
      res.status(STATUS_CODE.success).send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError' || error.name === 'CastError') {
        next(new CastomizeError('Данные некорректны'));
      } else {
        next(error);
      }
    });
};

// controllers/users.js

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .orFail(() => {
      throw new NotFound('Пользователь не найден');
    })
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
    .catch(next);
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
