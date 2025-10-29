# Prisma P1002 Error - Troubleshooting Guide

## Error: P1002 - Database Connection Failed

This error occurs when Prisma cannot connect to your PostgreSQL database. Here's how to fix it:

## Common Causes & Solutions

### 1. Missing or Incorrect DATABASE_URL

**Problem:** The `DATABASE_URL` environment variable is not set or is incorrect.

**Solution:**
- Check that `DATABASE_URL` is set in your deployment platform (Vercel, Railway, etc.)
- Verify the connection string format:
  ```
  postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
  ```

### 2. Database Doesn't Exist

**Problem:** The database specified in `DATABASE_URL` doesn't exist yet.

**Solution:**
- Create the database first in your PostgreSQL provider
- For Neon, Vercel Postgres, or Railway, the database is usually auto-created
- For manual setups, create it:
  ```sql
  CREATE DATABASE your_database_name;
  ```

### 3. SSL Connection Required

**Problem:** Many cloud PostgreSQL providers require SSL connections.

**Solution:**
Add SSL parameters to your `DATABASE_URL`:
```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require
```

Or for stricter SSL:
```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require&sslcert=&sslkey=&sslrootcert=
```

### 4. Connection Pooling Issues

**Problem:** Some providers (like Supabase, Neon) require connection pooling.

**Solution:**
- Use the pooled connection string (usually has `-pooler` in the hostname)
- Or add pooling parameters:
  ```
  postgresql://USER:PASSWORD@HOST:PORT/DATABASE?connection_limit=1
  ```

### 5. Network/Firewall Restrictions

**Problem:** The database server is not accessible from your deployment environment.

**Solution:**
- Check firewall rules allow connections from your deployment platform
- For Vercel, allow connections from Vercel IPs
- Some providers (like Railway) automatically whitelist connected services

### 6. Wrong Database Provider

**Problem:** Schema or migration is incompatible with your database.

**Solution:**
- Ensure you're using PostgreSQL (not MySQL or SQLite)
- Check your `prisma/schema.prisma` has `provider = "postgresql"`

## Deployment-Specific Fixes

### Vercel Deployment

1. **Using Vercel Postgres:**
   - Go to Vercel Dashboard → Your Project → Storage
   - Create a Postgres database
   - Vercel automatically sets `DATABASE_URL`

2. **Using External Database (Neon, Supabase, etc.):**
   - Get connection string from provider
   - Add to Vercel Environment Variables
   - **Important:** For Neon, use the pooled connection string ending with `?sslmode=require`
   - For Supabase, use the connection pooling URL

3. **Add Build Command:**
   In Vercel project settings, ensure you have:
   ```bash
   Build Command: npm run build
   ```
   
   And add this as an install command (if needed):
   ```bash
   Install Command: npm install && npx prisma generate
   ```

### Railway Deployment

1. **Add PostgreSQL:**
   - Railway auto-creates `DATABASE_URL`
   - Check it's set in Environment Variables

2. **Migration Command:**
   - Railway runs migrations automatically during build
   - If not, add to `railway.json`:
   ```json
   {
     "build": {
       "builder": "NIXPACKS",
       "buildCommand": "npm install && npx prisma generate && npm run build"
     },
     "deploy": {
       "startCommand": "npm start",
       "restartPolicyType": "ON_FAILURE",
       "restartPolicyMaxRetries": 10
     }
   }
   ```

### Manual/EC2 Deployment

1. **Verify Database is Running:**
   ```bash
   sudo systemctl status postgresql
   ```

2. **Test Connection:**
   ```bash
   psql -h localhost -U your_user -d your_database
   ```

3. **Run Migration Manually:**
   ```bash
   npx prisma migrate deploy
   # or
   npx prisma db push
   ```

## Quick Fixes to Try

### Option 1: Update DATABASE_URL Format

If your provider requires SSL, update your connection string:

```bash
# Original (may fail)
DATABASE_URL="postgresql://user:pass@host:5432/db"

# With SSL (usually works)
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"

# For connection pooling (Neon, Supabase)
DATABASE_URL="postgresql://user:pass@host-pooler.region.provider.com/db?sslmode=require"
```

### Option 2: Add Direct URL for Migrations

Some platforms need a direct URL (non-pooled) for migrations:

```bash
# Pooled URL for application
DATABASE_URL="postgresql://user:pass@host-pooler.region.provider.com/db?sslmode=require"

# Direct URL for migrations
DIRECT_URL="postgresql://user:pass@host.region.provider.com/db?sslmode=require"
```

Then update `prisma/schema.prisma`:
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

### Option 3: Verify Environment Variables are Set

In your deployment platform, verify:
- [ ] `DATABASE_URL` is set
- [ ] `NEXTAUTH_SECRET` is set  
- [ ] `NEXTAUTH_URL` is set
- [ ] `NEXT_PUBLIC_APP_URL` is set

### Option 4: Test Connection Locally

Before deploying, test locally:

```bash
# Set DATABASE_URL
export DATABASE_URL="your-connection-string"

# Test connection
npx prisma db pull

# Run migrations
npx prisma migrate deploy

# Generate client
npx prisma generate
```

## Recommended Database Providers

### Free Tier Options:

1. **Neon** (Recommended)
   - Free tier: 0.5GB storage
   - Serverless PostgreSQL
   - Use pooled connection string
   - https://neon.tech

2. **Supabase**
   - Free tier: 500MB database
   - Includes other features
   - https://supabase.com

3. **Vercel Postgres**
   - Free tier: Limited storage
   - Integrated with Vercel
   - https://vercel.com/docs/storage/vercel-postgres

4. **Railway**
   - Free tier: $5 credit/month
   - Easy setup
   - https://railway.app

## Post-Deployment Steps

Once connected successfully:

1. **Run Migrations:**
   ```bash
   npx prisma migrate deploy
   ```

2. **Seed Database (if needed):**
   ```bash
   npm run prisma:seed
   ```

3. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```

4. **Verify Connection:**
   ```bash
   npx prisma studio
   ```

## Still Having Issues?

1. Check deployment logs for more details
2. Verify database provider documentation
3. Test connection string with `psql` or database GUI
4. Ensure database server is accessible from deployment platform
5. Check if database has connection limits reached

## Example Correct DATABASE_URL Formats

### Neon:
```
postgresql://user:pass@ep-xxxxx-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require
```

### Supabase:
```
postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres?sslmode=require
```

### Vercel Postgres:
```
postgres://default:xxxxx@xxx.xxxxx.aws.neon.tech:5432/verceldb?sslmode=require
```

### Railway:
```
postgresql://postgres:pass@containers-us-west-xxx.railway.app:5432/railway
```

