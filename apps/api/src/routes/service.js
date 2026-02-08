const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService
} = require('../controllers/serviceController');

// GET /api/admin/services - Get all services (with auth)
router.get('/', authenticate, getAllServices);

// GET /api/admin/services/:id - Get single service (with auth)
router.get('/:id', authenticate, getServiceById);

// POST /api/admin/services - Create new service (with auth)
router.post('/', authenticate, createService);

// PUT /api/admin/services/:id - Update service (with auth)
router.put('/:id', authenticate, updateService);

// DELETE /api/admin/services/:id - Delete service (with auth)
router.delete('/:id', authenticate, deleteService);

module.exports = router;
