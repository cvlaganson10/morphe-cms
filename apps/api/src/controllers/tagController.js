const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Generate slug from name
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
};

// Get all tags
const getAllTags = async (req, res) => {
  try {
    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: { posts: true }
        }
      },
      orderBy: { name: 'asc' }
    });

    res.json({ 
      success: true,
      data: tags 
    });
  } catch (error) {
    console.error('Get tags error:', error);
    res.status(500).json({
      error: 'Server Error',
      message: 'Failed to fetch tags'
    });
  }
};

// Get single tag
const getTagById = async (req, res) => {
  try {
    const { id } = req.params;

    const tag = await prisma.tag.findUnique({
      where: { id },
      include: {
        posts: {
          select: {
            id: true,
            title: true,
            slug: true,
            status: true
          }
        }
      }
    });

    if (!tag) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Tag not found'
      });
    }

    res.json({ 
      success: true,
      data: tag 
    });
  } catch (error) {
    console.error('Get tag error:', error);
    res.status(500).json({
      error: 'Server Error',
      message: 'Failed to fetch tag'
    });
  }
};

// Create tag
const createTag = async (req, res) => {
  try {
    const { name, slug } = req.body;

    if (!name) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Name is required'
      });
    }

    const finalSlug = slug || generateSlug(name);

    const existingTag = await prisma.tag.findUnique({
      where: { slug: finalSlug }
    });

    if (existingTag) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'A tag with this slug already exists'
      });
    }

    const tag = await prisma.tag.create({
      data: {
        name,
        slug: finalSlug
      }
    });

    res.status(201).json({
      success: true,
      message: 'Tag created successfully',
      data: tag
    });
  } catch (error) {
    console.error('Create tag error:', error);
    res.status(500).json({
      error: 'Server Error',
      message: 'Failed to create tag'
    });
  }
};

// Update tag
const updateTag = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug } = req.body;

    const existingTag = await prisma.tag.findUnique({
      where: { id }
    });

    if (!existingTag) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Tag not found'
      });
    }

    if (slug && slug !== existingTag.slug) {
      const slugConflict = await prisma.tag.findUnique({
        where: { slug }
      });

      if (slugConflict) {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'A tag with this slug already exists'
        });
      }
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (slug !== undefined) updateData.slug = slug;

    const tag = await prisma.tag.update({
      where: { id },
      data: updateData
    });

    res.json({
      success: true,
      message: 'Tag updated successfully',
      data: tag
    });
  } catch (error) {
    console.error('Update tag error:', error);
    res.status(500).json({
      error: 'Server Error',
      message: 'Failed to update tag'
    });
  }
};

// Delete tag
const deleteTag = async (req, res) => {
  try {
    const { id } = req.params;

    const tag = await prisma.tag.findUnique({
      where: { id },
      include: {
        _count: {
          select: { posts: true }
        }
      }
    });

    if (!tag) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Tag not found'
      });
    }

    if (tag._count.posts > 0) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Cannot delete tag with existing posts'
      });
    }

    await prisma.tag.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Tag deleted successfully'
    });
  } catch (error) {
    console.error('Delete tag error:', error);
    res.status(500).json({
      error: 'Server Error',
      message: 'Failed to delete tag'
    });
  }
};

module.exports = {
  getAllTags,
  getTagById,
  createTag,
  updateTag,
  deleteTag
};
