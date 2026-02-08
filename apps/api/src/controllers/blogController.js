const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Helper function to generate slug from title
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

// Get all posts with pagination
exports.getAllPosts = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const where = {};
    if (status) where.status = status;

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: parseInt(limit),
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          categories: true,
          tags: true
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.post.count({ where })
    ]);

    res.json({
      success: true,
      data: posts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get all posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching posts',
      error: error.message
    });
  }
};

// Get single post by ID
exports.getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        categories: true,
        tags: true
      }
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Get post by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching post',
      error: error.message
    });
  }
};

// Create new post
exports.createPost = async (req, res) => {
  try {
    const {
      title,
      content,
      excerpt,
      featuredImage,
      categoryIds = [],
      tagIds = [],
      status = 'DRAFT'
    } = req.body;

    // Validation
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title, content'
      });
    }

    // Generate slug
    const slug = generateSlug(title);

    // Check if slug exists
    const existingPost = await prisma.post.findUnique({
      where: { slug }
    });

    if (existingPost) {
      return res.status(400).json({
        success: false,
        message: 'A post with this title already exists'
      });
    }

    // Create post
    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        featuredImage,
        status,
        publishedAt: status === 'PUBLISHED' ? new Date() : null,
        authorId: req.user.userId,
        categories: {
          connect: categoryIds.map(id => ({ id: parseInt(id) }))
        },
        tags: {
          connect: tagIds.map(id => ({ id: parseInt(id) }))
        }
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        categories: true,
        tags: true
      }
    });

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: post
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating post',
      error: error.message
    });
  }
};

// Update post
exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      content,
      excerpt,
      featuredImage,
      categoryIds,
      tagIds,
      status
    } = req.body;

    // Check if post exists
    const existingPost = await prisma.post.findUnique({
      where: { id }
    });

    if (!existingPost) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Build update data
    const updateData = {};
    
    if (title) {
      updateData.title = title;
      updateData.slug = generateSlug(title);
      
      // Check slug conflict
      if (updateData.slug !== existingPost.slug) {
        const slugConflict = await prisma.post.findUnique({
          where: { slug: updateData.slug }
        });
        
        if (slugConflict && slugConflict.id !== id) {
          return res.status(400).json({
            success: false,
            message: 'Another post with this title already exists'
          });
        }
      }
    }
    
    if (content) updateData.content = content;
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (featuredImage !== undefined) updateData.featuredImage = featuredImage;
    
    if (status) {
      updateData.status = status;
      if (status === 'PUBLISHED' && existingPost.status !== 'PUBLISHED') {
        updateData.publishedAt = new Date();
      }
    }

    // Handle categories
    if (categoryIds !== undefined) {
      updateData.categories = {
        set: categoryIds.map(id => ({ id: parseInt(id) }))
      };
    }

    // Handle tags
    if (tagIds !== undefined) {
      updateData.tags = {
        set: tagIds.map(id => ({ id: parseInt(id) }))
      };
    }

    const post = await prisma.post.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        categories: true,
        tags: true
      }
    });

    res.json({
      success: true,
      message: 'Post updated successfully',
      data: post
    });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating post',
      error: error.message
    });
  }
};

// Delete post
exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if post exists
    const existingPost = await prisma.post.findUnique({
      where: { id }
    });

    if (!existingPost) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    await prisma.post.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting post',
      error: error.message
    });
  }
};
