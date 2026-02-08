const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all published posts (public)
const getPublishedPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, tag } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {
      status: 'PUBLISHED',
      publishedAt: { lte: new Date() }
    };

    if (category) {
      where.categories = {
        some: { slug: category }
      };
    }

    if (tag) {
      where.tags = {
        some: { slug: tag }
      };
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { publishedAt: 'desc' },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          featuredImage: true,
          publishedAt: true,
          author: {
            select: {
              id: true,
              name: true
            }
          },
          categories: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          },
          tags: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          }
        }
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
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get published posts error:', error);
    res.status(500).json({
      error: 'Server Error',
      message: 'Failed to fetch posts'
    });
  }
};

// Get single published post by slug (public)
const getPublishedPostBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const post = await prisma.post.findFirst({
      where: { 
        slug,
        status: 'PUBLISHED'
      },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        excerpt: true,
        featuredImage: true,
        publishedAt: true,
        author: {
          select: {
            id: true,
            name: true
          }
        },
        categories: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        tags: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      }
    });

    if (!post) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Post not found'
      });
    }

    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Get post by slug error:', error);
    res.status(500).json({
      error: 'Server Error',
      message: 'Failed to fetch post'
    });
  }
};

module.exports = {
  getPublishedPosts,
  getPublishedPostBySlug
};
