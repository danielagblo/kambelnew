# Deployment Guide - Kambel Consult Next.js

This guide covers deploying your Kambel Consult Next.js application to production.

## 🚀 Deployment Options

### Option 1: Vercel (Recommended - Easiest)

Vercel is the creators of Next.js and provides the best hosting experience.

#### Steps:

1. **Prepare Your Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/kambel-consult.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Visit https://vercel.com
   - Sign up/Login with GitHub
   - Click "New Project"
   - Import your repository
   - Configure:
     - Framework Preset: Next.js
     - Root Directory: `./nextjs-kambel`
     - Build Command: `npm run build`
     - Output Directory: `.next`

3. **Set Environment Variables**
   In Vercel dashboard, add:
   ```env
   DATABASE_URL=postgresql://user:password@host:5432/database
   NEXTAUTH_SECRET=your-production-secret-here
   NEXTAUTH_URL=https://your-domain.vercel.app
   NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
   NEXT_PUBLIC_SITE_NAME=Kambel Consult
   ```

4. **Deploy!**
   - Click "Deploy"
   - Wait for build to complete
   - Visit your live site!

#### Database Setup (Vercel)

Use a managed PostgreSQL service:

**Vercel Postgres:**
```bash
# In Vercel dashboard
# Storage → Create Database → Postgres
# Vercel will automatically set DATABASE_URL
```

**Or use Neon (Free tier):**
- Visit https://neon.tech
- Create a new project
- Copy the connection string
- Add to Vercel environment variables

### Option 2: Netlify

1. **Build Settings**
   ```
   Build command: npm run build
   Publish directory: .next
   ```

2. **Environment Variables**
   Same as Vercel above

3. **Netlify CLI Deployment**
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify init
   netlify deploy --prod
   ```

### Option 3: Railway

Railway provides easy database and app hosting together.

1. **Create Account**
   - Visit https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   ```bash
   # Install Railway CLI
   npm i -g @railway/cli
   
   # Login
   railway login
   
   # Initialize
   railway init
   
   # Link to GitHub repo
   railway link
   ```

3. **Add PostgreSQL**
   - In Railway dashboard, click "New"
   - Select "Database" → "PostgreSQL"
   - Railway auto-creates `DATABASE_URL`

4. **Configure Build**
   - Add environment variables in dashboard
   - Deploy automatically from GitHub

### Option 4: DigitalOcean App Platform

1. **Create App**
   - Visit https://cloud.digitalocean.com/apps
   - Create App from GitHub repo

2. **Configure**
   ```
   Build Command: npm run build
   Run Command: npm start
   ```

3. **Add Database**
   - Create Managed PostgreSQL database
   - Add `DATABASE_URL` to app environment

### Option 5: AWS (Advanced)

#### Using AWS Amplify:

1. **Push to GitHub**
2. **Connect to Amplify**
   - Visit AWS Amplify Console
   - Connect repository
   - Configure build settings
   - Add environment variables
   - Deploy

#### Using EC2 + RDS (Manual):

1. **Launch EC2 Instance**
   - Ubuntu 22.04 LTS
   - t2.small or larger
   - Open ports 80, 443, 22

2. **Install Dependencies**
   ```bash
   sudo apt update
   sudo apt install nodejs npm nginx
   ```

3. **Clone and Build**
   ```bash
   git clone your-repo
   cd nextjs-kambel
   npm install
   npm run build
   ```

4. **Setup PM2**
   ```bash
   npm install -g pm2
   pm2 start npm --name "kambel-consult" -- start
   pm2 startup
   pm2 save
   ```

5. **Configure Nginx**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

6. **SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

## 🗄️ Database Migration

### From SQLite to PostgreSQL

1. **Export Data**
   ```bash
   npm run prisma:studio
   # Export data manually or use a migration tool
   ```

2. **Update DATABASE_URL**
   ```env
   DATABASE_URL="postgresql://user:password@host:5432/database"
   ```

3. **Run Migration**
   ```bash
   npx prisma migrate deploy
   ```

4. **Seed Production Database**
   ```bash
   npm run prisma:seed
   ```

## 🔧 Production Checklist

### Before Deployment

- [ ] Change default admin password
- [ ] Generate secure `NEXTAUTH_SECRET`
- [ ] Update `NEXTAUTH_URL` to production URL
- [ ] Configure production database
- [ ] Test all features locally in production mode
- [ ] Remove console.logs
- [ ] Add proper error boundaries
- [ ] Setup error monitoring (Sentry)
- [ ] Configure CDN for images
- [ ] Enable HTTPS
- [ ] Setup backup strategy

### Environment Variables

Required in production:
```env
DATABASE_URL=               # PostgreSQL connection string
NEXTAUTH_SECRET=            # Generate with: openssl rand -base64 32
NEXTAUTH_URL=               # Your production URL
NEXT_PUBLIC_APP_URL=        # Your production URL
NEXT_PUBLIC_SITE_NAME=      # Site name
```

Optional:
```env
SMTP_HOST=                  # Email server
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=
```

## 📊 Monitoring & Analytics

### Setup Application Monitoring

**Sentry (Error Tracking):**
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

**Vercel Analytics:**
```bash
npm install @vercel/analytics
```

Add to `layout.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Performance Monitoring

- Use Vercel Speed Insights
- Setup Google Analytics
- Monitor Core Web Vitals

## 🔒 Security Hardening

1. **Rate Limiting**
   ```bash
   npm install @upstash/ratelimit @upstash/redis
   ```

2. **Security Headers**
   Add to `next.config.mjs`:
   ```javascript
   async headers() {
     return [
       {
         source: '/:path*',
         headers: [
           { key: 'X-DNS-Prefetch-Control', value: 'on' },
           { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
           { key: 'X-Content-Type-Options', value: 'nosniff' },
         ],
       },
     ];
   },
   ```

3. **Environment Security**
   - Never commit `.env` files
   - Use different secrets for dev/prod
   - Rotate secrets regularly

## 📈 Scaling

### Database Optimization
- Add indexes to frequently queried fields
- Use connection pooling (PgBouncer)
- Setup read replicas for heavy read loads

### CDN for Images
- Upload images to Cloudinary/AWS S3
- Use Next.js Image Optimization

### Caching
- Enable Next.js caching
- Use Redis for session storage
- CDN caching (Cloudflare)

## 🆘 Troubleshooting

### Build Fails
- Check Node.js version (18+)
- Clear `.next` directory
- Verify all environment variables

### Database Connection Issues
- Verify connection string
- Check database is accessible
- Ensure SSL settings are correct

### Authentication Issues
- Verify `NEXTAUTH_URL` matches deployment URL
- Check `NEXTAUTH_SECRET` is set
- Clear cookies and retry

## 📞 Support

If you encounter issues:
1. Check application logs
2. Review error messages
3. Verify environment variables
4. Test locally first
5. Check deployment platform docs

---

**Deployment successful? Don't forget to:**
- [ ] Test all features in production
- [ ] Setup monitoring
- [ ] Configure backups
- [ ] Update DNS records
- [ ] Setup email alerts
- [ ] Document deployment process for team

Good luck with your deployment! 🚀

