const express = require('express');
const auth = require('../middleware/auth');
const { createBlog, getPublishedBlogs, getBlog, getUserBlogs, updateBlog, deleteBlog } = require('../controllers/blogController');
const router = express.Router();

router.get('/', getPublishedBlogs);
router.get('/:id', getBlog);
router.post('/', auth, createBlog);
router.get('/user/me', auth, getUserBlogs);
router.patch('/:id', auth, updateBlog);
router.delete('/:id', auth, deleteBlog);

module.exports = router;
