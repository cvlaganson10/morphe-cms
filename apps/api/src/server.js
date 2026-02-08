const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blog');
const categoryRoutes = require('./routes/category');
const tagRoutes = require('./routes/tag');
const serviceRoutes = require('./routes/service');
const careerRoutes = require('./routes/career');

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Morphe CMS Backend is running!',
    timestamp: new Date().toISOString()
  });
});

// Mount routes
const publicRoutes = require('./routes/public');
app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/admin/posts', blogRoutes);
app.use('/api/admin/categories', categoryRoutes);
app.use('/api/admin/tags', tagRoutes);
app.use('/api/admin/services', serviceRoutes);
app.use('/api/admin/careers', careerRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log('==================================================');
  console.log('🚀 Morphe CMS Backend Server Started');
  console.log('==================================================');
  console.log(`📡 Server URL: http://localhost:${PORT}`);
  console.log(`📊 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('==================================================');
  console.log('\n📋 Available API Endpoints:');
  console.log('   Auth:       /api/auth/*');
  console.log('   Posts:      /api/admin/posts');
  console.log('   Categories: /api/admin/categories');
  console.log('   Tags:       /api/admin/tags');
  console.log('   Services:   /api/admin/services');
  console.log('   Careers:    /api/admin/careers');
  console.log('==================================================\n');
});
