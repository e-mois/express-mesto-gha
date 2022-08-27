const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const { celebrate, Joi } = require('celebrate');
const STATUS_CODE = require('./errors/errorCode');
const router = require('./routes/routes');
const { login, createUser } = require('./controllers/users');
const { auth } = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});
app.use(express.json());
app.use(cookieParser());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    link: Joi.string().min(2).max(200),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    link: Joi.string().min(2).max(200),
  }),
}), createUser);

app.use(auth);
app.use('/', router);
app.use('*', (req, res) => {
  res.status(STATUS_CODE.notFound).send({ message: 'Страница не найдена' });
});

app.use(errors());

app.use((err, req, res) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});

app.listen(PORT);
