const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Helper function to generate slug from title
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

// GET /api/admin/careers - Get all careers with pagination
exports.getAllCareers = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (page - 1) * limit;

    // Build filter
    const where = {};
    if (status) {
      where.status = status;
    }

    const [careers, total] = await Promise.all([
      prisma.career.findMany({
        where,
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.career.count({ where })
    ]);

    res.json({
      success: true,
      data: careers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get all careers error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching careers',
      error: error.message
    });
  }
};

// GET /api/admin/careers/:id - Get single career
exports.getCareerById = async (req, res) => {
  try {
    const { id } = req.params;

    const career = await prisma.career.findUnique({
      where: { id }
    });

    if (!career) {
      return res.status(404).json({
        success: false,
        message: 'Career not found'
      });
    }

    res.json({
      success: true,
      data: career
    });
  } catch (error) {
    console.error('Get career by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching career',
      error: error.message
    });
  }
};

// POST /api/admin/careers - Create new career
exports.createCareer = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      type = 'FULL_TIME',
      department,
      salary,
      status = 'DRAFT'
    } = req.body;

    // Validation
    if (!title || !description || !location) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title, description, location'
      });
    }

    // Generate slug from title
    const slug = generateSlug(title);

    // Check if slug already exists
    const existingCareer = await prisma.career.findUnique({
      where: { slug }
    });

    if (existingCareer) {
      return res.status(400).json({
        success: false,
        message: 'A career with this title already exists'
      });
    }

    const career = await prisma.career.create({
      data: {
        title,
        slug,
        description,
        location,
        type,
        department,
        salary,
        status
      }
    });

    res.status(201).json({
      success: true,
      message: 'Career created successfully',
      data: career
    });
  } catch (error) {
    console.error('Create career error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating career',
      error: error.message
    });
  }
};

// PUT /api/admin/careers/:id - Update career
exports.updateCareer = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      location,
      type,
      department,
      salary,
      status
    } = req.body;

    // Check if career exists
    const existingCareer = await prisma.career.findUnique({
      where: { id }
    });

    if (!existingCareer) {
      return res.status(404).json({
        success: false,
        message: 'Career not found'
      });
    }

    // Build update data
    const updateData = {};
    
    if (title) {
      updateData.title = title;
      updateData.slug = generateSlug(title);
      
      // Check if new slug conflicts with another career
      if (updateData.slug !== existingCareer.slug) {
        const slugConflict = await prisma.career.findUnique({
          where: { slug: updateData.slug }
        });
        
        if (slugConflict && slugConflict.id !== id) {
          return res.status(400).json({
            success: false,
            message: 'Another career with this title already exists'
          });
        }
      }
    }
    
    if (description) updateData.description = description;
    if (location) updateData.location = location;
    if (type) updateData.type = type;
    if (department !== undefined) updateData.department = department;
    if (salary !== undefined) updateData.salary = salary;
    if (status) updateData.status = status;

    const career = await prisma.career.update({
      where: { id },
      data: updateData
    });

    res.json({
      success: true,
      message: 'Career updated successfully',
      data: career
    });
  } catch (error) {
    console.error('Update career error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating career',
      error: error.message
    });
  }
};

// DELETE /api/admin/careers/:id - Delete career
exports.deleteCareer = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if career exists
    const existingCareer = await prisma.career.findUnique({
      where: { id }
    });

    if (!existingCareer) {
      return res.status(404).json({
        success: false,
        message: 'Career not found'
      });
    }

    await prisma.career.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Career deleted successfully'
    });
  } catch (error) {
    console.error('Delete career error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting career',
      error: error.message
    });
  }
};
