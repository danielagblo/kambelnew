# Kambel Consult - Next.js Website

A modern, full-stack web application built with Next.js 14, TypeScript, Tailwind CSS, and Prisma ORM. This is a complete rebuild of the Kambel Consult platform featuring a professional consultancy website with an integrated admin panel.

## 🚀 Features

### Public Website
- ✅ Modern, responsive design with Tailwind CSS
- ✅ Dynamic hero section with statistics
- ✅ Publications management with categories
- ✅ Consultancy services showcase
- ✅ Blog with rich content support
- ✅ Masterclass registration system
- ✅ Image and video gallery
- ✅ Comprehensive about page
- ✅ Contact form with email notifications
- ✅ Newsletter subscription
- ✅ Social media integration
- ✅ SEO optimized

### Admin Panel
- ✅ Secure authentication with NextAuth.js
- ✅ Dashboard with statistics
- ✅ Publications management (CRUD)
- ✅ Services management (CRUD)
- ✅ Blog management (CRUD)
- ✅ Masterclass management (CRUD)
- ✅ Gallery management (CRUD)
- ✅ Contact messages inbox
- ✅ Newsletter subscribers management
- ✅ Site configuration
- ✅ File upload system

## 📋 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** Prisma ORM (SQLite/PostgreSQL)
- **Authentication:** NextAuth.js
- **Forms:** React Hook Form + Zod
- **UI Components:** Custom components with Tailwind
- **Icons:** Font Awesome 6
- **Toast Notifications:** React Hot Toast

## 🛠️ Installation

### Prerequisites

- Node.js 18+ and npm/yarn
- Git

### Step 1: Clone and Install

```bash
# Navigate to the Next.js app directory
cd nextjs-kambel

# Install dependencies
npm install
```

### Step 2: Environment Setup

Create a `.env` file in the root directory:

```env
# Database (SQLite for development)
DATABASE_URL="file:./dev.db"

# For production, use PostgreSQL:
# DATABASE_URL="postgresql://user:password@localhost:5432/kambel_consult"

# NextAuth Configuration
NEXTAUTH_SECRET="your-super-secret-key-here-generate-with-openssl"
NEXTAUTH_URL="http://localhost:3000"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_SITE_NAME="Kambel Consult"
```

**Generate a secure secret:**
```bash
openssl rand -base64 32
```

### Step 3: Database Setup

```bash
# Generate Prisma Client
npm run prisma:generate

# Push database schema
npm run prisma:push

# Seed the database with sample data
npm run prisma:seed
```

### Step 4: Run Development Server

```bash
npm run dev
```

The application will be available at:
- **Public Website:** http://localhost:3000
- **Admin Panel:** http://localhost:3000/admin
- **Admin Login:** http://localhost:3000/admin/login

## 🔐 Default Admin Credentials

```
Email: admin@kambelconsult.com
Password: admin123
```

**⚠️ IMPORTANT:** Change these credentials immediately in production!

## 📁 Project Structure

