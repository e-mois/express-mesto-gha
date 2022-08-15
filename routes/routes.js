const router = require('express').Router();
const {getUsers, getUserById, createUser, updateUser, updateAvatar} = require('../controllers/users');
const {getCards, createCard, deleteCard, likeCard, dislikeCard} = require('../controllers/cards')

router.get('/users', getUsers);

router.post('/users', createUser);

router.get('/users/:userId', getUserById);

router.get('/cards', getCards);

router.post('/cards/', createCard);

router.delete('/cards/:cardId', deleteCard);

router.patch('/users/me', updateUser);

router.patch('/users/me/avatar', updateAvatar);

router.put('/cards/:cardId/likes', likeCard);

router.delete('/cards/:cardId/likes', dislikeCard);


module.exports = router;