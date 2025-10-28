# DigitalOcean Environment Variables Setup

## 🚨 CRITICAL: Missing Environment Variables

Your deployment is failing because environment variables are not configured in DigitalOcean.

---

## 📋 Required Environment Variables

Add these to your DigitalOcean App Platform settings:

### 1. **DATABASE_URL** (PostgreSQL Connection String)
```
postgresql://username:password@host:5432/database_name?sslmode=require
```

⚠️ **IMPORTANT**: You CANNOT use SQLite (file:./dev.db) on DigitalOcean!
You need a PostgreSQL database.

### 2. **ADMIN_USERNAME**
```
admin
```
(Or change to your preferred admin username)

### 3. **ADMIN_PASSWORD**
```
YourSecurePassword123!
```
⚠️ **Change this to a strong, unique password!**

### 4. **NEXT_PUBLIC_SITE_URL**
```
https://your-app-name.ondigitalocean.app
```
(Replace with your actual DigitalOcean app URL)

---

## 🗄️ Step 1: Set Up PostgreSQL Database

Choose one of these options:

### **Option A: DigitalOcean Managed Database** ($15/month)
1. In DigitalOcean Dashboard → **Create** → **Databases**
2. Select **PostgreSQL**
3. Choose the **Basic** plan ($15/month)
4. Click **Create Database Cluster**
5. Once created, go to **Connection Details**
6. Copy the **Connection String** (looks like `postgresql://...`)

### **Option B: Free PostgreSQL (Perfect for Testing)**

**Neon.tech** (Recommended - Free tier available):
1. Go to https://neon.tech
2. Sign up with GitHub or Google
3. Click **"Create Project"**
4. Copy the **Connection String** from the dashboard
5. Use this as your `DATABASE_URL`

**Alternatives:**
- **Supabase**: https://supabase.com (Free tier)
- **Railway**: https://railway.app (Free tier)
- **ElephantSQL**: https://www.elephantsql.com (Free tier)

---

## ⚙️ Step 2: Configure Environment Variables in DigitalOcean

### In DigitalOcean Dashboard:

1. Go to your app: https://cloud.digitalocean.com/apps
2. Click on your app name
3. Click the **"Settings"** tab
4. Scroll down to **"App-Level Environment Variables"**
5. Click **"Edit"**
6. Add each variable:

#### Add Variable 1:
```
Key:   DATABASE_URL
Value: postgresql://your-connection-string-here
```

#### Add Variable 2:
```
Key:   ADMIN_USERNAME
Value: admin
```

#### Add Variable 3:
```
Key:   ADMIN_PASSWORD
Value: YourSecurePassword123!
```

#### Add Variable 4:
```
Key:   NEXT_PUBLIC_SITE_URL
Value: https://your-app-name.ondigitalocean.app
```

7. Click **"Save"**
8. DigitalOcean will automatically trigger a new deployment ✅

---

## 🔄 Step 3: Apply Database Migrations

After your app deploys successfully, you need to set up the database schema.

### **Option A: Using DigitalOcean Console** (Easiest)

1. In your app dashboard, click the **"Console"** tab
2. Click **"Open Console"**
3. Run these commands:
```bash
npx prisma migrate deploy
npx prisma db seed
```

### **Option B: From Your Local Machine**

1. Create a temporary file `.env.production` locally:
```bash
DATABASE_URL="postgresql://your-production-connection-string"
```

2. Run migrations:
```bash
# Load production environment
export $(cat .env.production | xargs)

# Run migrations
npx prisma migrate deploy
npx prisma db seed

# Clean up
unset DATABASE_URL
```

---

## ✅ Verification Checklist

After setup, verify:

- [ ] PostgreSQL database is created and accessible
- [ ] All 4 environment variables are set in DigitalOcean
- [ ] App deployed successfully (no build errors)
- [ ] Database migrations applied (`prisma migrate deploy`)
- [ ] Database seeded with initial data (`prisma db seed`)
- [ ] Can access your app at `https://your-app-name.ondigitalocean.app`
- [ ] Can login to admin at `/admin/login` with your credentials

---

## 🐛 Troubleshooting

### "Build Failed - TypeScript Error"
✅ **Already Fixed!** The latest commit (2aec444) fixed this.

### "Database Connection Failed"
- Check that `DATABASE_URL` is correctly formatted
- Ensure database allows connections from DigitalOcean IPs
- Verify database credentials are correct

### "Cannot find module '@prisma/client'"
- Run `npx prisma generate` in the console after deployment

### "App is slow / timeout"
- Make sure you're using a managed PostgreSQL, not a free tier with sleep mode
- Check DigitalOcean app logs for slow queries

---

## 🎯 Quick Reference: PostgreSQL Connection String Format

```
postgresql://[username]:[password]@[host]:[port]/[database]?sslmode=require
```

**Example:**
```
postgresql://user123:mypass@db-postgresql-nyc3-12345.ondigitalocean.com:25060/kambel?sslmode=require
```

---

## 📞 Need Help?

1. **Check DigitalOcean Logs**: App → "Runtime Logs" tab
2. **Check Build Logs**: App → "Deployments" tab → Click on latest deployment
3. **Common Issues**: See DIGITALOCEAN_DEPLOYMENT.md for more troubleshooting

---

## 🚀 After Setup

Once everything is deployed:

1. Visit your app: `https://your-app-name.ondigitalocean.app`
2. Login to admin: `https://your-app-name.ondigitalocean.app/admin/login`
3. Start managing your content!

**Note**: Remember to update `NEXT_PUBLIC_SITE_URL` if you add a custom domain later.

