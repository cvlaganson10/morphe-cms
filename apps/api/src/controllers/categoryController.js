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

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { posts: true }
        }
      },
      orderBy: { name: 'asc' }
    });

    res.json({ 
      success: true,
      data: categories 
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      error: 'Server Error',
      message: 'Failed to fetch categories'
    });
  }
};

// Get single category
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
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

    if (!category) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Category not found'
      });
    }

    res.json({ 
      success: true,
      data: category 
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({
      error: 'Server Error',
      message: 'Failed to fetch category'
    });
  }
};

// Create category
const createCategory = async (req, res) => {
  try {
    const { name, slug, description } = req.body;

    if (!name) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Name is required'
      });
    }

    const finalSlug = slug || generateSlug(name);

    const existingCategory = await prisma.category.findUnique({
      where: { slug: finalSlug }
    });

    if (existingCategory) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'A category with this slug already exists'
      });
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug: finalSlug,
        description
      }
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      error: 'Server Error',
      message: 'Failed to create category'
    });
  }
};

// Update category
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description } = req.body;

    const existingCategory = await prisma.category.findUnique({
      where: { id }
    });

    if (!existingCategory) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Category not found'
      });
    }

    if (slug && slug !== existingCategory.slug) {
      const slugConflict = await prisma.category.findUnique({
        where: { slug }
      });

      if (slugConflict) {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'A category with this slug already exists'
        });
      }
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (slug !== undefined) updateData.slug = slug;
    if (description !== undefined) updateData.description = description;

    const category = await prisma.category.update({
      where: { id },
      data: updateData
    });

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: category
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({
      error: 'Server Error',
      message: 'Failed to update category'
    });
  }
};

// Delete category
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { posts: true }
        }
      }
    });

    if (!category) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Category not found'
      });
    }

    if (category._count.posts > 0) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Cannot delete category with existing posts'
      });
    }

    await prisma.category.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      error: 'Server Error',
      message: 'Failed to delete category'
    });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};
