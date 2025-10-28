# DigitalOcean Deployment Guide

This guide will help you deploy the Kambel Consult application to DigitalOcean.

## Deployment Options

You have two main options for deploying on DigitalOcean:

1. **DigitalOcean App Platform** (Recommended for beginners)
2. **Docker Droplet** (More control and flexibility)

---

## Option 1: DigitalOcean App Platform (Easiest)

### Prerequisites
- DigitalOcean account
- GitHub account with your code pushed

### Steps

#### 1. **Prepare Your Repository**
Your code is already in GitHub at: `https://github.com/danielagblo/kambelnew.git`

#### 2. **Create App on DigitalOcean**
1. Log into DigitalOcean
2. Click "Create" → "Apps"
3. Connect your GitHub account
4. Select repository: `danielagblo/kambelnew`
5. Select branch: `main`

#### 3. **Configure Build Settings**
- **Build Command:** `npm ci && npx prisma generate && npm run build`
- **Run Command:** `npx prisma migrate deploy && npm start`
- **HTTP Port:** `3000`

#### 4. **Set Environment Variables**
Add these in the App Platform dashboard:

```bash
# Database
DATABASE_URL=file:./prod.db

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password_here

# Site URL (will be provided by DigitalOcean)
NEXT_PUBLIC_SITE_URL=https://your-app-name.ondigitalocean.app
```

#### 5. **Add Database (Optional - PostgreSQL)**
For production, it's recommended to use PostgreSQL instead of SQLite:

```bash
# In App Platform, add a Managed Database (PostgreSQL)
# Then update your DATABASE_URL:
DATABASE_URL=postgresql://username:password@host:port/database?schema=public
```

#### 6. **Deploy**
- Click "Deploy"
- Wait for build to complete (5-10 minutes)
- Your app will be live at `https://your-app-name.ondigitalocean.app`

---

## Option 2: Docker Droplet Deployment

### Prerequisites
- DigitalOcean account
- SSH key configured

### Steps

#### 1. **Create a Droplet**
1. Click "Create" → "Droplets"
2. Choose:
   - **Image:** Docker (from Marketplace)
   - **Plan:** Basic ($12/month minimum recommended)
   - **CPU:** Regular (2GB RAM minimum)
   - **Datacenter:** Choose closest to your users
3. Add your SSH key
4. Create Droplet

#### 2. **SSH into Your Droplet**
```bash
ssh root@your_droplet_ip
```

#### 3. **Clone Your Repository**
```bash
cd /root
git clone https://github.com/danielagblo/kambelnew.git
cd kambelnew
```

#### 4. **Create Environment File**
```bash
nano .env.production
```

Add:
```bash
# Database
DATABASE_URL=file:./prod.db

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password_here

# Site URL
NEXT_PUBLIC_SITE_URL=http://your_droplet_ip
```

#### 5. **Build and Run with Docker**
```bash
# Build the Docker image
docker build -t kambel-app .

# Run the container
docker run -d \
  --name kambel-app \
  -p 80:3000 \
  --env-file .env.production \
  -v /root/kambel-data:/app/public/uploads \
  -v /root/kambel-db:/app/prisma \
  --restart unless-stopped \
  kambel-app
```

#### 6. **Set Up Domain (Optional)**
1. Point your domain to Droplet IP
2. Install Nginx and SSL:

```bash
# Install Nginx
apt update
apt install nginx

# Configure Nginx
nano /etc/nginx/sites-available/kambel
```

Add:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

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

```bash
# Enable site
ln -s /etc/nginx/sites-available/kambel /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx

# Install SSL with Let's Encrypt
apt install certbot python3-certbot-nginx
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

#### 7. **Verify Deployment**
```bash
# Check if container is running
docker ps

# View logs
docker logs kambel-app

# Restart if needed
docker restart kambel-app
```

---

## Post-Deployment Steps

### 1. **Initialize Database**
On first deployment, seed your database:

```bash
# If using Docker
docker exec -it kambel-app npx prisma db seed

# If using App Platform, use the console
npx prisma db seed
```

### 2. **Test Admin Access**
1. Visit: `https://your-domain.com/admin/login`
2. Login with your admin credentials
3. Configure site settings

