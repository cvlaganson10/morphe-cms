const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  getAllCareers,
  getCareerById,
  createCareer,
  updateCareer,
  deleteCareer
} = require('../controllers/careerController');

// GET /api/admin/careers - Get all careers (with auth)
router.get('/', authenticate, getAllCareers);

// GET /api/admin/careers/:id - Get single career (with auth)
router.get('/:id', authenticate, getCareerById);

// POST /api/admin/careers - Create new career (with auth)
router.post('/', authenticate, createCareer);

// PUT /api/admin/careers/:id - Update career (with auth)
router.put('/:id', authenticate, updateCareer);

// DELETE /api/admin/careers/:id - Delete career (with auth)
router.delete('/:id', authenticate, deleteCareer);

module.exports = router;
