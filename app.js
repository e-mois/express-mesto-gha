const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const { celebrate, Joi } = require('celebrate');
const routerUser = require('./routes/routesUser');
const routerCard = require('./routes/routesCard');
const { login, createUser } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const getErrorMessage = require('./middlewares/getErrorMessage');
const NotFound = require('./errors/NotFound');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});
app.use(express.json());
app.use(cookieParser());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ tlds: { allow: false } }),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/https?:\/\/(\w{3}\.)?[1-9a-z\-.]{1,}\.\w{2,}(\/[1-90a-z.,_@%&?+=~/-]{1,}\/?)?#?/i),
    email: Joi.string().required().email({ tlds: { allow: false } }),
    password: Joi.string().required(),
  }),
}), createUser);

app.use(auth);
app.use('/users', routerUser);
app.use('/cards', routerCard);
app.use('*', (res, req, next) => {
  next(new NotFound('Страница не найдена'));
});

app.get('/signout', (req, res) => {
  res.clearCookie('access_token').send({ message: 'Выход' });
});

app.use(errors());

app.use(getErrorMessage);

app.listen(PORT);
