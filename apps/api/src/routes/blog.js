const express = require('express');
const {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
} = require('../controllers/blogController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Blog post routes
router.get('/', getAllPosts);
router.get('/:id', getPostById);
router.post('/', createPost);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);

module.exports = router;