```
nextjs-kambel/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed data
├── public/
│   └── uploads/               # User uploaded files
├── src/
│   ├── app/
│   │   ├── (public)/          # Public pages
│   │   │   ├── page.tsx       # Homepage
│   │   │   ├── about/
│   │   │   ├── publications/
│   │   │   ├── consultancy/
│   │   │   ├── blog/
│   │   │   ├── masterclass/
│   │   │   ├── gallery/
│   │   │   └── contact/
│   │   ├── admin/             # Admin panel
│   │   │   ├── login/
│   │   │   ├── dashboard/
│   │   │   └── [other admin pages]/
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # NextAuth
│   │   │   ├── publications/
│   │   │   ├── consultancy/
│   │   │   ├── blog/
│   │   │   ├── contact/
│   │   │   ├── newsletter/
│   │   │   ├── masterclasses/
│   │   │   ├── gallery/
│   │   │   ├── site/
│   │   │   └── upload/
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── ui/                # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Textarea.tsx
│   │   ├── layout/            # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Container.tsx
│   │   └── admin/             # Admin components
│   │       └── AdminLayout.tsx
│   ├── lib/
│   │   ├── prisma.ts          # Prisma client
│   │   ├── auth.ts            # Auth utilities
│   │   └── utils.ts           # Helper functions
│   └── types/
│       └── next-auth.d.ts     # TypeScript definitions
├── .env                       # Environment variables
├── .gitignore
├── next.config.mjs
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## 🔌 API Endpoints

### Public APIs

- `GET /api/publications` - Get all publications
- `GET /api/publications/:id` - Get single publication
- `GET /api/categories` - Get all categories
- `GET /api/consultancy` - Get consultancy services
- `GET /api/blog` - Get published blog posts
- `GET /api/blog/:id` - Get single blog post
- `GET /api/masterclasses` - Get masterclasses
- `POST /api/masterclasses/register` - Register for masterclass
- `GET /api/gallery` - Get gallery items
- `GET /api/site/config` - Get site configuration
- `GET /api/site/hero` - Get hero section data
- `GET /api/site/about` - Get about page data
- `GET /api/site/social-media` - Get social media links
- `POST /api/contact` - Submit contact form
- `POST /api/newsletter` - Subscribe to newsletter

### Admin APIs (Protected)

- `POST /api/publications` - Create publication
- `PUT /api/publications/:id` - Update publication
- `DELETE /api/publications/:id` - Delete publication
- `POST /api/upload` - Upload files
- (Similar CRUD operations for other resources)

## 🗄️ Database Models

### Core Models

- **User** - Admin authentication
- **Category** - Publication categories
- **Book** - Publications/books
- **ConsultancyService** - Service offerings
- **ServiceFeature** - Service features
- **BlogPost** - Blog articles
- **ContactMessage** - Contact form submissions
- **NewsletterSubscription** - Email subscribers
- **Masterclass** - Training sessions
- **MasterclassRegistration** - Registrations
- **GalleryItem** - Gallery media
- **SocialMediaLink** - Social media profiles

### Configuration Models

- **SiteConfig** - Site-wide settings
- **HeroConfig** - Homepage hero section
- **AboutConfig** - About page content
- **ProfessionalJourneyItem** - Career timeline
- **EducationQualification** - Education history
- **Achievement** - Awards and recognition
- **SpeakingEngagement** - Speaking events
- **PrivacyPolicy** - Legal content
- **TermsConditions** - Legal content

## 🚀 Deployment

### DigitalOcean (Recommended for Full Control)

**📖 See full guide:** [DIGITALOCEAN_DEPLOYMENT.md](./DIGITALOCEAN_DEPLOYMENT.md)

Quick Docker deployment:
```bash
# Build and run with Docker Compose
npm run docker:build
npm run docker:run

# Or use the deployment script
./deploy.sh
```

### Vercel (Easiest)

1. Push your code to GitHub
2. Import project to Vercel
3. Configure environment variables
4. Deploy!

### Environment Variables for Production

```env
DATABASE_URL="postgresql://user:password@host:5432/database"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="your_secure_password"
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"
```

### Database Migration

For PostgreSQL in production:

```bash
# Update DATABASE_URL in .env
# Run migration
npx prisma migrate deploy
```

## 📝 Development

### Available Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# Database
npm run prisma:generate  # Generate Prisma Client
npm run prisma:push      # Push schema to database
npm run prisma:studio    # Open Prisma Studio GUI
npm run prisma:seed      # Seed database
```

### Adding New Features

1. **New Database Model**
   - Update `prisma/schema.prisma`
   - Run `npm run prisma:push`
   - Update seed file if needed

2. **New API Endpoint**
   - Create route handler in `src/app/api/[name]/route.ts`
   - Implement GET, POST, PUT, DELETE as needed

3. **New Page**
   - Create page in `src/app/[name]/page.tsx`
   - Add navigation links in Header/Footer

4. **New Component**
   - Create component in `src/components/`
   - Import and use in pages

## 🎨 Customization

### Branding

Update colors in `tailwind.config.ts`:

```typescript
colors: {
  primary: {
    // Your brand colors
  },
}
```

### Content

Update default content in `prisma/seed.ts`

### Layouts

Modify `src/components/layout/` components

## 🔒 Security

- ✅ Environment variables for secrets
- ✅ NextAuth.js for authentication
- ✅ Protected admin routes
- ✅ Input validation with Zod
- ✅ SQL injection protection (Prisma)
- ✅ XSS protection (React)

## 📧 Support

For issues and questions:
- Check documentation
- Review Next.js docs: https://nextjs.org/docs
- Review Prisma docs: https://www.prisma.io/docs

## 📄 License

Proprietary and confidential. All rights reserved.

## 🎉 Acknowledgments

- **Next.js** - React framework
- **Tailwind CSS** - Utility-first CSS
- **Prisma** - Modern database toolkit
- **NextAuth.js** - Authentication
- **Font Awesome** - Icons

---

**Built with ❤️ for Kambel Consult**

