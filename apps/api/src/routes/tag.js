const express = require('express');
const {
  getAllTags,
  getTagById,
  createTag,
  updateTag,
  deleteTag
} = require('../controllers/tagController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Tag routes
router.get('/', getAllTags);
router.get('/:id', getTagById);
router.post('/', createTag);
router.put('/:id', updateTag);
router.delete('/:id', deleteTag);

module.exports = router;
