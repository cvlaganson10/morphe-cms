# 🚀 Morphe CMS

A modern, full-stack Content Management System built with Next.js, React, Node.js, Express, Prisma, and PostgreSQL. Features a premium purple/blue gradient design with particle effects.

![Morphe Labs](https://img.shields.io/badge/Morphe-Labs-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js)

## ✨ Features

### 🎨 Premium Design
- Purple/blue gradient theme
- Animated particle background
- Framer Motion animations
- Fully responsive layout
- Glassmorphism UI elements

### 📝 Content Management
- **Blog System**: Full CRUD with categories and tags
- **Services Management**: Showcase your offerings
- **Careers Portal**: Job listings and applications
- **Rich Text Editor**: Easy content creation
- **Media Upload**: Featured images support

### 🔐 Admin Panel
- Secure JWT authentication
- Intuitive dashboard with real-time stats
- Complete CRUD operations
- Role-based access control
- Modern Ant Design UI

### 🌐 Public Website
- Server-side rendering with Next.js
- SEO optimized
- Fast page loads
- Dynamic routing
- TypeScript support

## 🏗️ Project Structure
```
morphe-cms/
├── apps/
│   └── api/              # Backend API (Node.js + Express)
│       ├── src/
│       │   ├── controllers/
│       │   ├── middleware/
│       │   ├── routes/
│       │   └── server.js
│       ├── prisma/
│       │   └── schema.prisma
│       └── .env
│
├── admin-panel/          # Admin Dashboard (React + Ant Design)
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   └── context/
│   └── package.json
│
└── public-website/       # Public Site (Next.js 16 + Tailwind)
    ├── app/
    │   ├── blog/
    │   ├── services/
    │   └── careers/
    ├── components/
    │   ├── hero/
    │   ├── navigation/
    │   ├── cards/
    │   └── layout/
    ├── lib/
    └── package.json
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database running
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
   git clone https://github.com/cvlaganson10/morphe-cms.git
   cd morphe-cms
```

2. **Set up the Backend API**
```bash
   cd apps/api
   npm install
   
   # Configure your .env file
   cp .env.example .env
   # Edit .env with your database credentials
   
   # Run database migrations
   npx prisma migrate dev
   npx prisma generate
```

3. **Set up the Admin Panel**
```bash
   cd ../../admin-panel
   npm install
```

4. **Set up the Public Website**
```bash
   cd ../public-website
   npm install
```

## 🎯 Running the Project

You need **3 terminal windows** to run the full stack:

### Terminal 1: Backend API (Port 3001)
```bash
cd ~/Desktop/morphe-cms/apps/api
node src/server.js
```
✅ Backend running at: `http://localhost:3001`

### Terminal 2: Public Website (Port 3000)
```bash
cd ~/Desktop/morphe-cms/public-website
npm run dev
```
✅ Public site running at: `http://localhost:3000`

### Terminal 3: Admin Panel (Port 3002) - Optional
```bash
cd ~/Desktop/morphe-cms/admin-panel
PORT=3002 npm start
```
✅ Admin panel at: `http://localhost:3002`

## 🔑 Default Admin Credentials
```
Email: admin@morphelabs.org
Password: Admin123!
```

⚠️ **Change these credentials in production!**

## 📚 API Endpoints

### Public Endpoints (No Auth Required)
```
GET  /api/public/posts              # All published posts
GET  /api/public/posts/:slug        # Single post
GET  /api/public/categories         # All categories
GET  /api/public/tags               # All tags
GET  /api/public/services           # Active services
GET  /api/public/careers            # Open positions
```

### Admin Endpoints (Auth Required)
```
POST /api/admin/login               # Login
GET  /api/admin/posts               # CRUD operations
POST /api/admin/posts
PUT  /api/admin/posts/:id
DELETE /api/admin/posts/:id
# Similar endpoints for categories, tags, services, careers
```

## 🎨 Customization

### Change Theme Colors
Edit `public-website/components/hero/HeroSection.tsx`:
```typescript
// Change gradient colors
className="bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900"
```

### Adjust Particle Speed
Edit `public-website/components/hero/BackgroundParticles.tsx`:
```typescript
vx: (Math.random() - 0.5) * 1.5,  // Increase for faster
vy: (Math.random() - 0.5) * 1.5,
```

### Modify Particle Count
```typescript
const particleCount = window.innerWidth < 768 ? 30 : 80;
// 30 = mobile, 80 = desktop
```

## 🗄️ Database Schema

- **User**: Admin authentication
- **Post**: Blog posts with categories and tags
- **Category**: Content categorization
- **Tag**: Content tagging
- **Service**: Service offerings
- **Career**: Job postings

View full schema: `apps/api/prisma/schema.prisma`

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **Framer Motion** - Animations
- **Ant Design** - Admin UI components

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **Prisma** - ORM
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcrypt** - Password hashing

## 📦 Build for Production

### Backend
```bash
cd apps/api
# Already production-ready
node src/server.js
```

### Public Website
```bash
cd public-website
npm run build
npm run start
```

### Admin Panel
```bash
cd admin-panel
npm run build
npm run start
```

## 🐛 Troubleshooting

### Port already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3002 npm run dev
```

### Database connection failed
- Check PostgreSQL is running
- Verify `.env` database credentials
- Run `npx prisma migrate dev`

### Module not found errors
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

## �� Contributing

This is a personal project, but suggestions are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 👤 Author

**Charlene May Laganson**
- GitHub: [@cvlaganson10](https://github.com/cvlaganson10)

## 🎉 Acknowledgments

- Built with guidance from Claude AI
- Inspired by modern SaaS design patterns
- Thanks to the open-source community

---

**⭐ Star this repo if you found it helpful!**

Made with ❤️ and ☕ by a vibe coder
