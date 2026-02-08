const { PrismaClient } = require('@prisma/client');
const { hashPassword, comparePassword, generateToken } = require('../utils/auth');

const prisma = new PrismaClient();

// Register new user
const register = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({ 
        error: 'Validation Error',
        message: 'Email, password, and name are required' 
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ 
        error: 'Validation Error',
        message: 'User with this email already exists' 
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role || 'ADMIN'
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    });

    // Generate token
    const token = generateToken(user.id, user.email, user.role);

    res.status(201).json({
      message: 'User registered successfully',
      user,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: 'Server Error',
      message: 'Failed to register user' 
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Validation Error',
        message: 'Email and password are required' 
      });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ 
        error: 'Authentication Failed',
        message: 'Invalid email or password' 
      });
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ 
        error: 'Authentication Failed',
        message: 'Invalid email or password' 
      });
    }

    // Generate token
    const token = generateToken(user.id, user.email, user.role);

    // Return user info (without password) and token
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Login successful',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Server Error',
      message: 'Failed to login' 
    });
  }
};

// Get current user info
const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ 
        error: 'Not Found',
        message: 'User not found' 
      });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      error: 'Server Error',
      message: 'Failed to get user info' 
    });
  }
};

module.exports = {
  register,
  login,
  getMe
};
