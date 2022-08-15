const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const STATUS_CODE = require('./errors/errorCode');
const router = require('./routes/routes');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  req.user = {
    _id: '62f6d4e38872d62420e05681' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
}); 
app.use('/', router);
app.use('*', (req, res) => {
  res.status(STATUS_CODE.notFound).send({ message: "Страница не найдена" });
})

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
}) 