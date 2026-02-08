const express = require('express');
const { getPublishedPosts, getPublishedPostBySlug } = require('../controllers/publicBlogController');
const { 
  getPublicCategories, 
  getPublicTags,
  getPublicServices,
  getPublicServiceBySlug,
  getPublicCareers,
  getPublicCareerBySlug
} = require('../controllers/publicController');

const router = express.Router();

// Blog posts (public)
router.get('/posts', getPublishedPosts);
router.get('/posts/:slug', getPublishedPostBySlug);

// Categories (public)
router.get('/categories', getPublicCategories);

// Tags (public)
router.get('/tags', getPublicTags);

// Services (public)
router.get('/services', getPublicServices);
router.get('/services/:slug', getPublicServiceBySlug);

// Careers (public)
router.get('/careers', getPublicCareers);
router.get('/careers/:slug', getPublicCareerBySlug);

module.exports = router;
