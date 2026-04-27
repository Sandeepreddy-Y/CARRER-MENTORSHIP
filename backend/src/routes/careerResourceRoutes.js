const express = require('express');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const careerResourceController = require('../controllers/careerResourceController');

const router = express.Router();

// Get all resources (public)
router.get('/', careerResourceController.getAllResources);

// Get resource by ID (public)
router.get('/:id', careerResourceController.getResourceById);

// Get resources by category (public)
router.get('/category/:category', careerResourceController.getResourcesByCategory);

// Create new resource (admin only)
router.post(
  '/',
  authMiddleware,
  adminMiddleware,
  careerResourceController.createResource
);

// Update resource (admin only)
router.put(
  '/:id',
  authMiddleware,
  adminMiddleware,
  careerResourceController.updateResource
);

// Delete resource (admin only)
router.delete(
  '/:id',
  authMiddleware,
  adminMiddleware,
  careerResourceController.deleteResource
);

module.exports = router;
