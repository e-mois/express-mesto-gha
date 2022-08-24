const jwt = require('jsonwebtoken');
const STATUS_CODE = require('../errors/errorCode');

const auth = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    next(res
      .status(STATUS_CODE.noAuth)
      .send({ message: 'Необходима авторизация' }));
  }

  let payload;

  try {
    payload = jwt.verify(token, 'secret-code');
  } catch (err) {
    next(res.status(STATUS_CODE.noAuth).send({ message: 'Нужна авторизация' }));
    return;
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};

module.exports = { auth };
