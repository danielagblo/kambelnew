# 🚀 Quick Start Guide - Kambel Consult

Get your Kambel Consult website up and running in 5 minutes!

## ⚡ Installation (5 Steps)

### 1. Navigate to Project Directory
```bash
cd /Users/danielagblo/Downloads/kambelconsult/nextjs-kambel
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment
The `.env.local` file is already configured for local development. No changes needed!

### 4. Initialize Database
```bash
# Generate Prisma Client
npm run prisma:generate

# Create database and tables
npm run prisma:push

# Add sample data
npm run prisma:seed
```

### 5. Start Development Server
```bash
npm run dev
```

## 🎉 You're Done!

Visit these URLs:

- **🌐 Website:** http://localhost:3000
- **🔐 Admin Login:** http://localhost:3000/admin/login
- **📊 Database GUI:** `npm run prisma:studio`

## 🔑 Default Admin Login

```
Email: admin@kambelconsult.com
Password: admin123
```

## 📱 Available Pages

### Public Pages
- **Home:** http://localhost:3000
- **About:** http://localhost:3000/about
- **Publications:** http://localhost:3000/publications
- **Consultancy:** http://localhost:3000/consultancy
- **Blog:** http://localhost:3000/blog
- **Masterclass:** http://localhost:3000/masterclass
- **Gallery:** http://localhost:3000/gallery
- **Contact:** http://localhost:3000/contact

### Admin Pages
- **Dashboard:** http://localhost:3000/admin/dashboard
- **Publications:** http://localhost:3000/admin/publications
- **Services:** http://localhost:3000/admin/services
- **Blog:** http://localhost:3000/admin/blog
- **Masterclasses:** http://localhost:3000/admin/masterclasses
- **Gallery:** http://localhost:3000/admin/gallery
- **Messages:** http://localhost:3000/admin/contacts
- **Newsletter:** http://localhost:3000/admin/newsletter
- **Settings:** http://localhost:3000/admin/settings

## 🛠️ Common Tasks

### Add a New Publication
1. Login to admin panel
2. Go to Publications
3. Click "Add New"
4. Fill in details and upload cover image
5. Save

### Write a Blog Post
1. Login to admin panel
2. Go to Blog
3. Click "New Post"
4. Write content
5. Publish

### View Contact Messages
1. Login to admin panel
2. Go to Messages
3. View and manage submissions

### Manage Newsletter Subscribers
1. Login to admin panel
2. Go to Newsletter
3. View subscribers

## 🐛 Troubleshooting

### Port 3000 Already in Use?
```bash
# Kill the process using port 3000
# On Mac/Linux:
lsof -ti:3000 | xargs kill -9

# Or use a different port:
npm run dev -- -p 3001
```

### Database Issues?
```bash
# Reset database
rm prisma/dev.db
npm run prisma:push
npm run prisma:seed
```

### Missing Dependencies?
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors?
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

## 📚 Next Steps

1. **Customize Content**
   - Update seed data in `prisma/seed.ts`
   - Add your own images to `public/`
   - Modify colors in `tailwind.config.ts`

2. **Add Features**
   - Review `README.md` for full documentation
   - Check `DEPLOYMENT.md` for going live

3. **Explore Admin Panel**
   - Add publications, blog posts, services
   - Upload images to gallery
   - Configure site settings

## 💡 Pro Tips

- Use Prisma Studio to view/edit database: `npm run prisma:studio`
- Check API endpoints at `/api/*`
- Tailwind classes are customizable in `tailwind.config.ts`
- All pages are in `src/app/`
- Components are in `src/components/`

## 📞 Need Help?

- Check `README.md` for detailed documentation
- Review Next.js docs: https://nextjs.org/docs
- Review Prisma docs: https://www.prisma.io/docs
- Review Tailwind docs: https://tailwindcss.com/docs

---

**Happy coding! 🎉**

