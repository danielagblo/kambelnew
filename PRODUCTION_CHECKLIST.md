# 🚀 Production Deployment Checklist for DigitalOcean

## ✅ Pre-Deployment Checklist

### 1. **Environment Variables** (CRITICAL)
Configure these in DigitalOcean App Platform → Settings → Environment Variables:

- [ ] `DATABASE_URL` - PostgreSQL connection with SSL
  ```
  postgresql://username:password@host:port/database?sslmode=require
  ```
  OR use DigitalOcean database reference:
  ```
  ${db.DATABASE_URL}
  ```

- [ ] `ADMIN_USERNAME` - Your admin username (default: `admin`)
- [ ] `ADMIN_PASSWORD` - **Strong password!** (change from default)
- [ ] `NEXT_PUBLIC_SITE_URL` - Your DigitalOcean app URL
  ```
  https://your-app-name.ondigitalocean.app
  ```

---

### 2. **Database Setup** (REQUIRED)
- [ ] PostgreSQL database created (DigitalOcean Managed DB, Neon, Supabase, etc.)
- [ ] Connection string includes `?sslmode=require`
- [ ] Database is linked to your app (if using DigitalOcean Managed DB)

---

### 3. **Code Deployment**
- [x] Code pushed to GitHub repository
- [x] Node.js version set to 22.x
- [x] Prisma provider changed to PostgreSQL
- [x] SSL configuration added

---

### 4. **DigitalOcean App Configuration**
- [ ] App created in DigitalOcean App Platform
- [ ] GitHub repository connected
- [ ] Branch set to `main`
- [ ] Build command: `npm run build`
- [ ] Run command: `npm start`
- [ ] Environment variables configured

---

## 🔧 Post-Deployment Steps

### 1. **Database Migration** (CRITICAL - Do this FIRST after deployment)

Once your app is deployed, you MUST run migrations to create database tables:

#### Option A: Using DigitalOcean Console
1. Go to your app in DigitalOcean
2. Click **Console** tab
3. Run these commands:
```bash
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
```

#### Option B: Using Run Command (Recommended)
Add this to your app's **Run Command** in DigitalOcean settings:
```bash
npx prisma migrate deploy && npm start
```

---

### 2. **Verify Deployment**
- [ ] App is accessible at your DigitalOcean URL
- [ ] Admin login works: `https://your-app.ondigitalocean.app/admin/login`
- [ ] Database connection successful (no Prisma errors)
- [ ] Images upload correctly
- [ ] All pages load without errors

---

### 3. **Initial Setup**
After successful deployment:

1. **Login to Admin Panel**
   ```
   URL: https://your-app.ondigitalocean.app/admin/login
   Username: admin (or your configured username)
   Password: your_configured_password
   ```

2. **Configure Site Settings**
   - Go to **Settings** in admin panel
   - Update site name, contact info, social media links
   - Set up hero section
   - Configure about page

3. **Add Content**
   - Create blog posts
   - Add publications
   - Set up masterclasses
   - Add gallery items

---

## 🔒 Security Checklist

- [ ] **Change default admin password** (CRITICAL!)
- [ ] Admin password is strong (12+ characters, mixed case, numbers, symbols)
- [ ] Database credentials are secure
- [ ] SSL/HTTPS is enabled (automatic with DigitalOcean)
- [ ] Environment variables are not in source code

---

## 📊 Performance Optimization

- [x] Next.js standalone build configured
- [x] Production build optimizations enabled
- [ ] Consider enabling CDN for static assets
- [ ] Monitor app performance in DigitalOcean dashboard

---

## 🐛 Common Issues & Solutions

### **Issue 1: "Environment variable not found: DATABASE_URL"**
**Solution:** Configure DATABASE_URL in DigitalOcean environment variables

### **Issue 2: "no pg_hba.conf entry" or SSL errors**
**Solution:** Add `?sslmode=require` to your DATABASE_URL

### **Issue 3: Build succeeds but app crashes**
**Solution:** 
1. Check DigitalOcean logs
2. Verify all environment variables are set
3. Ensure database is accessible

### **Issue 4: "Prisma Client not initialized"**
**Solution:** Run `npx prisma generate && npx prisma migrate deploy`

### **Issue 5: 404 on all pages**
**Solution:** Check that build completed successfully and Run Command is `npm start`

---

## 📝 Monitoring & Maintenance

### Daily Checks
- [ ] Check DigitalOcean app status
- [ ] Monitor error rates in logs
- [ ] Review analytics dashboard

### Weekly Tasks
- [ ] Backup database
- [ ] Review and respond to contact messages
- [ ] Check masterclass registrations

### Monthly Tasks
- [ ] Update dependencies (`npm update`)
- [ ] Review and optimize database
- [ ] Check and renew SSL certificates (if custom domain)

---

## 🆘 Getting Help

If deployment fails:

1. **Check DigitalOcean Logs**
   - Go to your app → Logs tab
   - Look for specific error messages

2. **Common Log Locations**
   - Build logs: Shows compilation errors
   - Runtime logs: Shows app crashes
   - Database logs: Shows connection issues

3. **Debug Steps**
   ```bash
   # Check environment variables
   echo $DATABASE_URL
   
   # Test database connection
   npx prisma db pull
   
   # Regenerate Prisma client
   npx prisma generate
   ```

---

## ✅ Deployment Success Indicators

Your deployment is successful when:
- ✅ App URL loads without errors
- ✅ Admin login works
- ✅ You can create and view content
- ✅ Images upload and display correctly
- ✅ Analytics tracking works
- ✅ Forms submit successfully
- ✅ No errors in DigitalOcean logs

---

## 🎯 Next Steps After Successful Deployment

1. **Custom Domain** (Optional)
   - Add your custom domain in DigitalOcean
   - Update DNS records
   - Update `NEXT_PUBLIC_SITE_URL` environment variable

2. **Email Configuration** (Optional)
   - Set up email service (SendGrid, Mailgun, etc.)
   - Configure SMTP settings
   - Test contact form emails

3. **Backup Strategy**
   - Set up automated database backups
   - Export uploaded files regularly
   - Keep a local development copy

4. **Scaling** (As needed)
   - Monitor resource usage
   - Upgrade app tier if needed
   - Consider database connection pooling

---

## 📚 Additional Resources

- [DigitalOcean App Platform Docs](https://docs.digitalocean.com/products/app-platform/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma Production Guide](https://www.prisma.io/docs/guides/deployment)

---

**🎉 Your Kambel Consult website is now production-ready!**

