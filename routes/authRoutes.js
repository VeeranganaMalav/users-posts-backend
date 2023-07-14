const express = require('express');
const { register, login, populatePosts, deleteUser, updateUser, logout, getUsers } = require("../controllers/authController");
const { isAuthenticated } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.patch('/update/:id', updateUser);
router.delete('/delete/:id', deleteUser);
router.get('/', getUsers);
router.get('/populate/:id', populatePosts);
router.post('/logout', isAuthenticated, logout);

module.exports = router;