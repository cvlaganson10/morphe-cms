const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all categories (public)
const getPublicCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { 
            posts: {
              where: {
                status: 'PUBLISHED',
                publishedAt: { lte: new Date() }
              }
            }
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get public categories error:', error);
    res.status(500).json({
      error: 'Server Error',
      message: 'Failed to fetch categories'
    });
  }
};

// Get all tags (public)
const getPublicTags = async (req, res) => {
  try {
    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: { 
            posts: {
              where: {
                status: 'PUBLISHED',
                publishedAt: { lte: new Date() }
              }
            }
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    res.json({
      success: true,
      data: tags
    });
  } catch (error) {
    console.error('Get public tags error:', error);
    res.status(500).json({
      error: 'Server Error',
      message: 'Failed to fetch tags'
    });
  }
};

// Get all active services (public)
const getPublicServices = async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { order: 'asc' }
    });

    res.json({
      success: true,
      data: services
    });
  } catch (error) {
    console.error('Get public services error:', error);
    res.status(500).json({
      error: 'Server Error',
      message: 'Failed to fetch services'
    });
  }
};

// Get single service by slug (public)
const getPublicServiceBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const service = await prisma.service.findFirst({
      where: { 
        slug,
        status: 'ACTIVE'
      }
    });

    if (!service) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Service not found'
      });
    }

    res.json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error('Get service by slug error:', error);
    res.status(500).json({
      error: 'Server Error',
      message: 'Failed to fetch service'
    });
  }
};

// Get all open careers (public)
const getPublicCareers = async (req, res) => {
  try {
    const { type, location } = req.query;

    const where = { status: 'OPEN' };

    if (type) where.type = type;
    if (location) where.location = { contains: location, mode: 'insensitive' };

    const careers = await prisma.career.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: careers
    });
  } catch (error) {
    console.error('Get public careers error:', error);
    res.status(500).json({
      error: 'Server Error',
      message: 'Failed to fetch careers'
    });
  }
};

// Get single career by slug (public)
const getPublicCareerBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const career = await prisma.career.findFirst({
      where: { 
        slug,
        status: 'OPEN'
      }
    });

    if (!career) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Career opportunity not found'
      });
    }

    res.json({
      success: true,
      data: career
    });
  } catch (error) {
    console.error('Get career by slug error:', error);
    res.status(500).json({
      error: 'Server Error',
      message: 'Failed to fetch career'
    });
  }
};

module.exports = {
  getPublicCategories,
  getPublicTags,
  getPublicServices,
  getPublicServiceBySlug,
  getPublicCareers,
  getPublicCareerBySlug
};
