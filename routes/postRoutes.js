const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/authMiddleware');
const { createPost, getPosts, getPostById, updatePost, deletePost, populateUser } = require('../controllers/postController');
const { populatePosts } = require('../controllers/authController');

// router.get('/', (req, res) => {
//     res.send('Homepage');
// });

router.get('/', getPosts);
router.get('/:id', isAuthenticated, getPostById);
router.post('/', isAuthenticated, createPost);
router.get('/populate/:id', isAuthenticated, populateUser);
router.patch('/update/:id', isAuthenticated, updatePost);
router.delete('/delete/:id', isAuthenticated, deletePost);

module.exports = router;