### 3. **Set Up Backups**

#### For App Platform:
- Enable automatic backups in settings
- Set up DigitalOcean Spaces for file storage

#### For Droplet:
```bash
# Create backup script
nano /root/backup.sh
```

Add:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/root/backups"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database
docker exec kambel-app npx prisma db push --force-reset
cp /root/kambel-db/prod.db $BACKUP_DIR/db_$DATE.db

# Backup uploads
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz /root/kambel-data

# Keep only last 7 days
find $BACKUP_DIR -type f -mtime +7 -delete

echo "Backup completed: $DATE"
```

```bash
# Make executable
chmod +x /root/backup.sh

# Add to crontab (daily at 2 AM)
crontab -e
# Add: 0 2 * * * /root/backup.sh
```

---

## Environment Variables Reference

### Required Variables
```bash
DATABASE_URL=              # Database connection string
ADMIN_USERNAME=            # Admin username
ADMIN_PASSWORD=            # Admin password (use strong password!)
NEXT_PUBLIC_SITE_URL=      # Your site URL
```

### Optional Variables
```bash
NODE_ENV=production        # Set to production
PORT=3000                  # Server port (default: 3000)
```

---

## Updating Your Application

### App Platform
1. Push changes to GitHub
2. App Platform will auto-deploy

### Docker Droplet
```bash
# SSH into droplet
ssh root@your_droplet_ip

# Navigate to project
cd /root/kambelnew

# Pull latest changes
git pull origin main

# Rebuild and restart
docker stop kambel-app
docker rm kambel-app
docker build -t kambel-app .
docker run -d \
  --name kambel-app \
  -p 80:3000 \
  --env-file .env.production \
  -v /root/kambel-data:/app/public/uploads \
  -v /root/kambel-db:/app/prisma \
  --restart unless-stopped \
  kambel-app
```

---

## Troubleshooting

### App Won't Start
```bash
# Check logs
docker logs kambel-app

# Common issues:
# 1. Missing environment variables
# 2. Database connection issues
# 3. Port already in use
```

### Database Issues
```bash
# Reset database (CAUTION: Deletes all data)
docker exec -it kambel-app npx prisma migrate reset

# Run migrations manually
docker exec -it kambel-app npx prisma migrate deploy
```

### Out of Memory
- Upgrade your droplet to at least 2GB RAM
- App Platform: Upgrade to higher tier

### File Upload Issues
```bash
# Check permissions
docker exec -it kambel-app ls -la /app/public/uploads

# Fix permissions
docker exec -it kambel-app chown -R nextjs:nodejs /app/public/uploads
```

---

## Security Recommendations

1. **Strong Passwords**
   - Use strong admin password
   - Change default credentials

2. **HTTPS**
   - Always use SSL/TLS
   - Use Let's Encrypt (free)

3. **Firewall**
   ```bash
   # Configure UFW
   ufw allow OpenSSH
   ufw allow 'Nginx Full'
   ufw enable
   ```

4. **Regular Updates**
   ```bash
   apt update
   apt upgrade
   docker pull node:18-alpine
   ```

5. **Environment Variables**
   - Never commit `.env` files
   - Use secrets management
   - Rotate credentials regularly

---

## Cost Estimate

### App Platform
- **Starter:** $5-12/month
- **Basic:** $12-24/month
- **Professional:** $24+/month

### Docker Droplet
- **Basic (2GB):** $12/month
- **General (4GB):** $24/month
- **+ Domain:** $10-15/year
- **+ SSL:** Free (Let's Encrypt)

**Recommended:** Start with $12/month option

---

## Support

- **DigitalOcean Docs:** https://docs.digitalocean.com
- **Next.js Docs:** https://nextjs.org/docs
- **Prisma Docs:** https://www.prisma.io/docs

---

## Next Steps

1. Choose deployment method
2. Set up DigitalOcean account
3. Follow the steps above
4. Configure your domain
5. Test thoroughly
6. Set up backups
7. Monitor your application

**Your app will be live at:** `https://your-app.ondigitalocean.app` or your custom domain!

