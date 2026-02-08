const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Helper function to generate slug from title
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

// GET /api/admin/services - Get all services
exports.getAllServices = async (req, res) => {
  try {
    const { status } = req.query;
    
    const where = {};
    if (status) {
      where.status = status;
    }

    const services = await prisma.service.findMany({
      where,
      orderBy: {
        order: 'asc'
      }
    });

    res.json({
      success: true,
      data: services
    });
  } catch (error) {
    console.error('Get all services error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching services',
      error: error.message
    });
  }
};

// GET /api/admin/services/:id - Get single service
exports.getServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await prisma.service.findUnique({
      where: { id }
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error('Get service by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching service',
      error: error.message
    });
  }
};

// POST /api/admin/services - Create new service
exports.createService = async (req, res) => {
  try {
    const {
      title,
      description,
      icon,
      image,
      status = 'ACTIVE',
      order = 0
    } = req.body;

    // Validation
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title, description'
      });
    }

    // Generate slug from title
    const slug = generateSlug(title);

    // Check if slug already exists
    const existingService = await prisma.service.findUnique({
      where: { slug }
    });

    if (existingService) {
      return res.status(400).json({
        success: false,
        message: 'A service with this title already exists'
      });
    }

    const service = await prisma.service.create({
      data: {
        title,
        slug,
        description,
        icon,
        image,
        status,
        order
      }
    });

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: service
    });
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating service',
      error: error.message
    });
  }
};

// PUT /api/admin/services/:id - Update service
exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      icon,
      image,
      status,
      order
    } = req.body;

    // Check if service exists
    const existingService = await prisma.service.findUnique({
      where: { id }
    });

    if (!existingService) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Build update data
    const updateData = {};
    
    if (title) {
      updateData.title = title;
      updateData.slug = generateSlug(title);
      
      // Check if new slug conflicts with another service
      if (updateData.slug !== existingService.slug) {
        const slugConflict = await prisma.service.findUnique({
          where: { slug: updateData.slug }
        });
        
        if (slugConflict && slugConflict.id !== id) {
          return res.status(400).json({
            success: false,
            message: 'Another service with this title already exists'
          });
        }
      }
    }
    
    if (description) updateData.description = description;
    if (icon !== undefined) updateData.icon = icon;
    if (image !== undefined) updateData.image = image;
    if (status) updateData.status = status;
    if (order !== undefined) updateData.order = order;

    const service = await prisma.service.update({
      where: { id },
      data: updateData
    });

    res.json({
      success: true,
      message: 'Service updated successfully',
      data: service
    });
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating service',
      error: error.message
    });
  }
};

// DELETE /api/admin/services/:id - Delete service
exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if service exists
    const existingService = await prisma.service.findUnique({
      where: { id }
    });

    if (!existingService) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    await prisma.service.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting service',
      error: error.message
    });
  }
};
